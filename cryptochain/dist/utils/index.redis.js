"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blockchain_1 = require("../blockchain");
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const pubsub_1 = require("../pubsub");
const axios_1 = __importDefault(require("axios"));
const transaction_miner_1 = require("../transaction-miner");
const cors_1 = __importDefault(require("cors"));
const wallet_1 = require("../wallet");
(0, dotenv_1.config)();
const ROOT_NODE_ADDRESS = `http://localhost:${process.env.DEFAULT_PORT}`;
const app = (0, express_1.default)();
const blockchain = new blockchain_1.Blockchain();
const transactionPool = new wallet_1.TransactionPool();
const wallet = new wallet_1.Wallet();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const pubSub = new pubsub_1.RedisPubSub({ blockchain, transactionPool });
const transactionMiner = new transaction_miner_1.TransactionMiner({
    blockchain,
    transactionPool,
    pubSub,
    wallet,
});
(async () => {
    // we first want to connect to our redis api
    if (await (0, pubsub_1.connect)(pubSub)) {
        app.get("/api/blocks", (req, res, next) => {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            });
            const interval = setInterval(() => {
                res.write(`data: ${JSON.stringify({ chain: blockchain.chain })}\n\n`);
            }, 1000);
            req.on("close", () => {
                clearInterval(interval);
                res.end();
            });
        });
        app.post("/api/mine", async (req, res, next) => {
            const { data } = req.body;
            blockchain.addBlock(data);
            await pubSub.broadcastChain();
            res.redirect("/api/blocks");
        });
        app.post("/api/transact", async (req, res, next) => {
            const { amount, recipient } = req.body;
            let transaction = transactionPool.existingTransaction({
                inputAddress: wallet.publicKey,
            });
            try {
                if (!!transaction && transaction instanceof wallet_1.Transaction) {
                    transaction.update({
                        senderWallet: wallet,
                        recipient,
                        amount,
                    });
                }
                else if (transaction === undefined) {
                    transaction = wallet.createTransaction({
                        recipient,
                        amount,
                        chain: blockchain.chain,
                    });
                }
                else {
                }
            }
            catch (error) {
                res.status(400).json({
                    type: "error",
                    message: error.message,
                });
                return;
            }
            transactionPool.setTransaction(transaction);
            await pubSub.broadcastTransaction(transaction);
            res.json({ transaction });
        });
        app.get("/api/transaction-pool-map", (req, res, next) => {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            });
            const interval = setInterval(() => {
                res.write(`data: ${JSON.stringify(transactionPool.transactionMap)}\n\n`);
            }, 1000);
            req.on("close", () => {
                clearInterval(interval);
                res.end();
            });
        });
        app.get("/api/mine-transactions", (req, res, next) => {
            transactionMiner.mineTransaction();
            res.redirect("/api/blocks");
        });
        app.get("/api/wallet-info", (req, res, next) => {
            const address = wallet.publicKey;
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            });
            const interval = setInterval(() => {
                res.write(`data: ${JSON.stringify({
                    address,
                    balance: wallet_1.Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address,
                    }),
                })}\n\n`);
            }, 1000);
            req.on("close", () => {
                clearInterval(interval);
                res.end();
            });
        });
        const syncWithRootState = async () => {
            try {
                const chainRequest = await axios_1.default.get(`${ROOT_NODE_ADDRESS}/api/blocks`);
                if (chainRequest.status === 200) {
                    const chain = await chainRequest.data;
                    console.log("replace chain on a sync with", chain);
                    blockchain.replaceChain(chain);
                }
                else {
                    throw new Error("Error while fetching the Blockchain");
                }
            }
            catch (error) {
                console.log(error);
            }
            try {
                const poolRequest = await axios_1.default.get(`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`);
                if (poolRequest.status === 200) {
                    const pool = await poolRequest.data;
                    console.log("replace pool on sync with", pool);
                    transactionPool.setTransactionMap(pool);
                }
                else {
                    throw new Error("Error while fetching the transaction pool map");
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        let PEER_PORT;
        if (process.env.GENERATE_PEER_PORT === "true") {
            PEER_PORT =
                parseInt(process.env.DEFAULT_PORT) +
                    Math.ceil(Math.random() * 1000);
        }
        app.listen(PEER_PORT ?? process.env.DEFAULT_PORT, async () => {
            console.log(`Listening at localhost:${PEER_PORT ?? process.env.DEFAULT_PORT}`);
            if (!!PEER_PORT)
                await syncWithRootState();
        });
    }
})();

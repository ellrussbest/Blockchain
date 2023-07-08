import express from "express";
import { Blockchain } from "../blockchain";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { RedisPubSub, connect } from "../pubsub";
import axios from "axios";
import { TransactionPool, Wallet, Transaction } from "../wallet";

config();
const ROOT_NODE_ADDRESS = `http://localhost:${process.env.DEFAULT_PORT}`;

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();

app.use(bodyParser.json());

const pubSub = new RedisPubSub({ blockchain, transactionPool });

(async () => {
  // we first want to connect to our redis api
  if (await connect(pubSub)) {
    app.get("/api/blocks", (req, res, next) => {
      res.json({
        chain: blockchain.chain,
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

      let transaction: Transaction | undefined =
        transactionPool.existingTransaction({
          inputAddress: wallet.publicKey,
        });

      try {
        if (!!transaction) {
          transaction.update({
            senderWallet: wallet,
            recipient,
            amount,
          });
        } else {
          transaction = wallet.createTransaction({
            recipient,
            amount,
          });
        }
      } catch (error: any) {
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
      res.json(transactionPool.transactionMap);
    });

    const syncWithRootState = async () => {
      try {
        const chainRequest = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);

        if (chainRequest.status === 200) {
          const chain = await chainRequest.data;

          console.log("replace chain on a sync with", chain);
          blockchain.replaceChain(chain);
        } else {
          throw new Error("Error while fetching the Blockchain");
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const poolRequest = await axios.get(
          `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`
        );

        if (poolRequest.status === 200) {
          const pool = await poolRequest.data;

          console.log("replace pool on sync with", pool);
          transactionPool.setTransactionMap(pool);
        } else {
          throw new Error("Error while fetching the transaction pool map");
        }
      } catch (error) {
        console.log(error);
      }
    };

    let PEER_PORT: undefined | number;

    if (process.env.GENERATE_PEER_PORT === "true") {
      PEER_PORT =
        parseInt(process.env.DEFAULT_PORT) + Math.ceil(Math.random() * 1000);
    }

    app.listen(PEER_PORT ?? process.env.DEFAULT_PORT, async () => {
      console.log(
        `Listening at localhost:${PEER_PORT ?? process.env.DEFAULT_PORT}`
      );

      if (!!PEER_PORT) await syncWithRootState();
    });
  }
})();

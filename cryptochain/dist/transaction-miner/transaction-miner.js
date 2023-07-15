"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("../wallet");
class TransactionMiner {
    blockchain;
    transactionPool;
    wallet;
    pubSub;
    constructor(params) {
        const { blockchain, transactionPool, wallet, pubSub } = params;
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubSub = pubSub;
    }
    mineTransaction() {
        // get the transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransactions();
        if (validTransactions.length > 0) {
            // generate the miner's reward
            validTransactions.push(new wallet_1.transaction.BlockRewardTx({
                minerWallet: this.wallet,
            }));
            // add a block consisting of these transactions to the blockchain
            this.blockchain.addBlock(validTransactions);
            // broadcast the updated blockchain
            this.pubSub.broadcastChain();
            // clear the pool
            this.transactionPool.clear();
        }
    }
}
exports.default = TransactionMiner;

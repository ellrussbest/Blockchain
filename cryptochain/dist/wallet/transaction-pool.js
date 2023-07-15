"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class TransctionPool {
    transactionMap;
    constructor() {
        this.transactionMap = {};
    }
    clear() {
        this.transactionMap = {};
    }
    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
    setTransactionMap(transactionMap) {
        this.transactionMap = transactionMap;
    }
    existingTransaction(params) {
        const transactions = Object.values(this.transactionMap);
        const transaction = transactions.find((transaction) => transaction.input.address === params.inputAddress);
        return transaction;
    }
    validTransactions() {
        let transactions = Object.values(this.transactionMap);
        return transactions.filter((transaction) => transaction instanceof _1.Transaction &&
            (0, _1.validateTransaction)(transaction));
    }
    clearBlockchainTransactions(params) {
        for (let i = 1; i < params.chain.length; i++) {
            const block = params.chain[i];
            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}
exports.default = TransctionPool;

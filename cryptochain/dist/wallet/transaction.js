"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardTransaction = exports.validateTransaction = exports.transaction = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
var transaction;
(function (transaction_1) {
    transaction_1.validateTransaction = (transaction) => {
        const { input: { address, amount, signature }, outputMap, } = transaction;
        const outputTotal = Object.values(outputMap).reduce((prev, curr) => prev + curr, 0);
        if (amount !== outputTotal) {
            console.error(`Invalid transaction ${address}`);
            return false;
        }
        if (!(0, utils_1.verifySignature)({
            publicKey: address,
            data: outputMap,
            signature,
        })) {
            console.error(`Invalid signature from ${address}`);
            return false;
        }
        return true;
    };
    transaction_1.rewardTransaction = (params) => {
        return new BlockRewardTx(params);
    };
    class Transaction {
        id;
        outputMap;
        input;
        constructor(params) {
            const { senderWallet, recipient, amount } = params;
            this.id = (0, uuid_1.v1)();
            // this should map the recipients amount and reciever's updated balance
            this.outputMap = {
                [recipient]: amount,
                [senderWallet.publicKey]: senderWallet.balance - amount,
            };
            this.input = {
                timestamp: Date.now(),
                amount: senderWallet.balance,
                address: senderWallet.publicKey,
                signature: senderWallet.sign(this.outputMap),
            };
        }
        update(params) {
            const { senderWallet, recipient, amount } = params;
            if (amount > this.outputMap[senderWallet.publicKey])
                throw new Error("Amount exceeds balance");
            // if recipient has ever received any transaction, then we should just update it
            // else we should create a new transaction
            if (this.outputMap[recipient]) {
                this.outputMap[recipient] = this.outputMap[recipient] + amount;
            }
            else
                this.outputMap[recipient] = amount;
            this.outputMap[senderWallet.publicKey] =
                this.outputMap[senderWallet.publicKey] - amount;
            this.input = {
                timestamp: Date.now(),
                amount: senderWallet.balance,
                address: senderWallet.publicKey,
                signature: senderWallet.sign(this.outputMap),
            };
        }
    }
    transaction_1.Transaction = Transaction;
    class BlockRewardTx {
        id;
        input;
        outputMap;
        constructor(params) {
            this.id = (0, uuid_1.v1)();
            this.input = utils_1.REWARD_INPUT;
            this.outputMap = { [params.minerWallet.publicKey]: utils_1.MINING_REWARD };
        }
    }
    transaction_1.BlockRewardTx = BlockRewardTx;
})(transaction || (exports.transaction = transaction = {}));
exports.default = transaction.Transaction;
exports.validateTransaction = transaction.validateTransaction, exports.rewardTransaction = transaction.rewardTransaction;

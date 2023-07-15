"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const transaction_1 = __importDefault(require("./transaction"));
class Wallet {
    balance;
    publicKey;
    keyPair;
    constructor() {
        this.balance = utils_1.STARTING_BALANCE;
        this.keyPair = utils_1.ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex", true);
    }
    sign(data) {
        return this.keyPair.sign((0, utils_1.cryptoHash)(JSON.stringify(data)));
    }
    createTransaction(params) {
        if (!!params.chain) {
            this.balance = Wallet.calculateBalance({
                chain: params.chain,
                address: this.publicKey,
            });
        }
        if (params.amount > this.balance) {
            throw new Error("Amount exceeds balance");
        }
        return new transaction_1.default({
            senderWallet: this,
            recipient: params.recipient,
            amount: params.amount,
        });
    }
    static calculateBalance(params) {
        let hasConductedTransaction = false;
        const { chain, address } = params;
        let outputsTotal = 0;
        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];
            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }
                const addressOutput = transaction.outputMap[address];
                if (addressOutput)
                    outputsTotal += transaction.outputMap[address];
            }
            if (hasConductedTransaction)
                break;
        }
        return hasConductedTransaction
            ? outputsTotal
            : utils_1.STARTING_BALANCE + outputsTotal;
    }
}
exports.default = Wallet;

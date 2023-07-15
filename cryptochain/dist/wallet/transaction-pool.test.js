"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_pool_1 = __importDefault(require("./transaction-pool"));
const _1 = require(".");
const _2 = require(".");
const blockchain_1 = require("../blockchain");
describe("TransactionPool", () => {
    let transactionPool, transaction, senderWallet;
    beforeEach(() => {
        transactionPool = new transaction_pool_1.default();
        senderWallet = new _2.Wallet();
        transaction = new _1.Transaction({
            senderWallet,
            recipient: "fake-recipient",
            amount: 50,
        });
    });
    describe("setTransaction()", () => {
        it("adds a transaction", () => {
            transactionPool.setTransaction(transaction);
            // we need the actual object itself, so we need to use a reference
            // of the object... the only way to test this out is
            // through using the toBe... which will test the reference/address of the object itself
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });
    describe("existingTransaction()", () => {
        it("returns an existing transaction given an input address", () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({
                inputAddress: senderWallet.publicKey,
            })).toBe(transaction);
        });
    });
    describe("validTransactions()", () => {
        let validTransactions, errorMock;
        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;
            for (let i = 0; i < 10; i++) {
                transaction = new _1.Transaction({
                    senderWallet,
                    recipient: "any-recipient",
                    amount: 30,
                });
                if (i % 3 === 0) {
                    transaction.input.amount = 999999;
                }
                else if (i % 3 === 1) {
                    transaction.input.signature = new _2.Wallet().sign("foo");
                }
                else {
                    validTransactions.push(transaction);
                }
                transactionPool.setTransaction(transaction);
            }
        });
        it("returns valid transaction", () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });
        it("logs erros for the invalide transactions", () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });
    describe("clear()", () => {
        it("clears the transactions", () => {
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        });
    });
    describe("clearBlockchainTransactions()", () => {
        it("clears the pool of any exisiting blockchain transactions", () => {
            const blockchain = new blockchain_1.Blockchain();
            const expectedTransactionMap = {};
            for (let i = 0; i < 6; i++) {
                const transaction = new _2.Wallet().createTransaction({
                    recipient: "foo",
                    amount: 20,
                });
                transactionPool.setTransaction(transaction);
                if (i % 2 === 0) {
                    blockchain.addBlock([transaction]);
                }
                else {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }
            transactionPool.clearBlockchainTransactions({
                chain: blockchain.chain,
            });
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});

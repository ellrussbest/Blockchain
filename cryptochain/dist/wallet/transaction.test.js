"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const transaction_1 = __importStar(require("./transaction"));
const wallet_1 = __importDefault(require("./wallet"));
describe("Transaction", () => {
    let transaction, senderWallet, recipient, amount;
    beforeEach(() => {
        senderWallet = new wallet_1.default();
        recipient = "recipient-public-key";
        amount = 50;
        transaction = new transaction_1.default({
            senderWallet,
            recipient,
            amount,
        });
    });
    it("has an `id`", () => {
        expect(transaction).toHaveProperty("id");
    });
    describe("outputMap", () => {
        it("has `outputMap`", () => {
            expect(transaction).toHaveProperty("outputMap");
        });
        it("outputs the amount to the recipient", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });
        it("outputs the remainging for the `senderWallet`", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });
    describe("input", () => {
        it("has an `input`", () => {
            expect(transaction).toHaveProperty("input");
        });
        it("has `timestamp` in the input", () => {
            expect(transaction.input).toHaveProperty("timestamp");
        });
        it("sets the `amount` to the `senderWallet` balance", () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });
        it("sets the `address` to the `senderWallet` `publicKey`", () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });
        it("signs the input", () => {
            expect((0, utils_1.verifySignature)({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature,
            })).toBe(true);
        });
    });
    describe("validTransaction()", () => {
        let errorMock;
        beforeEach(() => {
            errorMock = jest.fn();
            global.console.error = errorMock;
        });
        describe("when the transaction is valid", () => {
            it("returns true", () => {
                expect((0, transaction_1.validateTransaction)(transaction)).toBe(true);
            });
        });
        describe("when the transaction is invalid", () => {
            describe("and a transaction outputMap value is invalid", () => {
                it("returns false and logs an error", () => {
                    transaction.outputMap[senderWallet.publicKey] = 999999;
                    expect((0, transaction_1.validateTransaction)(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe("and the transaction input signature is invalid", () => {
                it("returns false and logs an error", () => {
                    transaction.input.signature = new wallet_1.default().sign("data");
                    expect((0, transaction_1.validateTransaction)(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });
    describe("update()", () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;
        describe("and the amount is invalid", () => {
            it("throws an error", () => {
                expect(() => transaction.update({
                    senderWallet,
                    recipient: "foo",
                    amount: 999999,
                })).toThrow("Amount exceeds balance");
            });
        });
        describe("and the amount is valid", () => {
            beforeEach(() => {
                originalSignature = transaction.input.signature;
                originalSenderOutput =
                    transaction.outputMap[senderWallet.publicKey];
                nextRecipient = "foo-recipient";
                nextAmount = 50;
                transaction.update({
                    senderWallet,
                    recipient: nextRecipient,
                    amount: nextAmount,
                });
            });
            it("outputs the amount to the next recipient", () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });
            it("subtracts the amount from original sender output amount", () => {
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
            });
            it("maintains a total output that matches that input amount", () => {
                expect(Object.values(transaction.outputMap).reduce((prev, curr) => prev + curr, 0)).toEqual(transaction.input.amount);
            });
            it("re-signs the transaction", () => {
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });
            describe("and another update for the same recipient", () => {
                let addedAmount;
                beforeEach(() => {
                    addedAmount = 80;
                    transaction.update({
                        senderWallet,
                        recipient: nextRecipient,
                        amount: addedAmount,
                    });
                });
                it("adds to the recipient amount", () => {
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount);
                });
                it("subtracts the amount from original sender output amount", () => {
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount - addedAmount);
                });
            });
        });
    });
    describe("rewardTransaction()", () => {
        let _rewardTransaction;
        let minerWallet;
        beforeEach(() => {
            minerWallet = new wallet_1.default();
            _rewardTransaction = (0, transaction_1.rewardTransaction)({
                minerWallet,
            });
        });
        it("creates a transaction with the reward input", () => {
            expect(_rewardTransaction.input).toEqual(utils_1.REWARD_INPUT);
        });
        it("creates one transaction for the miner with the `MINING_REWARD`", () => {
            expect(_rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(utils_1.MINING_REWARD);
        });
    });
});

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
const wallet_1 = __importDefault(require("./wallet"));
const utils_1 = require("../utils");
const transaction_1 = __importStar(require("./transaction"));
const blockchain_1 = require("../blockchain");
describe("Wallet", () => {
    let wallet;
    beforeEach(() => {
        wallet = new wallet_1.default();
    });
    it("has a `balance`", () => {
        expect(wallet).toHaveProperty("balance");
    });
    it("has a `publicKey`", () => {
        expect(wallet).toHaveProperty("publicKey");
    });
    describe("signing data", () => {
        const data = "foobar";
        it("verifies a signature", () => {
            expect((0, utils_1.verifySignature)({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data),
            })).toBe(true);
        });
        it("it does not verify an invalid signature", () => {
            expect((0, utils_1.verifySignature)({
                publicKey: wallet.publicKey,
                data,
                signature: new wallet_1.default().sign(data),
            })).toBe(false);
        });
    });
    describe("createTransaction()", () => {
        describe("and the amount exceeds the balance", () => {
            it("throws an error", () => {
                expect(() => wallet.createTransaction({
                    amount: 999999,
                    recipient: "foo-recipient",
                })).toThrow("Amount exceeds balance");
            });
        });
        describe("and the amount is valid", () => {
            let transaction, amount, recipient;
            beforeEach(() => {
                amount = 50;
                recipient = "foo-recipient";
                transaction = wallet.createTransaction({
                    amount,
                    recipient,
                });
            });
            it("creates an instance of `Transaction`", () => {
                expect(transaction instanceof transaction_1.default).toBe(true);
            });
            it("matches the transaction input with the wallet", () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });
            it("outputs the amount of the recipient", () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
        describe("and a chain is passed", () => {
            it("calls `Wallet.calculateBalance`", () => {
                const calculateBalanceMock = jest.fn();
                const originaCalculateBalance = wallet_1.default.calculateBalance;
                wallet_1.default.calculateBalance = calculateBalanceMock;
                wallet.createTransaction({
                    recipient: "foo",
                    amount: 10,
                    chain: new blockchain_1.Blockchain().chain,
                });
                expect(calculateBalanceMock).toHaveBeenCalled();
                wallet_1.default.calculateBalance = originaCalculateBalance;
            });
        });
    });
    describe("calculateBalance()", () => {
        let blockchain;
        beforeEach(() => {
            blockchain = new blockchain_1.Blockchain();
        });
        describe("and there are no outputs for the wallet", () => {
            it("returns the `STARTING_BALANCE`", () => {
                expect(wallet_1.default.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey,
                })).toEqual(utils_1.STARTING_BALANCE);
            });
        });
        describe("and there are outputs for the wallet", () => {
            let transactionOne, transactionTwo;
            beforeEach(() => {
                transactionOne = new wallet_1.default().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50,
                });
                transactionTwo = new wallet_1.default().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 60,
                });
                blockchain.addBlock([transactionOne, transactionTwo]);
            });
            it("adds the sum of all outputs to the wallet balance", () => {
                expect(wallet_1.default.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey,
                })).toEqual(utils_1.STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionTwo.outputMap[wallet.publicKey]);
            });
            describe("and the wallet has made a transaction", () => {
                let recentTransaction;
                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({
                        recipient: "foo",
                        amount: 30,
                    });
                    blockchain.addBlock([recentTransaction]);
                });
                it("returns the output amount of the recent transaction", () => {
                    expect(wallet_1.default.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey,
                    })).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });
                describe("and there are outputs next to and after the recent transaction", () => {
                    let sameBlockTransaction, nextBlockTransaction;
                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({
                            recipient: "later-foo-address",
                            amount: 60,
                        });
                        sameBlockTransaction = new transaction_1.transaction.BlockRewardTx({
                            minerWallet: wallet,
                        });
                        blockchain.addBlock([
                            recentTransaction,
                            sameBlockTransaction,
                        ]);
                        nextBlockTransaction = new wallet_1.default().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 75,
                        });
                        blockchain.addBlock([nextBlockTransaction]);
                    });
                    it("includes the output amounts in the returned balance", () => {
                        expect(wallet_1.default.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey,
                        })).toEqual(recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]);
                    });
                });
            });
        });
    });
});

import { ec } from "elliptic";
import { verifySignature } from "../utils";
import Transaction, { validateTransaction } from "./transaction";
import Wallet from "./wallet";

describe("Transaction", () => {
  let transaction: Transaction,
    senderWallet: Wallet,
    recipient: string,
    amount: number;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;

    transaction = new Transaction({
      senderWallet,
      recipient,
      amount,
    });
  });

  it("has an `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("transactionMap", () => {
    it("has `transactionMap`", () => {
      expect(transaction).toHaveProperty("transactionMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.transactionMap[recipient]).toEqual(amount);
    });

    it("outputs the remainging for the `senderWallet`", () => {
      expect(transaction.transactionMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
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
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.transactionMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("validTransaction()", () => {
    let errorMock: jest.Mock<any, any, any>;
    beforeEach(() => {
      errorMock = jest.fn();

      global.console.error = errorMock;
    });

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(validateTransaction(transaction)).toBe(true);
      });
    });

    describe("when the transaction is invalid", () => {
      describe("and a transaction transactionMap value is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.transactionMap[senderWallet.publicKey] = 999999;
          expect(validateTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the transaction input signature is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("data");
          expect(validateTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    let originalSignature: ec.Signature,
      originalSenderOutput: number,
      nextRecipient: string,
      nextAmount: number;

    describe("and the amount is invalid", () => {
      it("throws an error", () => {
        expect(() =>
          transaction.update({
            senderWallet,
            recipient: "foo",
            amount: 999999,
          })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount is valid", () => {
      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderOutput =
          transaction.transactionMap[senderWallet.publicKey];
        nextRecipient = "foo-recipient";
        nextAmount = 50;

        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        });
      });
      it("outputs the amount to the next recipient", () => {
        expect(transaction.transactionMap[nextRecipient]).toEqual(nextAmount);
      });

      it("subtracts the amount from original sender output amount", () => {
        expect(transaction.transactionMap[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        );
      });

      it("maintains a total output that matches that input amount", () => {
        expect(
          Object.values(transaction.transactionMap).reduce(
            (prev, curr) => prev + curr,
            0
          )
        ).toEqual(transaction.input.amount);
      });

      it("re-signs the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe("and another update for the same recipient", () => {
        let addedAmount: number;

        beforeEach(() => {
          addedAmount = 80;
          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          });
        });

        it("adds to the recipient amount", () => {
          expect(transaction.transactionMap[nextRecipient]).toEqual(
            nextAmount + addedAmount
          );
        });

        it("subtracts the amount from original sender output amount", () => {
          expect(transaction.transactionMap[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          );
        });
      });
    });
  });
});

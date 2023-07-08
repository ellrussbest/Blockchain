import TransactionPool from "./transaction-pool";
import { Transaction } from ".";
import { Wallet } from ".";

describe("TransactionPool", () => {
  let transactionPool: TransactionPool,
    transaction: Transaction,
    senderWallet: Wallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
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

      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey,
        })
      ).toBe(transaction);
    });
  });
});

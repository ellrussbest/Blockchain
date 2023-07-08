import { Transaction } from ".";

export default class TransctionPool {
  public transactionMap: {
    [x: string]: Transaction;
  };

  constructor() {
    this.transactionMap = {};
  }

  setTransaction(transaction: Transaction) {
    this.transactionMap[transaction.id] = transaction;
  }
}

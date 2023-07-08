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

  setTransactionMap(transactionMap: { [x: string]: Transaction }) {
    this.transactionMap = transactionMap;
  }

  existingTransaction(params: { inputAddress: string }) {
    const transactions = Object.values(this.transactionMap);

    const transaction = transactions.find(
      (transaction) => transaction.input.address === params.inputAddress
    );

    return transaction;
  }
}

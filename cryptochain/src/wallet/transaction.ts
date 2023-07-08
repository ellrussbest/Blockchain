import { v1 as uuid } from "uuid";
import Wallet from "./wallet";
import { ec } from "elliptic";
import { verifySignature } from "../utils";

export namespace transaction {
  export const validateTransaction = (transaction: Transaction) => {
    const {
      input: { address, amount, signature },
      transactionMap,
    } = transaction;

    const outputTotal = Object.values(transactionMap).reduce(
      (prev, curr) => prev + curr,
      0
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction ${address}`);
      return false;
    }

    if (
      !verifySignature({
        publicKey: address,
        data: transactionMap,
        signature,
      })
    ) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }
    return true;
  };

  export class Transaction {
    public id: string;
    public transactionMap;
    public input: {
      timestamp: number;
      amount: number;
      address: string;
      signature: ec.Signature;
    };

    constructor(params: {
      senderWallet: Wallet;
      recipient: string;
      amount: number;
    }) {
      const { senderWallet, recipient, amount } = params;
      this.id = uuid();

      // this should map the recipients amount and reciever's updated balance
      this.transactionMap = {
        [recipient]: amount,
        [senderWallet.publicKey]: senderWallet.balance - amount,
      };

      this.input = {
        timestamp: Date.now(),
        amount: senderWallet.balance,
        address: senderWallet.publicKey,
        signature: senderWallet.sign(this.transactionMap),
      };
    }

    update(params: {
      senderWallet: Wallet;
      recipient: string;
      amount: number;
    }) {
      const { senderWallet, recipient, amount } = params;

      if (amount > this.transactionMap[senderWallet.publicKey])
        throw new Error("Amount exceeds balance");

      // if recipient has ever received any transaction, then we should just update it
      // else we should create a new transaction
      if (this.transactionMap[recipient]) {
        this.transactionMap[recipient] =
          this.transactionMap[recipient] + amount;
      } else this.transactionMap[recipient] = amount;

      this.transactionMap[senderWallet.publicKey] =
        this.transactionMap[senderWallet.publicKey] - amount;

      this.input = {
        timestamp: Date.now(),
        amount: params.senderWallet.balance,
        address: params.senderWallet.publicKey,
        signature: params.senderWallet.sign(this.transactionMap),
      };
    }
  }
}

export default transaction.Transaction;
export const { validateTransaction } = transaction;

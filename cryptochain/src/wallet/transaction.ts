import { v1 as uuid } from "uuid";
import Wallet from "./wallet";
import { ec } from "elliptic";
import { verifySignature } from "../utils";

export namespace transaction {
  export const validateTransaction = (transaction: Transaction) => {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
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
        data: outputMap,
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
    public outputMap;
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

    update(params: {
      senderWallet: Wallet;
      recipient: string;
      amount: number;
    }) {
      const { senderWallet, recipient, amount } = params;

      if (amount > this.outputMap[senderWallet.publicKey])
        throw new Error("Amount exceeds balance");

      // if recipient has ever received any transaction, then we should just update it
      // else we should create a new transaction
      if (this.outputMap[recipient]) {
        this.outputMap[recipient] = this.outputMap[recipient] + amount;
      } else this.outputMap[recipient] = amount;

      this.outputMap[senderWallet.publicKey] =
        this.outputMap[senderWallet.publicKey] - amount;

      this.input = {
        timestamp: Date.now(),
        amount: params.senderWallet.balance,
        address: params.senderWallet.publicKey,
        signature: params.senderWallet.sign(this.outputMap),
      };
    }
  }
}

export default transaction.Transaction;
export const { validateTransaction } = transaction;

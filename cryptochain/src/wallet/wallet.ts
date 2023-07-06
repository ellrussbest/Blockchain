import { STARTING_BALANCE, ec, cryptoHash } from "../utils";
import Transaction from "./transaction";

export default class Wallet {
	public balance: number;
	public publicKey;
	public keyPair;

	constructor() {
		this.balance = STARTING_BALANCE;

		this.keyPair = ec.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode("hex", false);
	}

	sign(data: any) {
		return this.keyPair.sign(cryptoHash(JSON.stringify(data)));
	}

	createTransaction(params: { recipient: string; amount: number }) {
		if (params.amount > this.balance) {
			throw new Error("Amount exceeds balance");
		}

		return new Transaction({
			senderWallet: this,
			recipient: params.recipient,
			amount: params.amount,
		});
	}
}

import { v1 as uuid } from "uuid";
import Wallet from "./wallet";
import { ec } from "elliptic";

export default class Transaction {
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
		this.id = uuid();

		this.outputMap = {
			[params.recipient]: params.amount,
			[params.senderWallet.publicKey]:
				params.senderWallet.balance - params.amount,
		};

		this.input = {
			timestamp: Date.now(),
			amount: params.senderWallet.balance,
			address: params.senderWallet.publicKey,
			signature: params.senderWallet.sign(this.outputMap),
		};
	}
}

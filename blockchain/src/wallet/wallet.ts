import { Block } from "../blockchain";
import { STARTING_BALANCE, ec, cryptoHash } from "../utils";
import Transaction from "./transaction";

export default class Wallet {
	public balance: number;
	public publicKey;
	public keyPair;

	constructor() {
		this.balance = STARTING_BALANCE;

		this.keyPair = ec.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode("hex", true);
	}

	sign(data: any) {
		return this.keyPair.sign(cryptoHash(JSON.stringify(data)));
	}

	createTransaction(params: {
		recipient: string;
		amount: number;
		chain?: Block[];
	}) {
		if (!!params.chain) {
			this.balance = Wallet.calculateBalance({
				chain: params.chain,
				address: this.publicKey,
			});
		}

		if (params.amount > this.balance) {
			throw new Error("Amount exceeds balance");
		}

		return new Transaction({
			senderWallet: this,
			recipient: params.recipient,
			amount: params.amount,
		});
	}

	static calculateBalance(params: { chain: Block[]; address: string }) {
		let hasConductedTransaction = false;

		const { chain, address } = params;
		let outputsTotal = 0;

		for (let i = chain.length - 1; i > 0; i--) {
			const block = chain[i];

			for (let transaction of block.data) {
				if (transaction.input.address === address) {
					hasConductedTransaction = true;
				}

				const addressOutput = transaction.outputMap[address];
				if (addressOutput)
					outputsTotal += transaction.outputMap[address];
			}

			if (hasConductedTransaction) break;
		}

		return hasConductedTransaction
			? outputsTotal
			: STARTING_BALANCE + outputsTotal;
	}
}

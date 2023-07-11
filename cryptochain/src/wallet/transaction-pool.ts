import { Transaction, validateTransaction, transaction } from ".";
import { Block } from "../blockchain";

export default class TransctionPool {
	public transactionMap: {
		[x: string]: Transaction | transaction.BlockRewardTx;
	};

	constructor() {
		this.transactionMap = {};
	}

	clear() {
		this.transactionMap = {};
	}

	setTransaction(transaction: Transaction | transaction.BlockRewardTx) {
		this.transactionMap[transaction.id] = transaction;
	}

	setTransactionMap(transactionMap: {
		[x: string]: Transaction | transaction.BlockRewardTx;
	}) {
		this.transactionMap = transactionMap;
	}

	existingTransaction(params: { inputAddress: string }) {
		const transactions = Object.values(this.transactionMap);

		const transaction = transactions.find(
			(transaction) => transaction.input.address === params.inputAddress,
		);

		return transaction;
	}

	validTransactions() {
		let transactions = Object.values(this.transactionMap);

		return transactions.filter(
			(transaction) =>
				transaction instanceof Transaction &&
				validateTransaction(transaction),
		);
	}

	clearBlockchainTransactions(params: { chain: Block[] }) {
		for (let i = 1; i < params.chain.length; i++) {
			const block = params.chain[i];

			for (let transaction of block.data) {
				if (this.transactionMap[transaction.id]) {
					delete this.transactionMap[transaction.id];
				}
			}
		}
	}
}


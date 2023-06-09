import Block, { genesis, mineBlock } from "./block";
import { MINING_REWARD, REWARD_INPUT, cryptoHash } from "../utils";
import { validateTransaction, Wallet } from "../wallet";

namespace blockchain {
	/** Functions */
	export const isValidChain = (chain: Block[]): boolean => {
		// when the chain does not start with the genesis block return false
		if (JSON.stringify(chain[0]) !== JSON.stringify(genesis()))
			return false;

		for (let i = 1; i < chain.length; i++) {
			const {
				timestamp,
				previousBlockHash,
				hash,
				data,
				nonce,
				difficulty: currentBlockDifficulty,
			} = chain[i];
			const actualpreviousBlockHash = chain[i - 1].hash;
			const previousBlockDifficulty = chain[i - 1].difficulty;

			if (previousBlockHash !== actualpreviousBlockHash) return false;

			const dataToBeHashed = data.map((val) => JSON.stringify(val));

			const validatedHash = cryptoHash(
				timestamp,
				previousBlockHash,
				nonce.toString(),
				currentBlockDifficulty.toString(),
				...dataToBeHashed,
			);

			if (hash !== validatedHash) return false;
			if (Math.abs(previousBlockDifficulty - currentBlockDifficulty) > 1)
				return false;
		}

		return true;
	};

	/** The blockchain class */
	export class Blockchain {
		public chain: Block[] = [];

		constructor() {
			this.chain = [...this.chain, genesis()];
		}

		addBlock(data: any[]): this {
			const lastBlock = this.chain[this.chain.length - 1];
			this.chain.push(
				mineBlock({
					lastBlock,
					data,
				}),
			);

			return this;
		}

		replaceChain(chain: Block[], validateTransactions?:boolean ,onSuccess?: () => void): this {
			// if the new chain's length is less or equal to the length of the existing blockchain
			// the incoming chain must be longer than the present chain
			if (chain.length <= this.chain.length) {
				console.error("The incoming chain must be longer");
				return this;
			}

			// verify if any of the chains is invalid, if invalid, don't replace
			if (!isValidChain(chain)) {
				console.error("The incoming chain must be valid");
				return this;
			}

			if (
				validateTransactions && this.validTransactionData({
					chain,
				})
			) {
				console.error(
					"The incoming chain has invalid transaction error",
				);
				return this;
			}

			if (!!onSuccess) onSuccess();

			console.log("Replacing chain with", chain);
			this.chain = chain;
			return this;
		}

		validTransactionData(params: { chain: Block[] }) {
			const { chain } = params;

			let transactionSet = new Set();
			for (let i = 1; i < chain.length; i++) {
				const block = chain[i];
				let rewardTransactionCount = 0;

				for (let transaction of block.data) {
					transactionSet.add(transaction.id);
					// check if we have more than one Reward in a block
					if (transaction.input.address === REWARD_INPUT.address) {
						rewardTransactionCount += 1;

						if (rewardTransactionCount > 1) {
							console.error("Miner rewards exceed limit");
							return false;
						}

						if (
							Object.values(transaction.outputMap)[0] !==
							MINING_REWARD
						) {
							console.error("Miner reward amount is invalid");
							return false;
						}
					} else {
						if (!validateTransaction(transaction)) {
							console.error("Invalid transaction");
							return false;
						}

						const trueBalance = Wallet.calculateBalance({
							chain: this.chain,
							address: transaction.input.address,
						});

						if (transaction.input.amount !== trueBalance) {
							console.error("Invalid input amount");
							return false;
						}

						if (transactionSet.has(transaction)) {
							console.error(
								"An identical transaction appears more than once in the block",
							);
							return false;
						} else {
							transactionSet.add(transaction);
						}
					}
				}
			}

			return true;
		}
	}
}

export default blockchain.Blockchain;
export const { isValidChain } = blockchain;

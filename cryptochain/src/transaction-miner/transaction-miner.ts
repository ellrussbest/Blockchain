import { Blockchain } from "../blockchain";
import { RedisPubSub as PubSub, PubNubPubSub as PubNub } from "../pubsub";
import { TransactionPool, Wallet, transaction } from "../wallet";

export default class TransactionMiner {
	public blockchain: Blockchain;
	public transactionPool: TransactionPool;
	public wallet: Wallet;
	public pubSub: PubSub | PubNub;

	constructor(params: {
		blockchain: Blockchain;
		transactionPool: TransactionPool;
		wallet: Wallet;
		pubSub: PubSub | PubNub;
	}) {
		const { blockchain, transactionPool, wallet, pubSub } = params;

		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.pubSub = pubSub;
	}
	mineTransaction() {
		// get the transaction pool's valid transactions
		const validTransactions = this.transactionPool.validTransactions();

		if (validTransactions.length > 0) {
			// generate the miner's reward
			validTransactions.push(
				new transaction.BlockRewardTx({
					minerWallet: this.wallet,
				}),
			);

			// add a block consisting of these transactions to the blockchain
			this.blockchain.addBlock(validTransactions);

			// broadcast the updated blockchain
			this.pubSub.broadcastChain();

			// clear the pool
			this.transactionPool.clear();
		}
	}
}

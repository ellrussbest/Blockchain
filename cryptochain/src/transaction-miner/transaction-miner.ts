import { Blockchain } from "../blockchain";
import { RedisPubSub as PubSub } from "../pubsub";
import { TransactionPool, Wallet } from "../wallet";

export default class TransactionMiner {
	public blockchain: Blockchain;
	public transactionPool: TransactionPool;
	public wallet: Wallet;
	public pubSub: PubSub;

	constructor(params: {
		blockchain: Blockchain;
		transactionPool: TransactionPool;
		wallet: Wallet;
		pubSub: PubSub;
	}) {
		const { blockchain, transactionPool, wallet, pubSub } = params;

		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.pubSub = pubSub;
	}
	mineTransaction() {
		// get the transaction pool's valid transactions
		// generate the miner's reward
		// add a block consisting of these transactions to the blockchain
		// broadcast the updated blockchain
		// clear the pool
	}
}

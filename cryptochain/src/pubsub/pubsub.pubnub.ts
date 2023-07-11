import PubNub from "pubnub";
import { Blockchain } from "../blockchain";
import { TransactionPool, Transaction, Wallet, transaction } from "../wallet";

enum CHANNELS {
	TEST = "TEST",
	BLOCKCHAIN = "BLOCKCHAIN",
	TRANSACTION = "TRANSACTION",
}

export default class PubSub {
	public pubnub: PubNub;
	public blockchain: Blockchain;
	public transactionPool: TransactionPool;
	public wallet: Wallet;

	constructor(params: {
		blockchain: Blockchain;
		transactionPool: TransactionPool;
		wallet: Wallet;
	}) {
		this.blockchain = params.blockchain;
		this.transactionPool = params.transactionPool;
		this.wallet = params.wallet;
		this.pubnub = new PubNub({
			publishKey: process.env.PUBLISHKEY,
			subscribeKey: process.env.SUBSCRIBEKEY,
			uuid: process.env.SECRETKEY,
		});

		this.pubnub.addListener(this.listener());

		this.subscribeToChannels();
	}

	// Listener arguments
	listener() {
		return {
			message: (messageObject: PubNub.MessageEvent) => {
				switch (messageObject.channel) {
					case CHANNELS.BLOCKCHAIN:
						const parsedMessage = JSON.parse(messageObject.message);
						this.blockchain.replaceChain(parsedMessage, () => {
							this.transactionPool.clearBlockchainTransactions({
								chain: parsedMessage,
							});
						});
						break;
					case CHANNELS.TRANSACTION:
						if (
							!this.transactionPool.existingTransaction({
								inputAddress: this.wallet.publicKey,
							})
						) {
							this.transactionPool.setTransaction(
								JSON.parse(messageObject.message),
							);
						}
						break;
					default:
						return;
				}
			},
		};
	}

	// We subscribe to channels that the listener will going to capture
	subscribeToChannels() {
		this.pubnub.subscribe({
			channels: Object.values(CHANNELS),
		});
	}

	// Publisher
	publish(params: PubNub.PublishParameters) {
		const { channel, message } = params;
		this.pubnub.unsubscribe({ channels: [channel] });
		this.pubnub.publish({ channel, message }).finally(() => {
			this.subscribeToChannels();
		});
	}

	// Broadcasts publishers
	broadcastChain() {
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain),
		});
	}

	// broadcasts transactions
	broadcastTransaction(transaction: Transaction | transaction.BlockRewardTx) {
		this.publish({
			channel: CHANNELS.TRANSACTION,
			message: JSON.stringify(transaction),
		});
	}
}

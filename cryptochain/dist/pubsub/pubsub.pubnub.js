"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubnub_1 = __importDefault(require("pubnub"));
var CHANNELS;
(function (CHANNELS) {
    CHANNELS["TEST"] = "TEST";
    CHANNELS["BLOCKCHAIN"] = "BLOCKCHAIN";
    CHANNELS["TRANSACTION"] = "TRANSACTION";
})(CHANNELS || (CHANNELS = {}));
class PubSub {
    pubnub;
    blockchain;
    transactionPool;
    wallet;
    constructor(params) {
        this.blockchain = params.blockchain;
        this.transactionPool = params.transactionPool;
        this.wallet = params.wallet;
        this.pubnub = new pubnub_1.default({
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
            message: (messageObject) => {
                switch (messageObject.channel) {
                    case CHANNELS.BLOCKCHAIN:
                        const parsedMessage = JSON.parse(messageObject.message);
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage,
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                            inputAddress: this.wallet.publicKey,
                        })) {
                            this.transactionPool.setTransaction(JSON.parse(messageObject.message));
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
    publish(params) {
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
    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction),
        });
    }
}
exports.default = PubSub;

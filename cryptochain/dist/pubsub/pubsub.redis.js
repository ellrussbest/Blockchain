"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHANNELS = exports.connect = void 0;
const redis_1 = require("redis");
var pubsub;
(function (pubsub_1) {
    let CHANNELS;
    (function (CHANNELS) {
        CHANNELS["TEST"] = "TEST";
        CHANNELS["BLOCKCHAIN"] = "BLOCKCHAIN";
        CHANNELS["TRANSACTION"] = "TRANSACTION";
    })(CHANNELS = pubsub_1.CHANNELS || (pubsub_1.CHANNELS = {}));
    /** Functions to Connect the clients */
    pubsub_1.connect = async (pubsub) => {
        try {
            await pubsub.publisher.connect();
        }
        catch (error) {
            return false;
        }
        try {
            await pubsub.subscriber.connect();
            return true;
        }
        catch (error) {
            console.log("Connection unsuccessful");
            return false;
        }
    };
    class PubSub {
        publisher;
        subscriber;
        blockchain;
        transactionPool;
        constructor(params) {
            this.blockchain = params.blockchain;
            this.transactionPool = params.transactionPool;
            this.publisher = (0, redis_1.createClient)();
            this.subscriber = (0, redis_1.createClient)();
            this.subscribeToChannels();
        }
        subscribeToChannels() {
            Object.values(CHANNELS).forEach(async (channel) => {
                switch (channel) {
                    case CHANNELS.TEST:
                        try {
                            await this.subscriber.subscribe(channel, (message) => {
                                console.log(message);
                            });
                        }
                        catch (error) { }
                        break;
                    case CHANNELS.BLOCKCHAIN:
                        try {
                            await this.subscriber.subscribe(channel, (message) => {
                                const parsedMessage = JSON.parse(message);
                                this.blockchain.replaceChain(parsedMessage, true, () => {
                                    this.transactionPool.clearBlockchainTransactions({
                                        chain: parsedMessage,
                                    });
                                });
                            });
                        }
                        catch (error) { }
                        break;
                    case CHANNELS.TRANSACTION:
                        try {
                            await this.subscriber.subscribe(channel, (message) => {
                                this.transactionPool.setTransaction(JSON.parse(message));
                            });
                        }
                        catch (error) { }
                        break;
                    default:
                        return;
                }
            });
        }
        async publish(params) {
            await this.subscriber.unsubscribe(params.channel);
            await this.publisher.publish(params.channel, params.message);
            this.subscribeToChannels();
        }
        async broadcastChain() {
            await this.publish({
                channel: CHANNELS.BLOCKCHAIN,
                message: JSON.stringify(this.blockchain.chain),
            });
        }
        async broadcastTransaction(transaction) {
            await this.publish({
                channel: CHANNELS.TRANSACTION,
                message: JSON.stringify(transaction),
            });
        }
    }
    pubsub_1.PubSub = PubSub;
})(pubsub || (pubsub = {}));
exports.default = pubsub.PubSub;
exports.connect = pubsub.connect, exports.CHANNELS = pubsub.CHANNELS;

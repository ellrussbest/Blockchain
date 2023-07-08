import { createClient, RedisClientType } from "redis";
import { Blockchain } from "../blockchain";
import { TransactionPool, Transaction } from "../wallet";

export namespace pubsub {
  export enum CHANNELS {
    TEST = "TEST",
    BLOCKCHAIN = "BLOCKCHAIN",
    TRANSACTION = "TRANSACTION",
  }

  /** Functions to Connect the clients */
  export const connect = async (pubsub: PubSub): Promise<boolean> => {
    try {
      await pubsub.publisher.connect();
    } catch (error) {
      return false;
    }

    try {
      await pubsub.subscriber.connect();
      return true;
    } catch (error) {
      console.log("Connection unsuccessful");
      return false;
    }
  };

  export class PubSub {
    public publisher: RedisClientType;
    public subscriber: RedisClientType;
    public blockchain: Blockchain;
    public transactionPool: TransactionPool;

    constructor(params: {
      blockchain: Blockchain;
      transactionPool: TransactionPool;
    }) {
      this.blockchain = params.blockchain;
      this.transactionPool = params.transactionPool;
      this.publisher = createClient();
      this.subscriber = createClient();

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
            } catch (error) {}

            break;
          case CHANNELS.BLOCKCHAIN:
            try {
              await this.subscriber.subscribe(channel, (message) => {
                const parsedMessage = JSON.parse(message);
                this.blockchain.replaceChain(parsedMessage);
              });
            } catch (error) {}
            break;
          case CHANNELS.TRANSACTION:
            try {
              await this.subscriber.subscribe(channel, (message) => {
                this.transactionPool.setTransaction(JSON.parse(message));
              });
            } catch (error) {}
            break;
          default:
            return;
        }
      });
    }

    async publish(params: { channel: string; message: string }) {
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

    async broadcastTransaction(transaction: Transaction) {
      await this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction),
      });
    }
  }
}

export default pubsub.PubSub;
export const { connect, CHANNELS } = pubsub;

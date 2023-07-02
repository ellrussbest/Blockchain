import { createClient, RedisClientType } from "redis";
import Blockchain from "./blockchain";

export namespace pubsub {
  export enum CHANNELS {
    TEST = "TEST",
    BLOCKCHAIN = "BLOCKCHAIN",
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
    constructor(params: { blockchain: Blockchain }) {
      this.blockchain = params.blockchain;
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
        }
      });
    }

    async publish(params: { channel: string; message: string }) {
      await this.publisher.publish(params.channel, params.message);
    }

    async broadcastChain() {
      await this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain),
      });
    }
  }
}

export default pubsub.PubSub;
export const { connect, CHANNELS } = pubsub;

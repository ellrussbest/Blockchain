import { createClient, RedisClientType } from "redis";

export namespace pubsub {
  export enum TOPICS {
    TEST = "TEST",
  }

  /** Connect the clients */
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
    constructor() {
      this.publisher = createClient();
      this.subscriber = createClient();

      this.subscriber.subscribe(TOPICS.TEST, (message) => {
        console.log(message);
      });
    }
  }
}

const { connect, PubSub, TOPICS } = pubsub;
const testPubSub = new PubSub();

(async () => {
  if (await connect(testPubSub)) {
    try {
      await testPubSub.publisher.publish(TOPICS.TEST, "foo");
    } catch (error) {}
  }
})();

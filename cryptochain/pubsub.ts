import redis, { RedisClientType } from "redis";

enum TOPICS {
  TEST = "TEST",
}

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  public publisher: RedisClientType;
  public subscriber: RedisClientType;
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(TOPICS.TEST, (message) => {
      console.log(message);
    });

    this.subscriber.on("message", (topic, message) =>
      this.handleMessage(topic, message)
    );
  }

  handleMessage(topic: any, message: any) {
    console.log(`Message received. Topic ${topic}. Message: ${message}`);
  }
}

const testPubSub = new PubSub();

setTimeout(() => testPubSub.publisher.publish(TOPICS.TEST, "foo"), 1000);

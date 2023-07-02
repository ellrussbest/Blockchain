import redis from "redis";
var TOPICS;
(function (TOPICS) {
    TOPICS["TEST"] = "TEST";
})(TOPICS || (TOPICS = {}));
class PubSub {
    publisher;
    subscriber;
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.subscriber.subscribe(TOPICS.TEST, (message) => {
            console.log(message);
        });
        // this.subscriber.on("message", (topic, message) =>
        //   this.handleMessage(topic, message)
        // );
    }
}
const testPubSub = new PubSub();
setTimeout(() => testPubSub.publisher.publish(TOPICS.TEST, "foo"), 1000);

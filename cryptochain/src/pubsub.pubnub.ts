import PubNub from "pubnub";
import Blockchain from "./blockchain";

enum CHANNELS {
  TEST = "TEST",
  BLOCKCHAIN = "BLOCKCHAIN",
}

export default class PubSub {
  public pubnub: PubNub;
  public blockchain: Blockchain;

  constructor(params: { blockchain: Blockchain }) {
    this.blockchain = params.blockchain;
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
            this.blockchain.replaceChain(parsedMessage);
            break;
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
}

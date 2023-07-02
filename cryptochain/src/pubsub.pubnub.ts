import PubNub from "pubnub";
import { config } from "dotenv";

config();

const CHANNELS = {
  TEST: "TEST",
};

export class PubSub {
  public pubnub: PubNub;
  constructor() {
    this.pubnub = new PubNub({
      publishKey: process.env.PUBLISHKEY,
      subscribeKey: process.env.SUBSCRIBEKEY,
      uuid: process.env.SECRETKEY,
    });

    this.pubnub.subscribe({
      channels: Object.values(CHANNELS),
    });

    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: (messageObject: PubNub.MessageEvent) => {
        console.log(
          `Message received. Channel: ${messageObject.channel}. Message: ${messageObject.message}`
        );
      },
    };
  }

  publish(params: PubNub.PublishParameters) {
    const { channel, message } = params;
    this.pubnub.publish({ channel, message }, (status, response) => {
      console.log(status, response);
    });
  }
}


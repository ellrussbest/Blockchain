import express from "express";
import Blockchain from "./blockchain";
import bodyParser from "body-parser";
import { config } from "dotenv";
import PubSub, { connect } from "./pubsub.redis";
import axios from "axios";

config();
const ROOT_NODE_ADDRESS = `http://localhost:${process.env.DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

const pubSub = new PubSub({ blockchain });

(async () => {
  // we first want to connect to our redis api
  if (await connect(pubSub)) {
    app.get("/api/blocks", (req, res, next) => {
      res.json({
        chain: blockchain.chain,
      });
    });

    app.post("/api/mine", async (req, res, next) => {
      const { data } = req.body;
      blockchain.addBlock(data);

      await pubSub.broadcastChain();

      res.redirect("/api/blocks");
    });

    const syncChains = async () => {
      try {
        const chainRequest = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);

        if (chainRequest.status === 200) {
          const chain = await chainRequest.data;

          console.log("replace chain on a sync with", chain);
          blockchain.replaceChain(chain);
        } else {
          throw new Error("Error while fetching the Blockchain");
        }
      } catch (error) {
        console.log(error);
      }
    };

    let PEER_PORT: undefined | number;

    if (process.env.GENERATE_PEER_PORT === "true") {
      PEER_PORT =
        parseInt(process.env.DEFAULT_PORT) + Math.ceil(Math.random() * 1000);
    }

    app.listen(PEER_PORT ?? process.env.DEFAULT_PORT, async () => {
      console.log(
        `Listening at localhost:${PEER_PORT ?? process.env.DEFAULT_PORT}`
      );

      if (!!PEER_PORT) await syncChains();
    });
  }
})();

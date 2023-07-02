import express from "express";
import Blockchain from "./blockchain";
import bodyParser from "body-parser";
import { config } from "dotenv";
import PubSub, { connect, CHANNELS } from "./pubsub.redis";

config();
const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

const pubSub = new PubSub({ blockchain });

(async () => {
  if (await connect(pubSub)) {
    try {
      await pubSub.broadcastChain();
    } catch (error) {}
  }
})();

app.get("/api/blocks", (req, res, next) => {
  res.json({
    chain: blockchain.chain,
  });
});

app.post("/api/mine", (req, res, next) => {
  const { data } = req.body;
  blockchain.addBlock(data);

  res.redirect("/api/blocks");
});

app.listen(5000, () => {
  console.log("Listening at localhost:5000");
});

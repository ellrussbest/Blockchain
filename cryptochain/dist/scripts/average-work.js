"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../blockchain");
const blockchain = new blockchain_1.Blockchain();
blockchain.addBlock(["initial"]);
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;
const times = [];
for (let i = 0; i < 10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock([`block ${i}`]);
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    timeDiff = parseInt(nextTimestamp) - parseInt(prevTimestamp);
    times.push(timeDiff);
    average =
        times.reduce((prev, curr) => {
            return prev + curr;
        }, 0) / times.length;
    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}`);
}

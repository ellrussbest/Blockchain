import Block from "./block.js";
import Blockchain from "./blockchain.js";

const blockchain = new Blockchain();

blockchain.addBlock(["initial"]);

let prevTimestamp: string,
  nextTimestamp: string,
  nextBlock: Block,
  timeDiff: number,
  average: number;

const times: number[] = [];

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

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}`
  );
}

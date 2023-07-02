import { GENESIS_DATA, MINE_RATE, hexToBinary } from "./utils";
import {
  BlockToBeMinedParameters,
  AdjustDifficultyParams,
  BlockContent,
} from "./types";
import cryptoHash from "./crypto-hash";

namespace block {
  /** Functions */
  export const genesis = (): Block => {
    return new Block(GENESIS_DATA);
  };

  export const mineBlock = (
    blockToBeMinedParameters: BlockToBeMinedParameters
  ) => {
    const {
      lastBlock: { hash: previousBlockHash },
      data,
    } = blockToBeMinedParameters;
    let timestamp: string;
    let difficulty: number;
    let hash: string;
    let nonce = 0;

    const dataToBeHashed = data.map((val) => JSON.stringify(val));

    do {
      nonce++;
      timestamp = Date.now().toString();
      difficulty = adjustDifficulty({
        lastBlock: blockToBeMinedParameters.lastBlock,
        timestamp: parseInt(timestamp),
      });
      hash = cryptoHash(
        timestamp,
        previousBlockHash,
        nonce.toString(),
        difficulty.toString(),
        ...dataToBeHashed
      );
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({
      timestamp,
      previousBlockHash,
      hash,
      data,
      difficulty,
      nonce,
    });
  };

  export const adjustDifficulty = (params: AdjustDifficultyParams): number => {
    const {
      difficulty: previousBlockDifficulty,
      timestamp: previousBlockTimestamp,
    } = params.lastBlock;
    const { timestamp: currentTimestamp } = params;

    if (previousBlockDifficulty < 1) return 1;

    const difference = currentTimestamp - parseInt(previousBlockTimestamp);

    if (difference > MINE_RATE) return previousBlockDifficulty - 1;

    return previousBlockDifficulty + 1;
  };

  /** The block class */
  export class Block {
    public timestamp: string;
    public previousBlockHash: string;
    public hash: string;
    public data: string[];
    public nonce: number;
    public difficulty: number;

    constructor(blockContent: BlockContent) {
      this.timestamp = blockContent.timestamp;
      this.previousBlockHash = blockContent.previousBlockHash;
      this.data = blockContent.data;
      this.hash = blockContent.hash;
      this.nonce = blockContent.nonce;
      this.difficulty = blockContent.difficulty;
    }
  }
}

export default block.Block;
export const { genesis, adjustDifficulty, mineBlock } = block;

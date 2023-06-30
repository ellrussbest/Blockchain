import { GENESIS_DATA, MINE_RATE } from "./config";
import cryptoHash from "./crypto-hash";
import { hexToBinary } from "./config";

namespace block {
  /** Functions */
  export const genesis = (): Block => {
    return new Block(GENESIS_DATA);
  };

  export const mineBlock = (minedBlockParams: MinedBlockParams) => {
    let {
      lastBlock: { hash: previousBlockHash, difficulty },
      data,
    } = minedBlockParams;
    let timestamp: string;
    let hash: string;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now().toString();
      difficulty = adjustDifficulty({
        originalBlock: minedBlockParams.lastBlock,
        timestamp: parseInt(timestamp),
      });
      hash = cryptoHash(
        timestamp,
        previousBlockHash,
        nonce.toString(),
        difficulty.toString(),
        ...data
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
    const { difficulty, timestamp } = params.originalBlock;

    if (difficulty < 1) return 1;

    const difference = params.timestamp - parseInt(timestamp);

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
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

import { GENESIS_DATA, MINE_RATE } from "./config";
import cryptoHash from "./crypto-hash";
import { hexToBinary } from "./config";

export interface BlockContent {
  timestamp: string;
  lastHash: string;
  hash: string;
  data: string[];
  nonce: number;
  difficulty: number;
}

interface MinedBlockParams {
  lastBlock: Block;
  data: string[];
}

interface AdjustDifficultyParams {
  originalBlock: Block;
  timestamp: number;
}

class Block {
  public timestamp: string;
  public lastHash: string;
  public hash: string;
  public data: string[];
  public nonce: number;
  public difficulty: number;

  constructor(blockContent: BlockContent) {
    this.timestamp = blockContent.timestamp;
    this.lastHash = blockContent.lastHash;
    this.data = blockContent.data;
    this.hash = blockContent.hash;
    this.nonce = blockContent.nonce;
    this.difficulty = blockContent.difficulty;
  }

  static genesis(): Block {
    return new Block(GENESIS_DATA);
  }

  static mineBlock(minedBlockParams: MinedBlockParams) {
    let {
      lastBlock: { hash: lastHash, difficulty },
      data,
    } = minedBlockParams;
    let timestamp: string;
    let hash: string;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now().toString();
      difficulty = Block.adjustDifficulty({
        originalBlock: minedBlockParams.lastBlock,
        timestamp: parseInt(timestamp),
      });
      hash = cryptoHash(
        timestamp,
        lastHash,
        nonce.toString(),
        difficulty.toString(),
        ...data
      );
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({
      timestamp,
      lastHash,
      hash,
      data,
      difficulty,
      nonce,
    });
  }

  static adjustDifficulty(params: AdjustDifficultyParams): number {
    const { difficulty, timestamp } = params.originalBlock;

    if (difficulty < 1) return 1;

    const difference = params.timestamp - parseInt(timestamp);

    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

export default Block;

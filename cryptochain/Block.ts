import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";

export interface BlockContent {
  timestamp: string;
  lastHash: string;
  hash: string;
  data: string[];
}

interface MinedBlockParams {
  lastBlock: Block;
  data: string[];
}

class Block {
  public timestamp: string;
  public lastHash: string;
  public hash: string;
  public data: string[];

  constructor(blockContent: BlockContent) {
    this.timestamp = blockContent.timestamp;
    this.lastHash = blockContent.lastHash;
    this.data = blockContent.data;
    this.hash = blockContent.hash;
  }

  static genesis(): Block {
    return new Block(GENESIS_DATA);
  }

  static mineBlock(minedBlockParams: MinedBlockParams) {
    const lastHash = minedBlockParams.lastBlock.hash;
    const timestamp = Date.now().toString();
    const data = minedBlockParams.data;
    const hash = cryptoHash(lastHash, timestamp, ...minedBlockParams.data);

    return new Block({
      timestamp,
      lastHash,
      hash,
      data,
    });
  }
}

export default Block;

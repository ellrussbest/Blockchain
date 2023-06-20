import Block from "./Block";
import cryptoHash from "./crypto-hash";

class Blockchain {
  public chain: Block[] = [];

  constructor() {
    this.chain = [...this.chain, Block.genesis()];
  }

  addBlock(data: string[]): void {
    const lastBlock = this.chain[this.chain.length - 1];
    this.chain.push(
      Block.mineBlock({
        lastBlock,
        data,
      })
    );
  }

  static isValidChain(chain: Block[]) {
    // when the chain does not start with the genesis block return false
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain[i];
      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, lastHash, ...data);

      if (hash !== validatedHash) return false;
    }

    return true;
  }
}

export default Blockchain;

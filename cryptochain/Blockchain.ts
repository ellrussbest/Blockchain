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

  replaceChain(chain: Block[]): void {
    // if the new chain's length is less or equal to the length of the existing blockchain
    // the incoming chain must be longer than the present chain
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    // verify if any of the chains is invalid, if invalid, don't replace
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }
    console.log("The original chain was", this.chain);
    console.log("Replacing chain with", chain);
    this.chain = chain;
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

import Block, { genesis, mineBlock } from "./block";
import cryptoHash from "./crypto-hash";

export namespace blockchain {
  /** Functions */
  export const isValidChain = (chain: Block[]): boolean => {
    // when the chain does not start with the genesis block return false
    if (JSON.stringify(chain[0]) !== JSON.stringify(genesis())) return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, previousBlockHash, hash, data, nonce, difficulty: currentDifficulty } =
        chain[i];
      const actualpreviousBlockHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (previousBlockHash !== actualpreviousBlockHash) return false;

      const dataToBeHashed = data.map((val) => JSON.stringify(val));

      const validatedHash = cryptoHash(
        timestamp,
        previousBlockHash,
        nonce.toString(),
        currentDifficulty.toString(),
        ...dataToBeHashed
      );

      if (hash !== validatedHash) return false;
      if (Math.abs(lastDifficulty - currentDifficulty) > 1) return false;
    }

    return true;
  };

  /** The blockchain class */
  export class Blockchain {
    public chain: Block[] = [];

    constructor() {
      this.chain = [...this.chain, genesis()];
    }

    addBlock(data: any[]): this {
      const lastBlock = this.chain[this.chain.length - 1];
      this.chain.push(
        mineBlock({
          lastBlock,
          data,
        })
      );

      return this;
    }

    replaceChain(chain: Block[]): this {
      // if the new chain's length is less or equal to the length of the existing blockchain
      // the incoming chain must be longer than the present chain
      if (chain.length <= this.chain.length) {
        console.error("The incoming chain must be longer");
        return this;
      }

      // verify if any of the chains is invalid, if invalid, don't replace
      if (!isValidChain(chain)) {
        console.error("The incoming chain must be valid");
        return this;
      }
      console.log("The original chain was", this.chain);
      console.log("Replacing chain with", chain);
      this.chain = chain;
      return this;
    }
  }
}

export default blockchain.Blockchain;
export const { isValidChain } = blockchain;

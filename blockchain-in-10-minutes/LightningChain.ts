namespace Blockchain {
  const createHash = (data: string, previousBlockHash: string) => {
    return data + previousBlockHash + "*";
  };

  export const verifyBlockchain = (blockchain: Blockchain): boolean => {
    // we want to prove that the blockchain starts with the genesis data
    if (
      blockchain.chain[0].data !== "genesisData" ||
      blockchain.chain[0].hash !== "genesisHash" ||
      blockchain.chain[0].previousBlockHash !== "genesisPreviousBlockHash"
    ) {
      return false;
    }

    for (let i = 1; i < blockchain.chain.length; i++) {
      if (
        blockchain.chain[i - 1].hash !== blockchain.chain[i].previousBlockHash
      )
        return false;
    }
    return true;
  };

  class Block {
    public data: string;
    public hash: string;
    public previousBlockHash: string;

    constructor(data: string, hash: string, previousBlockHash: string) {
      this.data = data;
      this.hash = hash;
      this.previousBlockHash = previousBlockHash;
    }
  }

  export class Blockchain {
    public chain: Block[];

    constructor() {
      this.chain = [];
      const genesisBlock = new Block(
        "genesisData",
        "genesisHash",
        "genesisPreviousBlockHash"
      );
      this.chain.push(genesisBlock);
    }

    addBlock(data: string) {
      const previousBlockHash = this.chain[this.chain.length - 1].hash;
      const hash = createHash(data, previousBlockHash);
      const newBlock = new Block(data, hash, previousBlockHash);
      this.chain.push(newBlock);
      return this;
    }
  }
}

const { Blockchain: blockchain, verifyBlockchain } = Blockchain;

const LightningChain = new blockchain();
LightningChain.addBlock("first").addBlock("second").addBlock("third");

console.log(LightningChain);
console.log(verifyBlockchain(LightningChain));

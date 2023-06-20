/**
 * Fundamentally a blockchain is a list of linked blocks
 * Each new block in the chain contains a link to the last block that came
 * Before it
 */

const lightningHash = (data: string): string => {
  return data + "*";
};

// The block(node) itself
class Block {
  public data: string;
  public hash: string;
  public lastHash: string;
  constructor(data: string, hash: string, lastHash: string) {
    // what the block is storing
    this.data = data;

    // cryptographic transfomation of the data
    this.hash = hash;

    // link between blocks in the blockchain
    this.lastHash = lastHash;
  }
}

// The blockchain itself
class Blockchain {
  public chain: Block[] = [];
  constructor() {
    // genesis block an initial harcoded block
    const genesis = new Block(
      "genesis-data",
      "genesis-hash",
      "genesis-lasthash"
    );

    // for us to have a blockchain we need a chain
    // the first value on the chain will be the genesis block
    this.chain = [...this.chain, genesis];
  }

  addBlock(data: string): void {
    const lastHash = this.chain[this.chain.length - 1].hash;

    const hash = lightningHash(data + lastHash);

    const block = new Block(data, hash, lastHash);

    this.chain.push(block);
  }
}

const fooBlockchain = new Blockchain();
fooBlockchain.addBlock("one");
fooBlockchain.addBlock("two");
fooBlockchain.addBlock("three");

console.log(fooBlockchain);

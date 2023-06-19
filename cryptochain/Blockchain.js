const Block = require("./Block");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({ data }) {
        const lastBlock = this.chain[this.chain.length - 1]
        this.chain.push(Block.mineBlock({lastBlock, data}))
    }
}

module.exports = Blockchain;
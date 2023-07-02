"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidChain = exports.blockchain = void 0;
const block_js_1 = require("./block.js");
const crypto_hash_js_1 = __importDefault(require("./crypto-hash.js"));
var blockchain;
(function (blockchain) {
    /** Functions */
    blockchain.isValidChain = (chain) => {
        // when the chain does not start with the genesis block return false
        if (JSON.stringify(chain[0]) !== JSON.stringify((0, block_js_1.genesis)()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, previousBlockHash, hash, data, nonce, difficulty: currentBlockDifficulty, } = chain[i];
            const actualpreviousBlockHash = chain[i - 1].hash;
            const previousBlockDifficulty = chain[i - 1].difficulty;
            if (previousBlockHash !== actualpreviousBlockHash)
                return false;
            const dataToBeHashed = data.map((val) => JSON.stringify(val));
            const validatedHash = (0, crypto_hash_js_1.default)(timestamp, previousBlockHash, nonce.toString(), currentBlockDifficulty.toString(), ...dataToBeHashed);
            if (hash !== validatedHash)
                return false;
            if (Math.abs(previousBlockDifficulty - currentBlockDifficulty) > 1)
                return false;
        }
        return true;
    };
    /** The blockchain class */
    class Blockchain {
        chain = [];
        constructor() {
            this.chain = [...this.chain, (0, block_js_1.genesis)()];
        }
        addBlock(data) {
            const lastBlock = this.chain[this.chain.length - 1];
            this.chain.push((0, block_js_1.mineBlock)({
                lastBlock,
                data,
            }));
            return this;
        }
        replaceChain(chain) {
            // if the new chain's length is less or equal to the length of the existing blockchain
            // the incoming chain must be longer than the present chain
            if (chain.length <= this.chain.length) {
                console.error("The incoming chain must be longer");
                return this;
            }
            // verify if any of the chains is invalid, if invalid, don't replace
            if (!blockchain.isValidChain(chain)) {
                console.error("The incoming chain must be valid");
                return this;
            }
            console.log("The original chain was", this.chain);
            console.log("Replacing chain with", chain);
            this.chain = chain;
            return this;
        }
    }
    blockchain.Blockchain = Blockchain;
})(blockchain || (exports.blockchain = blockchain = {}));
exports.default = blockchain.Blockchain;
exports.isValidChain = blockchain.isValidChain;

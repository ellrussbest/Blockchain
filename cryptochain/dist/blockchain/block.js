"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mineBlock = exports.adjustDifficulty = exports.genesis = void 0;
const utils_1 = require("../utils");
var block;
(function (block) {
    /** Functions */
    block.genesis = () => {
        return new Block(utils_1.GENESIS_DATA);
    };
    block.mineBlock = (blockToBeMinedParameters) => {
        const { lastBlock: { hash: previousBlockHash }, data, } = blockToBeMinedParameters;
        let timestamp;
        let difficulty;
        let hash;
        let nonce = 0;
        const dataToBeHashed = data.map((val) => JSON.stringify(val));
        do {
            nonce++;
            timestamp = Date.now().toString();
            difficulty = block.adjustDifficulty({
                lastBlock: blockToBeMinedParameters.lastBlock,
                timestamp: parseInt(timestamp),
            });
            hash = (0, utils_1.cryptoHash)(timestamp, previousBlockHash, nonce.toString(), difficulty.toString(), ...dataToBeHashed);
        } while ((0, utils_1.hexToBinary)(hash).substring(0, difficulty) !==
            "0".repeat(difficulty));
        return new Block({
            timestamp,
            previousBlockHash,
            hash,
            data,
            difficulty,
            nonce,
        });
    };
    block.adjustDifficulty = (params) => {
        const { difficulty: previousBlockDifficulty, timestamp: previousBlockTimestamp, } = params.lastBlock;
        const { timestamp: currentTimestamp } = params;
        if (previousBlockDifficulty < 1)
            return 1;
        const difference = currentTimestamp - parseInt(previousBlockTimestamp);
        if (difference > utils_1.MINE_RATE)
            return previousBlockDifficulty - 1;
        return previousBlockDifficulty + 1;
    };
    /** The block class */
    class Block {
        timestamp;
        previousBlockHash;
        hash;
        data;
        nonce;
        difficulty;
        constructor(blockContent) {
            this.timestamp = blockContent.timestamp;
            this.previousBlockHash = blockContent.previousBlockHash;
            this.data = blockContent.data;
            this.hash = blockContent.hash;
            this.nonce = blockContent.nonce;
            this.difficulty = blockContent.difficulty;
        }
    }
    block.Block = Block;
})(block || (block = {}));
exports.default = block.Block;
exports.genesis = block.genesis, exports.adjustDifficulty = block.adjustDifficulty, exports.mineBlock = block.mineBlock;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const block_js_1 = __importStar(require("./block.js"));
const utils_js_1 = require("./utils.js");
const crypto_hash_js_1 = __importDefault(require("./crypto-hash.js"));
(0, globals_1.describe)("Block", () => {
    const timestamp = "2000";
    const previousBlockHash = "foo-hash";
    const hash = "bar-hash";
    const nonce = 1;
    const difficulty = 1;
    const data = ["blockchain", "data"];
    const block = new block_js_1.default({
        timestamp,
        previousBlockHash,
        hash,
        data,
        nonce,
        difficulty,
    });
    (0, globals_1.it)("has a timestamp, previousBlockHash, and data property", () => {
        (0, globals_1.expect)(block.timestamp).toEqual(timestamp);
        (0, globals_1.expect)(block.previousBlockHash).toEqual(previousBlockHash);
        (0, globals_1.expect)(block.hash).toEqual(hash);
        (0, globals_1.expect)(block.data).toEqual(data);
        (0, globals_1.expect)(block.nonce).toEqual(nonce);
        (0, globals_1.expect)(block.difficulty).toEqual(difficulty);
    });
    (0, globals_1.describe)("genesis()", () => {
        const genesisBlock = (0, block_js_1.genesis)();
        (0, globals_1.it)("returns a Block instance", () => {
            (0, globals_1.expect)(genesisBlock instanceof block_js_1.default).toBe(true);
        });
        (0, globals_1.it)("returns the genesis data", () => {
            (0, globals_1.expect)(genesisBlock).toEqual(utils_js_1.GENESIS_DATA);
        });
    });
    (0, globals_1.describe)("mineBlock()", () => {
        const lastBlock = (0, block_js_1.genesis)();
        const data = ["mined data"];
        const minedBlock = (0, block_js_1.mineBlock)({ lastBlock, data });
        const dataToBeHashed = data.map((val) => JSON.stringify(val));
        (0, globals_1.it)("returns the same data", () => {
            (0, globals_1.expect)(minedBlock.data).toEqual(data);
        });
        (0, globals_1.it)("returns a Block instance", () => {
            (0, globals_1.expect)(minedBlock instanceof block_js_1.default).toBe(true);
        });
        (0, globals_1.it)("sets the `previousBlockHash` to be the `hash` of the lastBlock", () => {
            // <info> expect(actualValue).toEqual(expectedValue) </info>
            (0, globals_1.expect)(minedBlock.previousBlockHash).toEqual(lastBlock.hash);
        });
        (0, globals_1.it)("sets the `data`", () => {
            (0, globals_1.expect)(minedBlock.data).toEqual(data);
        });
        (0, globals_1.it)("sets a `timestamp`", () => {
            (0, globals_1.expect)(minedBlock.timestamp).not.toEqual(undefined);
        });
        (0, globals_1.it)("creates a SHA-256 `hash` based on the proper inputs", () => {
            (0, globals_1.expect)(minedBlock.hash).toEqual((0, crypto_hash_js_1.default)(minedBlock.timestamp, minedBlock.nonce.toString(), minedBlock.difficulty.toString(), lastBlock.hash, ...dataToBeHashed));
        });
        (0, globals_1.it)("sets a `hash` that matches the difficulty criteria", () => {
            (0, globals_1.expect)((0, utils_js_1.hexToBinary)(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty));
        });
        (0, globals_1.it)("adjusts the difficulty", () => {
            const possibleResults = [
                lastBlock.difficulty + 1,
                lastBlock.difficulty - 1,
            ];
            (0, globals_1.expect)(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });
    (0, globals_1.describe)("adjustDifficulty()", () => {
        (0, globals_1.it)("raises the difficulty for a quickly mined block", () => {
            (0, globals_1.expect)((0, block_js_1.adjustDifficulty)({
                lastBlock: block,
                timestamp: parseInt(block.timestamp) + utils_js_1.MINE_RATE - 100,
            })).toEqual(block.difficulty + 1);
        });
        (0, globals_1.it)("lowers the difficulty for a slowly mined block", () => {
            (0, globals_1.expect)((0, block_js_1.adjustDifficulty)({
                lastBlock: block,
                timestamp: parseInt(block.timestamp) + utils_js_1.MINE_RATE + 100,
            })).toEqual(block.difficulty - 1);
        });
        (0, globals_1.it)("has a lower limit of 1", () => {
            block.difficulty = -1;
            (0, globals_1.expect)((0, block_js_1.adjustDifficulty)({
                lastBlock: block,
                timestamp: Math.random(),
            })).toEqual(1);
        });
    });
});

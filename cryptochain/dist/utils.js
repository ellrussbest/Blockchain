"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENESIS_DATA = exports.MINE_RATE = exports.hexToBinary = void 0;
exports.hexToBinary = require("hex-to-binary");
const INITIAL_DIFFICULTY = 3;
exports.MINE_RATE = 1000;
exports.GENESIS_DATA = {
    timestamp: "1",
    previousBlockHash: "-----",
    hash: "hash-one",
    data: [],
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
};

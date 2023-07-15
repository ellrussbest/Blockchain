"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINING_REWARD = exports.REWARD_INPUT = exports.STARTING_BALANCE = exports.GENESIS_DATA = exports.MINE_RATE = exports.hexToBinary = void 0;
exports.hexToBinary = require("hex-to-binary");
const INITIAL_DIFFICULTY = 3;
exports.MINE_RATE = 1000;
exports.GENESIS_DATA = {
    timestamp: Date.UTC(2023, 6, 16, 0, 0, 0).toString(),
    previousBlockHash: "-----",
    hash: "hash-one",
    data: [],
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
};
exports.STARTING_BALANCE = 1000;
exports.REWARD_INPUT = {
    address: "*authorized-reward*",
};
exports.MINING_REWARD = 50;

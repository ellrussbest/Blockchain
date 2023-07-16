export const hexToBinary = require("hex-to-binary");

const INITIAL_DIFFICULTY = 3;

export const MINE_RATE = 1000;
export const GENESIS_DATA = {
	timestamp: Date.UTC(2023, 6, 16, 0, 0, 0).toString(),
	previousBlockHash: "-----",
	hash: "hash-one",
	data: [],
	difficulty: INITIAL_DIFFICULTY,
	nonce: 0,
};

export const STARTING_BALANCE = 1000;

export const REWARD_INPUT = {
	address: "*authorized-reward*",
};

export const MINING_REWARD = 50;

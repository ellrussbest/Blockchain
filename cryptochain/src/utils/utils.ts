export const hexToBinary = require("hex-to-binary");

const INITIAL_DIFFICULTY = 3;

export const MINE_RATE = 1000;
export const GENESIS_DATA = {
  timestamp: "1",
  previousBlockHash: "-----",
  hash: "hash-one",
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};

export const STARTING_BALANCE = 1000;
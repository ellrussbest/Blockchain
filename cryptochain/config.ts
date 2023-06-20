import { BlockContent } from "./Block";

const INITIAL_DIFFICULTY = 3;

export const MINE_RATE = 1000;
export const GENESIS_DATA: BlockContent = {
  timestamp: "1",
  lastHash: "-----",
  hash: "hash-one",
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};

import { describe, expect, it } from "@jest/globals";
import Block, { genesis, mineBlock, adjustDifficulty } from "./block";
import { GENESIS_DATA, MINE_RATE, hexToBinary } from "./utils";
import cryptoHash from "./crypto-hash";

describe("Block", () => {
  const timestamp = "2000";
  const previousBlockHash = "foo-hash";
  const hash = "bar-hash";
  const nonce = 1;
  const difficulty = 1;
  const data = ["blockchain", "data"];

  const block = new Block({
    timestamp,
    previousBlockHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  it("has a timestamp, previousBlockHash, and data property", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousBlockHash).toEqual(previousBlockHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = genesis();

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = genesis();
    const data = ["mined data"];
    const minedBlock = mineBlock({ lastBlock, data });

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the `previousBlockHash` to be the `hash` of the lastBlock", () => {
      // <info> expect(actualValue).toEqual(expectedValue) </info>
      expect(minedBlock.previousBlockHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce.toString(),
          minedBlock.difficulty.toString(),
          lastBlock.hash,
          ...data
        )
      );
    });

    it("sets a `hash` that matches the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for a quickly mined block", () => {
      expect(
        adjustDifficulty({
          originalBlock: block,
          timestamp: parseInt(block.timestamp) + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });
    it("lowers the difficulty for a slowly mined block", () => {
      expect(
        adjustDifficulty({
          originalBlock: block,
          timestamp: parseInt(block.timestamp) + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });
    it("has a lower limit of 1", () => {
      block.difficulty = -1;

      expect(
        adjustDifficulty({
          originalBlock: block,
          timestamp: Math.random(),
        })
      ).toEqual(1);
    });
  });
});

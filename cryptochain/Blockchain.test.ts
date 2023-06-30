import { describe, expect, it } from "@jest/globals";
import Block, { genesis } from "./block";
import Blockchain, { isValidChain } from "./Blockchain";
import cryptoHash from "./crypto-hash";

describe("Blockchain", () => {
  let blockchain: Blockchain;
  let newChain: Blockchain;
  let originalChain: Block[];

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = ["foo bar"];
    blockchain.addBlock(newData);

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0].data = ["fake genesis"];
        expect(isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock(["Bears"]);
        blockchain.addBlock(["Beets"]);
        blockchain.addBlock(["Battlestart Galactica"]);
      });

      describe("and a previousBlockHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].previousBlockHash = "broken-hash";
          expect(isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = ["some-bad-evil-data"];
          expect(isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const previousBlockHash = lastBlock.hash;
          const timestamp = Date.now().toString();
          const nonce = 0;
          const data: string[] = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(
            timestamp,
            previousBlockHash,
            difficulty.toString(),
            nonce.toString(),
            ...data
          );

          const badBlock = new Block({
            timestamp,
            previousBlockHash,
            difficulty,
            nonce,
            data,
            hash,
          });

          blockchain.chain.push(badBlock);

          expect(isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errorMock: jest.Mock<any, any, any>;
    let logMock: jest.Mock<any, any, any>;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0].data = ["chain"];
        blockchain.replaceChain(newChain.chain);
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock(["Bears"]);
        newChain.addBlock(["Beets"]);
        newChain.addBlock(["Battlestart Galactica"]);
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "some-fake-hash";

          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});

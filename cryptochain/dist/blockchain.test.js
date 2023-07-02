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
const blockchain_js_1 = __importStar(require("./blockchain.js"));
const crypto_hash_js_1 = __importDefault(require("./crypto-hash.js"));
(0, globals_1.describe)("Blockchain", () => {
    let blockchain;
    let newChain;
    let originalChain;
    beforeEach(() => {
        blockchain = new blockchain_js_1.default();
        newChain = new blockchain_js_1.default();
        originalChain = blockchain.chain;
    });
    (0, globals_1.it)("contains a `chain` Array instance", () => {
        (0, globals_1.expect)(blockchain.chain instanceof Array).toBe(true);
    });
    (0, globals_1.it)("starts with the genesis block", () => {
        (0, globals_1.expect)(blockchain.chain[0]).toEqual((0, block_js_1.genesis)());
    });
    (0, globals_1.it)("adds a new block to the chain", () => {
        const newData = [
            1,
            "foo bar",
            { data: "data" },
            "another data",
            ["we just want to test"],
            [10, 20, 30],
        ];
        blockchain.addBlock(newData);
        (0, globals_1.expect)(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });
    (0, globals_1.describe)("isValidChain()", () => {
        (0, globals_1.describe)("when the chain does not start with the genesis block", () => {
            (0, globals_1.it)("returns false", () => {
                blockchain.chain[0].data = ["fake genesis"];
                (0, globals_1.expect)((0, blockchain_js_1.isValidChain)(blockchain.chain)).toBe(false);
            });
        });
        (0, globals_1.describe)("when the chain starts with the genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock(["Bears"]);
                blockchain.addBlock(["Beets"]);
                blockchain.addBlock(["Battlestart Galactica"]);
            });
            (0, globals_1.describe)("and a previousBlockHash reference has changed", () => {
                (0, globals_1.it)("returns false", () => {
                    blockchain.chain[2].previousBlockHash = "broken-hash";
                    (0, globals_1.expect)((0, blockchain_js_1.isValidChain)(blockchain.chain)).toBe(false);
                });
            });
            (0, globals_1.describe)("and the chain contains a block with an invalid field", () => {
                (0, globals_1.it)("returns false", () => {
                    blockchain.chain[2].data = ["some-bad-evil-data"];
                    (0, globals_1.expect)((0, blockchain_js_1.isValidChain)(blockchain.chain)).toBe(false);
                });
            });
            (0, globals_1.describe)("and the chain contains a block with a jumped difficulty", () => {
                (0, globals_1.it)("returns false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const previousBlockHash = lastBlock.hash;
                    const timestamp = Date.now().toString();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = (0, crypto_hash_js_1.default)(timestamp, previousBlockHash, difficulty.toString(), nonce.toString(), ...data);
                    const badBlock = new block_js_1.default({
                        timestamp,
                        previousBlockHash,
                        difficulty,
                        nonce,
                        data,
                        hash,
                    });
                    blockchain.chain.push(badBlock);
                    (0, globals_1.expect)((0, blockchain_js_1.isValidChain)(blockchain.chain)).toBe(false);
                });
            });
            (0, globals_1.describe)("and the chain does not contain any invalid blocks", () => {
                (0, globals_1.it)("returns true", () => {
                    (0, globals_1.expect)((0, blockchain_js_1.isValidChain)(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    (0, globals_1.describe)("replaceChain()", () => {
        let errorMock;
        let logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });
        (0, globals_1.describe)("when the new chain is not longer", () => {
            beforeEach(() => {
                newChain.chain[0].data = ["chain"];
                blockchain.replaceChain(newChain.chain);
            });
            (0, globals_1.it)("does not replace the chain", () => {
                (0, globals_1.expect)(blockchain.chain).toEqual(originalChain);
            });
            (0, globals_1.it)("logs an error", () => {
                (0, globals_1.expect)(errorMock).toHaveBeenCalled();
            });
        });
        (0, globals_1.describe)("when the chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock(["Bears"]);
                newChain.addBlock(["Beets"]);
                newChain.addBlock(["Battlestart Galactica"]);
            });
            (0, globals_1.describe)("and the chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].hash = "some-fake-hash";
                    blockchain.replaceChain(newChain.chain);
                });
                (0, globals_1.it)("does not replace the chain", () => {
                    (0, globals_1.expect)(blockchain.chain).toEqual(originalChain);
                });
                (0, globals_1.it)("logs an error", () => {
                    (0, globals_1.expect)(errorMock).toHaveBeenCalled();
                });
            });
            (0, globals_1.describe)("and the chain is invalid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                (0, globals_1.it)("replaces the chain", () => {
                    (0, globals_1.expect)(blockchain.chain).toEqual(newChain.chain);
                });
                (0, globals_1.it)("logs about the chain replacement", () => {
                    (0, globals_1.expect)(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});

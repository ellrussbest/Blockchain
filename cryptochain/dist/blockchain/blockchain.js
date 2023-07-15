"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidChain = void 0;
const block_1 = require("./block");
const utils_1 = require("../utils");
const wallet_1 = require("../wallet");
var blockchain;
(function (blockchain) {
    /** Functions */
    blockchain.isValidChain = (chain) => {
        // when the chain does not start with the genesis block return false
        if (JSON.stringify(chain[0]) !== JSON.stringify((0, block_1.genesis)()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, previousBlockHash, hash, data, nonce, difficulty: currentBlockDifficulty, } = chain[i];
            const actualpreviousBlockHash = chain[i - 1].hash;
            const previousBlockDifficulty = chain[i - 1].difficulty;
            if (previousBlockHash !== actualpreviousBlockHash)
                return false;
            const dataToBeHashed = data.map((val) => JSON.stringify(val));
            const validatedHash = (0, utils_1.cryptoHash)(timestamp, previousBlockHash, nonce.toString(), currentBlockDifficulty.toString(), ...dataToBeHashed);
            if (hash !== validatedHash)
                return false;
            if (Math.abs(previousBlockDifficulty - currentBlockDifficulty) > 1)
                return false;
        }
        return true;
    };
    /** The blockchain class */
    class Blockchain {
        chain = [];
        constructor() {
            this.chain = [...this.chain, (0, block_1.genesis)()];
        }
        addBlock(data) {
            const lastBlock = this.chain[this.chain.length - 1];
            this.chain.push((0, block_1.mineBlock)({
                lastBlock,
                data,
            }));
            return this;
        }
        replaceChain(chain, validateTransactions, onSuccess) {
            // if the new chain's length is less or equal to the length of the existing blockchain
            // the incoming chain must be longer than the present chain
            if (chain.length <= this.chain.length) {
                console.error("The incoming chain must be longer");
                return this;
            }
            // verify if any of the chains is invalid, if invalid, don't replace
            if (!blockchain.isValidChain(chain)) {
                console.error("The incoming chain must be valid");
                return this;
            }
            if (validateTransactions && this.validTransactionData({
                chain,
            })) {
                console.error("The incoming chain has invalid transaction error");
                return this;
            }
            if (!!onSuccess)
                onSuccess();
            console.log("Replacing chain with", chain);
            this.chain = chain;
            return this;
        }
        validTransactionData(params) {
            const { chain } = params;
            let transactionSet = new Set();
            for (let i = 1; i < chain.length; i++) {
                const block = chain[i];
                let rewardTransactionCount = 0;
                for (let transaction of block.data) {
                    transactionSet.add(transaction.id);
                    // check if we have more than one Reward in a block
                    if (transaction.input.address === utils_1.REWARD_INPUT.address) {
                        rewardTransactionCount += 1;
                        if (rewardTransactionCount > 1) {
                            console.error("Miner rewards exceed limit");
                            return false;
                        }
                        if (Object.values(transaction.outputMap)[0] !==
                            utils_1.MINING_REWARD) {
                            console.error("Miner reward amount is invalid");
                            return false;
                        }
                    }
                    else {
                        if (!(0, wallet_1.validateTransaction)(transaction)) {
                            console.error("Invalid transaction");
                            return false;
                        }
                        const trueBalance = wallet_1.Wallet.calculateBalance({
                            chain: this.chain,
                            address: transaction.input.address,
                        });
                        if (transaction.input.amount !== trueBalance) {
                            console.error("Invalid input amount");
                            return false;
                        }
                        if (transactionSet.has(transaction)) {
                            console.error("An identical transaction appears more than once in the block");
                            return false;
                        }
                        else {
                            transactionSet.add(transaction);
                        }
                    }
                }
            }
            return true;
        }
    }
    blockchain.Blockchain = Blockchain;
})(blockchain || (blockchain = {}));
exports.default = blockchain.Blockchain;
exports.isValidChain = blockchain.isValidChain;

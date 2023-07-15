"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = void 0;
const elliptic_1 = require("elliptic");
const _1 = require(".");
/**
 * SECP256K1 is an elliptic curve used in cryptography.
 * It is named after the parameters of the curve: "SECP" refers to the Standards for Efficient Cryptography Prime,
 * while "256" means that the curve has a 256-bit key size,
 */
const ec = new elliptic_1.ec("secp256k1");
const verifySignature = (params) => {
    const keyFromPublic = ec.keyFromPublic(params.publicKey, "hex");
    return keyFromPublic.verify((0, _1.cryptoHash)(JSON.stringify(params.data)), params.signature);
};
exports.verifySignature = verifySignature;
exports.default = ec;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_hash_js_1 = __importDefault(require("./crypto-hash.js"));
describe("cryptoHash()", () => {
    it("generates a SHA-256 hashed output", () => {
        expect((0, crypto_hash_js_1.default)("foo")).toEqual("2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
    });
    it("produces the same hash with the same input arguments in any order", () => {
        expect((0, crypto_hash_js_1.default)("one", "two", "three")).toEqual((0, crypto_hash_js_1.default)("three", "one", "two"));
    });
});

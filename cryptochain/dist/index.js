"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blockchain_js_1 = __importDefault(require("./blockchain.js"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const blockchain = new blockchain_js_1.default();
app.use(body_parser_1.default.json());
app.get("/api/blocks", (req, res, next) => {
    res.json({
        chain: blockchain.chain,
    });
});
app.post("/api/mine", (req, res, next) => {
    const { data } = req.body;
    blockchain.addBlock(data);
    res.redirect("/api/blocks");
});
app.listen(5000, () => {
    console.log("Listening at localhost:5000");
});

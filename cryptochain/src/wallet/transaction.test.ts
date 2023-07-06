import { verifySignature } from "../utils";
import Transaction from "./transaction";
import Wallet from "./wallet";

describe("Transaction", () => {
	let transaction: Transaction,
		senderWallet: Wallet,
		recipient: string,
		amount: number;

	beforeEach(() => {
		senderWallet = new Wallet();
		recipient = "recipient-public-key";
		amount = 50;

		transaction = new Transaction({
			senderWallet,
			recipient,
			amount,
		});
	});

	it("has an `id`", () => {
		expect(transaction).toHaveProperty("id");
	});

	describe("outputMap", () => {
		it("has `outputMap`", () => {
			expect(transaction).toHaveProperty("outputMap");
		});

		it("outputs the amount to the recipient", () => {
			expect(transaction.outputMap[recipient]).toEqual(amount);
		});

		it("outputs the remainging for the `senderWallet`", () => {
			expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
				senderWallet.balance - amount,
			);
		});
	});

	describe("input", () => {
		it("has an `input`", () => {
			expect(transaction).toHaveProperty("input");
		});

		it("has `timestamp` in the input", () => {
			expect(transaction.input).toHaveProperty("timestamp");
		});

		it("sets the `amount` to the `senderWallet` balance", () => {
			expect(transaction.input.amount).toEqual(senderWallet.balance);
		});

		it("sets the `address` to the `senderWallet` `publicKey`", () => {
			expect(transaction.input.address).toEqual(senderWallet.publicKey);
		});

		it("signs the input", () => {
			expect(
				verifySignature({
					publicKey: senderWallet.publicKey,
					data: transaction.outputMap,
					signature: transaction.input.signature,
				}),
			).toBe(true);
		});
	});
});

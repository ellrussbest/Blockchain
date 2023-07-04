import Wallet from "./wallet";
import { verifySignature } from "../utils";

describe("Wallet", () => {
	let wallet: Wallet;

	beforeEach(() => {
		wallet = new Wallet();
	});

	it("has a `balance`", () => {
		expect(wallet).toHaveProperty("balance");
	});

	it("has a `publicKey`", () => {
		expect(wallet).toHaveProperty("publicKey");
	});

	describe("signing data", () => {
		const data = "foobar";

		it("verifies a signature", () => {
			expect(
				verifySignature({
					publicKey: wallet.publicKey,
					data,
					signature: wallet.sign(data),
				}),
			).toBe(true);
		});

		it("it does not verify an invalid signature", () => {
			expect(
				verifySignature({
					publicKey: wallet.publicKey,
					data,
					signature: new Wallet().sign(data),
				}),
			).toBe(false);
		});
	});
});

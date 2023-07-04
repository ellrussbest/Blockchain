import { STARTING_BALANCE, ec, cryptoHash } from "../utils";

export default class Wallet {
	public balance: number;
	public publicKey;
	public keyPair;

	constructor() {
		this.balance = STARTING_BALANCE;

		this.keyPair = ec.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode("hex", false);
	}

	sign(data: any) {
		return this.keyPair.sign(cryptoHash(JSON.stringify(data)));
	}
}

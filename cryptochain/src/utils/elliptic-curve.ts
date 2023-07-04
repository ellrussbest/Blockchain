import { ec as EC } from "elliptic";
import { cryptoHash } from ".";

/**
 * SECP256K1 is an elliptic curve used in cryptography.
 * It is named after the parameters of the curve: "SECP" refers to the Standards for Efficient Cryptography Prime,
 * while "256" means that the curve has a 256-bit key size,
 */
const ec = new EC("secp256k1");

export const verifySignature = (params: {
	publicKey: string;
	data: any;
	signature: EC.Signature;
}) => {
	const keyFromPublic = ec.keyFromPublic(params.publicKey, "hex");
	return keyFromPublic.verify(
		cryptoHash(JSON.stringify(params.data)),
		params.signature,
	);
};

export default ec;

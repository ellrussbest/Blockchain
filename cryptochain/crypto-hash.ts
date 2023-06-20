import * as crypto from "crypto";

const cryptoHash = (...inputs: string[]): string => {
  const hash = crypto.createHash("sha256");

  hash.update(inputs.sort().join(" "));
  return hash.digest("hex");
};

export default cryptoHash;

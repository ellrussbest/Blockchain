const crypto = require("crypto");

const data = [];

data.push("a");
data.push({ b: "song" });
data.push([1, 2, 3]);

const data2 = [];

data2.push([1, 2, 3]);
data2.push("a");
data2.push({ b: "song" });

const str = data
  .map((val) => JSON.stringify(val))
  .sort()
  .join(" ");

console.log(str);

const str2 = data2
  .map((val) => JSON.stringify(val))
  .sort()
  .join(" ");

console.log(str2);

const hash = crypto.createHash("sha256")
hash.update(str)
console.log(hash.digest("hex"))

hash.update(str2)
console.log(hash.digest("hex"))

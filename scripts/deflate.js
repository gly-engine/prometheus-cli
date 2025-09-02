const fs = require("fs");
const zlib = require("zlib");

const input = fs.readFileSync("dist/cli-bootstraped.lua");
const compressed = zlib.deflateRawSync(input, { level: 9, memLevel: 9 });
const output = compressed.toString("base64");

fs.writeFileSync("dist/cli.txt", output);
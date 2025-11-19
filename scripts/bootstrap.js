const fs = require("fs");

function bootstrap() {
  const fmock = fs.readFileSync("vendor/gly-engine/tests/mock/io.lua", "utf8");
  const fbootstrap = fs.readFileSync("vendor/gly-engine/source/cli/hazard/silvertap.lua", "utf8");
  const fiolines = fs.readFileSync("src/lines.lua", "utf8");
  const fprometheus = fs.readFileSync("dist/main.lua", "utf8");

  const match = fmock.match(/--! @bootstrap([\s\S]*?)--! @endbootstrap/);
  const content = (match ? match[1] : "") + fbootstrap + fiolines + fprometheus;

  return content;
}

const result = bootstrap();
fs.writeFileSync("dist/cli-bootstraped.lua", result, "utf8");

// nodejs
import path from "path";
import * as zlib from "zlib";
import { fileURLToPath } from 'url';
// node_modules
import { Lua } from 'wasmoon-lua5.1'
// vendorize
import cli from "../dist/cli.txt" assert { type: "text" };

async function main() {
  const script = zlib.inflateRawSync(Buffer.from(cli, 'base64')).toString();
  const lua = await Lua.create({
    customWasmUri: path.join(fileURLToPath(import.meta.url), '..', '..', 'lib', 'liblua5.1.wasm')
  });

  lua.global.set('arg', process.argv.slice(1))
  // https://github.com/ceifa/demoon/blob/4d854848d9aedaedead4cef5e8e714320e72cd4c/src/index.js#L26
  lua.global.set('jsRequire', (modulename, metaDirectory) => {
    if (metaDirectory) {
      if (modulename.startsWith('.')) {
        modulename = path.resolve(metaDirectory, '..', modulename)
      }
      modulename = require.resolve(modulename)
    }

    return module.require(modulename)
  })
  try {
    lua.doStringSync(script);
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

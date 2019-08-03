const fs = require('fs');
const express = require('express')
const app = express()


// const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "/../build/optimized.wasm"));
// const imports = {
//   env: {
//     abort(_msg, _file, line, column) {
//        console.error("abort called at index.ts:" + line + ":" + column);
//     }
//   }
// };
// Object.defineProperty(module, "exports", {
//   get: () => new WebAssembly.Instance(compiled, imports).exports
// });


app.use(express.static('dist'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
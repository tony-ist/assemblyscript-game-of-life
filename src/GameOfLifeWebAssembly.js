export default async (width, height) => {
  const memory = new WebAssembly.Memory({ initial: 256 })
  const memoryView = new Uint32Array(memory.buffer)

  const importObject = {
    env: {
      abort: () => {},
      memory,
    },
    imports: {
      width,
      height,
      f
    },
    Math
  }

  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer()
      return await WebAssembly.instantiate(source, importObject)
    }
  }

  const obj = await WebAssembly.instantiateStreaming(fetch('gameoflife.wasm'), importObject)
  console.log(obj)
  // obj.instance.exports.step()
  // obj.instance.exports.randomize()
  console.log(memoryView)

  function f(x) {
    console.log('f', x)
  }

  return { step: obj.instance.exports.step, randomize: obj.instance.exports.randomize, memoryView }
}

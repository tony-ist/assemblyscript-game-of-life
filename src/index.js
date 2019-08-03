const GameOfLifeWebAssembly = (async () => {
  const memory = new WebAssembly.Memory({ initial: 10 })
  const memoryView = new Int32Array(memory.buffer)

  const importObject = {
    env: {
      abort: () => {},
      memory,
    },
    imports: {
      width: 20,
      height: 20,
      f
    }
  }

  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer()
      return await WebAssembly.instantiate(source, importObject)
    }
  }

  const obj = await WebAssembly.instantiateStreaming(fetch('gameoflife.wasm'), importObject)
  console.log(obj)
  obj.instance.exports.step()
  console.log(memoryView)

  function f(x) {
    console.log('f', x)
  }
})

const Main = (async () => {
  const width = window.innerWidth
  const height = window.innerHeight - 3

  const memory = new WebAssembly.Memory({ initial: 10 })
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
  obj.instance.exports.step()
  console.log(memoryView)

  function f(x) {
    console.log('f', x)
  }

  const canvas = document.getElementById('canvas')
  canvas.width  = width
  canvas.height = height
  const context = canvas.getContext('2d')
  const imageData = context.createImageData(width, height)
  const imageDataView = new Uint32Array(imageData.data.buffer)
  imageDataView.set(memoryView.slice(0, 1000))
  // imageData.data[0] = 0
  // imageData.data[1] = 0
  // imageData.data[2] = 0
  // imageData.data[3] = 255
  console.log(imageData)
  // context.fillRect(0, 0, width, height)
  context.putImageData(imageData, 0, 0)

  console.log('width:', width)
  console.log('height:', height)

  while (true) {


    break
  }
})

window.onload = Main
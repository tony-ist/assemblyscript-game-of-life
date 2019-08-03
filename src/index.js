const GameOfLifeWebAssembly = ((memory) => {
  const importObject = {
    env: {
      __memory_base: 0,
      __table_base: 0,
      abort: function () {
      },
      memory: new WebAssembly.Memory({initial: 256}),
      table: new WebAssembly.Table({initial: 0, element: 'anyfunc'})
    },
    imports: {f}
  }

  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer()
      return await WebAssembly.instantiate(source, importObject)
    }
  }

  WebAssembly.instantiateStreaming(fetch('gameoflife.wasm'), importObject)
    .then((obj) => console.log(obj.instance.exports.subtract(12, 30)));

  function f() {
    console.log('f')
  }
})



const Main = (() => {
  const width = 100
  const height = 100
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  const imageData = context.createImageData(10, 10)
  // const imageDataView = new Uint8ClampedArray(imageData.data.buffer)
  imageData.data[0] = 255
  imageData.data[1] = 0
  imageData.data[2] = 0
  imageData.data[3] = 255
  console.log(imageData)
  context.fillRect(1, 1, 1, 1)
  context.putImageData(imageData, 0, 0)

  while (true) {


    break
  }
})

window.onload = Main
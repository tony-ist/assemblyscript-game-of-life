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
  const width = window.innerWidth - 10
  const height = window.innerHeight - 10

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
  obj.instance.exports.randomize()
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

  imageDataView.set(memoryView.slice(0, width * height))
  console.log(imageData)
  context.putImageData(imageData, 0, 0)

  console.log('width:', width)
  console.log('height:', height)

  canvas.onclick = () => {
    obj.instance.exports.step()
    imageDataView.set(memoryView.slice(0, width * height))
    context.putImageData(imageData, 0, 0)
  }

  let deltaTime
  const fpsCounter = document.getElementById('fpsCounter')
  document.getElementById('widthLabel').innerText = `Width: ${width}`
  document.getElementById('heightLabel').innerText = `Height: ${height}`

  function cycle() {
    const startTime = new Date()
    obj.instance.exports.step()
    console.log(1000 / (new Date - startTime))
    imageDataView.set(memoryView.slice(0, width * height))
    context.putImageData(imageData, 0, 0)
    const endTime = new Date()
    deltaTime = endTime - startTime
    setTimeout(cycle, 1)
  }

  function updateFPS() {
    const FPS = Math.round(1000 / deltaTime)
    fpsCounter.innerText = `FPS: ${FPS}`
    setTimeout(updateFPS, 1000)
  }

  cycle()
  updateFPS()
})

window.onload = Main
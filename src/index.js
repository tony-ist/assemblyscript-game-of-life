import GameOfLifeWebAssembly from './GameOfLifeWebAssembly'
import GameOfLifeJS from './GameOfLifeJS'

const Main = (async () => {
  const width = window.innerWidth - 10
  const height = window.innerHeight - 10

  const canvas = document.getElementById('canvas')
  canvas.width  = width
  canvas.height = height

  const context = canvas.getContext('2d')
  const imageData = context.createImageData(width, height)
  const imageDataView = new Uint32Array(imageData.data.buffer)

  const radioWebAssembly = document.getElementById('radioWebAssembly')
  const radioJS = document.getElementById('radioJS')

  radioWebAssembly.onclick = reset
  radioJS.onclick = reset

  let GameOfLife

  async function reset() {
    if (radioWebAssembly.checked) {
      GameOfLife = await GameOfLifeWebAssembly(width, height)
    } else {
      GameOfLife = GameOfLifeJS(width, height)
    }

    GameOfLife.randomize()
  }

  await reset()

  imageDataView.set(GameOfLife.memoryView.slice(0, width * height))
  context.putImageData(imageData, 0, 0)

  let painting = false
  let brushX, brushY

  canvas.addEventListener('mousedown', (e) => {
    painting = true
  })

  canvas.addEventListener('mousemove', (e) => {
    brushX = e.offsetX
    brushY = e.offsetY
  })

  canvas.addEventListener('mouseup', (e) => {
    painting = false
  })

  let deltaTime
  const fpsCounter = document.getElementById('fpsCounter')
  document.getElementById('widthLabel').innerText = `Width: ${width}`
  document.getElementById('heightLabel').innerText = `Height: ${height}`

  function cycle() {
    const startTime = new Date()

    if (painting) {
      GameOfLife.paint(brushX, brushY)
    }

    GameOfLife.step()
    imageDataView.set(GameOfLife.memoryView.slice(0, width * height))
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
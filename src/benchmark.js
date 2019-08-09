import GameOfLifeJS from './GameOfLifeJS'
import GameOfLifeWebAssembly from './GameOfLifeWebAssembly'

const width = 100
const height = 100
const steps = 1000

function benchmark(game) {
  const startTime = new Date()

  game.randomize()

  for (let i = 0; i < steps; i++) {
    game.step()
  }

  return new Date() - startTime
}

async function start() {
  const js = benchmark(GameOfLifeJS(width, height))
  const webAssembly = benchmark(await GameOfLifeWebAssembly(width, height))

  console.log(`JS: ${js}ms`)
  console.log(`WebAssembly: ${webAssembly}ms`)
}

start()

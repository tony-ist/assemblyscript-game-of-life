import GameOfLife from '../compiled/gameoflife.wasm'

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

  const game = await GameOfLife(importObject)
  const { step, randomize, paint } = game.instance.exports

  function f(x) {
    console.log('f', x)
  }

  return { step, randomize, paint, memoryView }
}

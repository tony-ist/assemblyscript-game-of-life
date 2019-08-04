export default (width, height) => {
  const PIXELS = width * height
  const SECONDARY_MEMORY_OFFSET = PIXELS

  const BLACK = 0xFF000000
  const WHITE = 0

  const memoryView = new Uint32Array(PIXELS * 2)

  function set(x, y, offset = 0) {
    memoryView[toIndex(x, y) + offset] = BLACK
  }

  function setSecondary(x, y) {
    set(x, y, SECONDARY_MEMORY_OFFSET)
  }

  function clear(x, y, offset = 0) {
    memoryView[toIndex(x, y) + offset] = WHITE
  }

  function clearSecondary(x, y) {
    clear(x, y, SECONDARY_MEMORY_OFFSET)
  }

  function get(x, y, offset = 0) {
    return memoryView[toIndex(x, y) + offset]
  }

  function getSecondary(x, y) {
    return get(x, y, SECONDARY_MEMORY_OFFSET)
  }

  function toIndex(x, y) {
    return y * width + x
  }
  
  function isAlive(value) {
    return value === BLACK ? 1 : 0
  }

  function aliveNeighbours(x, y) {
    return isAlive(get(x - 1, y - 1)) +
      isAlive(get(x, y - 1)) +
      isAlive(get(x - 1, y)) +
      isAlive(get(x + 1, y + 1)) +
      isAlive(get(x + 1, y)) +
      isAlive(get(x, y + 1)) +
      isAlive(get(x - 1, y + 1)) +
      isAlive(get(x + 1, y - 1))
  }

  function copySecondaryToPrimary() {
    for (let i = 0; i < SECONDARY_MEMORY_OFFSET; i++) {
      memoryView[i] = memoryView[i + SECONDARY_MEMORY_OFFSET]
    }
  }

  function clearMemory() {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        clear(i, j)
        clear(i, j, SECONDARY_MEMORY_OFFSET)
      }
    }
  }

  function isInBoundaries(x, y) {
    return x > 0 && x < width - 1 && y > 0 && y < height - 1
  }

  function randomize() {
    clearMemory()

    for (let i = 0; i < PIXELS; i++) {
      const randomX = parseInt(Math.random() * width)
      const randomY = parseInt(Math.random() * height)

      if (randomX === 0 || randomY === 0) {
        continue
      }

      set(randomX, randomY)
    }
  }

  function step() {
    for (let i = 1; i < width - 1; i++) {
      for (let j = 1; j < height - 1; j++) {
        const vicinity = aliveNeighbours(i, j)

        if (isAlive(get(i, j))) {
          switch(vicinity) {
            case 0:
            case 1:
              clearSecondary(i, j)
              break
            case 2:
            case 3:
              setSecondary(i, j)
              break
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
              clearSecondary(i, j)
              break
          }
        } else {
          switch(vicinity) {
            case 0:
            case 1:
            case 2:
              clearSecondary(i, j)
              break
            case 3:
              setSecondary(i, j)
              break
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
              clearSecondary(i, j)
              break
          }
        }
      }
    }

    copySecondaryToPrimary()
  }

  function paint(x, y) {
    const size = 50

    for (let i = -size / 2; i < size / 2; i++) {
      if (isInBoundaries(x + i, y)) {
        set(x + i, y)
      }
    }

    for (let i = -size / 2; i < size / 2; i++) {
      if (isInBoundaries(x, y + i)) {
        set(x, y + i)
      }
    }
  }

  return { step, randomize, paint, memoryView }
}

@external('imports', 'width')
declare const WIDTH: i32

@external('imports', 'height')
declare const HEIGHT: i32

@external('imports', 'f')
declare function f(x: i32): void

const PIXELS: i32 = WIDTH * HEIGHT
const SECONDARY_MEMORY_OFFSET: i32 = PIXELS * 4

const BLACK = 0xFF000000
const WHITE = 0

function set(x: i32, y: i32, pointerOffset: i32 = 0): void {
  store<u32>(toPointer(x, y) + pointerOffset, BLACK)
}

function setSecondary(x: i32, y: i32): void {
  set(x, y, SECONDARY_MEMORY_OFFSET)
}

function clear(x: i32, y: i32, pointerOffset: i32 = 0): void {
  store<u32>(toPointer(x, y) + pointerOffset, WHITE)
}

function clearSecondary(x: i32, y: i32): void {
  clear(x, y, SECONDARY_MEMORY_OFFSET)
}

function get(x: i32, y: i32, pointerOffset: i32 = 0): u32 {
  return load<u32>(toPointer(x, y) + pointerOffset)
}

function getSecondary(x: i32, y: i32): u32 {
  return get(x, y, SECONDARY_MEMORY_OFFSET)
}

function toPointer(x: i32, y: i32): i32 {
  return (y * WIDTH + x) * 4
}

function isAlive(value: u32): i32 {
  return value === BLACK ? 1 : 0
}

function aliveNeighbours(x: i32, y: i32): i32 {
  return isAlive(get(x - 1, y - 1)) +
    isAlive(get(x, y - 1)) +
    isAlive(get(x - 1, y)) +
    isAlive(get(x + 1, y + 1)) +
    isAlive(get(x + 1, y)) +
    isAlive(get(x, y + 1)) +
    isAlive(get(x - 1, y + 1)) +
    isAlive(get(x + 1, y - 1))
}

function copySecondaryToPrimary(): void {
  const sizeOfU32 = 4

  for (let i: i32 = 0; i < SECONDARY_MEMORY_OFFSET; i += sizeOfU32) {
    store<u32>(i, load<u32>(i + SECONDARY_MEMORY_OFFSET))
  }
}

function clearMemory(): void {
  for (let i: i32 = 0; i < WIDTH; i++) {
    for (let j: i32 = 0; j < HEIGHT; j++) {
      clear(i, j)
      clear(i, j, SECONDARY_MEMORY_OFFSET)
    }
  }
}

function isInBoundaries(x: i32, y: i32): boolean {
  return x > 0 && x < WIDTH - 1 && y > 0 && y < HEIGHT - 1
}

export function randomize(): void {
  clearMemory()

  for (let i: i32 = 0; i < PIXELS; i++) {
    const randomX: i32 = i32(Math.random() * WIDTH)
    const randomY: i32 = i32(Math.random() * HEIGHT)

    if (randomX === 0 || randomY === 0) {
      continue
    }

    set(randomX, randomY)
  }
}

export function step(): void {
  for (let i: i32 = 1; i < WIDTH - 1; i++) {
    for (let j: i32 = 1; j < HEIGHT - 1; j++) {
      const aliveNeighbours: i32 = aliveNeighbours(i, j)

      if (isAlive(get(i, j))) {
        switch(aliveNeighbours) {
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
          switch(aliveNeighbours) {
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

export function paint(x: i32, y: i32): void {
  const size = 50

  for (let i: i32 = -size / 2; i < size / 2; i++) {
    if (isInBoundaries(x + i, y)) {
      set(x + i, y)
    }
  }

  for (let i: i32 = -size / 2; i < size / 2; i++) {
    if (isInBoundaries(x, y + i)) {
      set(x, y + i)
    }
  }
}

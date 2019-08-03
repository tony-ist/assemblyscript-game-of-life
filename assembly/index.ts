@external('imports', 'width')
declare const width: i32

@external('imports', 'width')
declare const height: i32

@external('imports', 'f')
declare function f(x: i32): void

function set(x: i32, y: i32): void {
  store<u32>(toPointer(x, y), 0xFF000000)
}

function clear(x: i32, y: i32): void {
  store<u32>(toPointer(x, y), 0)
}

function get(x: i32, y: i32): u32 {
  return load<u32>(toPointer(x, y))
}

function toPointer(x: i32, y: i32): i32 {
  return (y * width + x) << 2
}

// x in [0, width)
// y in [0, height)

export function initialize(): void {

}

export function step(): void {
  // clear(0, 0)
  // clear(1, 0)
  // clear(2, 0)
  // clear(3, 0)
  set(i32(Math.random()), i32(Math.random()))
  set(0, 0)
  set(0, 1)
  set(1, 0)
  set(1, 1)
  f(get(0, 0))
  f(get(0, 1))
  f(get(1, 0))
  f(get(1, 1))
}
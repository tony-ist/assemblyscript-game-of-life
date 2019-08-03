export { subtract } from './subtract'

// declare namespace imports {
//     function f(): void;
// }
//
// imports.f()

@external("imports", "f")
declare function f(): void

f()

export function add(a: i32, b: i32): i32 {
    return a + b;
}

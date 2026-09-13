# TypeScript

`keyof` 取 interface 的键后保存为 union

`extends` is used to **set type constraints**, which means it should have some properties. Or `a extends b` can be interpreted as **a is assignable to b**.

`in` 遍历 union type

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```

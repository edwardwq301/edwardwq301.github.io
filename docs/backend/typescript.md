# TypeScript

`keyof` 取 interface 的键后保存为 union

`extends` is used to **set type constraints**, which means shold have some proprities. or can `a extends b` can be interpered that **a is assignable to b**.

`in` 遍历 union type 

```TypeScript
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```
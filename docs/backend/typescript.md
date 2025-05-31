# TypeScript

`keyof` 取 interface 的键后保存为 union

`extends` 进行类型子集判断

`in` 遍历 union type 

```TypeScript
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key]
}
```
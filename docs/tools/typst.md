# typst

## demo

起因是两个德国人对 LaTeX 不满意，然后弄出了一个 typst

官方的网页端渲染似乎比我本地快🤣

好处：确实如文档所说能快速上手，不用像 LaTeX 上来先记住文档引入命令

不足：中文首行缩进需要一些 trick，希望未来能加入这个功能（2024/1/21）

默认字体是 Linux Libertine

## sheet

`set` 规则类似 CSS，把所有实例设置特征

- `#align(center + bottom)`
- `page` 的 `flipped`
    - 默认为 false，结果为竖版（portrait orientation 人像画）
    - 为 true：调整为横版（landscape orientation 风景画）

`set` 规则方便设置已有的元素，像是 page、heading 等，一次调整好所有元素

`show` 规则对自定义元素进行调整：`#show "hello": it => text(font: "Fira Code", it)`

`set` 会设置所有符合条件的元素。比如一级标题和二级标题有不同样式时，就不应该用 `set`，应该改用 `show`

```typ
#show: rest => columns(2,rest)

#set heading(
  offset: 2
)
// 后边的 show 不起作用

#show heading.where(
  level: 1
): it => block(width: 100%)[
  #set align(center)
  #set text(12pt, weight: "regular")
  #smallcaps(it.body)
]

#show heading.where(
  level: 2
): it => text(
  size: 11pt,
  weight: "regular",
  style: "italic",
  smallcaps(it.body)
)


= Introduction
#lorem(300)

== second
#lorem(20)

= Related Work
#lorem(200)
```

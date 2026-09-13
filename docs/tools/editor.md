# Editor

## Vim

### 编辑

- visual block 后进入插入模式：`Shift-i`
- 撤销当前行的所有修改：`U`
- 连续替换：`R`
- 改到行尾：`C`（`D` 是删到行尾）
- 粘贴到光标前：`P`
- 删除光标处字符并进入插入模式：`s`，整行则是 `S` 或 `cc`
- 搜索光标下的单词：`*` 向后、`#` 向前，可带计数如 `4*`
- `;` 同方向重复上一次 `f/F/t/T`，`,` 反方向重复
- `df{char}` 从光标删到下一个 `{char}`（含该字符），`dt{char}` 删到它之前（不含）
- `copen` 打开 quickfix 窗口（配合 `edit-compile-edit` 流程），相关 `cclose`、`cnext`、`cprev`

### 移动

- 跳到句首/段首/块首（普通模式）：`(`、`{`、`[`

### 文件

- 查看当前文件位置：`<C-g>`
- 跳到光标下的文件：`<C-]>`
- 把磁盘上的文件读入到光标下方：`:r FILENAME`

### 缓冲区与窗口

- 列出所有缓冲区：`ls`
- 切到指定缓冲区：`:b N`
- 切换上/下一个缓冲区：`bn` / `bp`，或 `:buffer` 后按 Tab 补全
- 最近两个文件互相切换：`<C-^>`（Ctrl+6）

### 跳转

- `<C-]>` 压 tag 栈（用于文件跳转），`<C-t>` 出栈
- `<C-o>` 跳到跳转列表上一处，`<C-i>` 下一处（线性，如 `gg`、`G` 之后）
- `^` 最近编辑的两个文件互相跳转
- `<C-a>` 数字加一，`<C-x>` 数字减一

### 其它

- 插入模式下按 `C-r` 再按 `=` 可以算数学，比如 `pow(2,4)`
- 忘记 sudo 就打开了文件，保存用 `:w !sudo tee %`
  - `:w` 只写出不读入，空参数默认写回原文件，所以要 `!` 交给外部命令
  - `:% !sudo tee %`：第一个 `%` 把指定范围作为标准输入，第二个 `%` 是当前文件名
  - 范围写法：`3,5`、`.-2,.+6`、`0`、`$`；visual 模式选中后按 `:` 会自动补全范围
- [Vim 与系统剪贴板交互](https://www.zhihu.com/question/19863631/answer/89354508)

## C++

- CLion 输入 `vector` 不补全尖括号，把标准设成 C++11 即可：`set(CMAKE_CXX_STANDARD 11)`
- 关闭函数参数提示（inlay hints）：`ctrl+shift+p` → `clangd:toggle inlay hints`
- 让智能补全不自动填入参数（[来源](https://stackoverflow.com/questions/76004921/how-can-i-disable-parameter-auto-completion-when-selecting-a-suggested-function)），在 `settings.json` 中加入：

```json
"clangd.arguments": [
    "--function-arg-placeholders=0"
],
```

- [教程](https://zhangjk98.xyz/vscode-c-and-cpp-develop-and-debug-setting/)
- [可能遇到的问题及解决](https://www.cnblogs.com/zjutzz/p/15303480.html#34-clangd-打开或关闭函数参数提示inlay-hints)

早日远离 M$C++，早日获得新生 😋

## Markdown Preview Enhanced

- 打印背景（让代码块背景为灰色）[教程](https://blog.csdn.net/RP123123123/article/details/118113026)

## VSCode

- `Ctrl+k` + 方向键调整窗口位置，配合 `Ctrl+\` 分屏

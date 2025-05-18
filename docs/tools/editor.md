---
title: editor
time: 2022-4-5
---


## C++
CLion 突然发现输入 vector 不补全尖括号了，后来发现设置成 c11 就行了即 `set(CMAKE_CXX_STANDARD 11)`

早日远离M$C++，早日获得新生😋

- [教程](https://zhangjk98.xyz/vscode-c-and-cpp-develop-and-debug-setting/)
- [可能遇到的问题及解决](https://www.cnblogs.com/zjutzz/p/15303480.html#34-clangd-%E6%89%93%E5%BC%80%E6%88%96%E5%85%B3%E9%97%AD%E5%87%BD%E6%95%B0%E5%8F%82%E6%95%B0%E6%8F%90%E7%A4%BAinlay-hints)

关闭函数参数提示(inlay hints) `ctrl+shift+p;clangd:toggle inlay hints`

智能补全不把参数填入 [源链接](https://stackoverflow.com/questions/76004921/how-can-i-disable-parameter-auto-completion-when-selecting-a-suggested-function)，在 `setting.json` 加入 

```
"clangd.arguments": [
    "--function-arg-placeholders=0"
],
```

## markdown preview enhanced
- 打印背景（让代码块背景为灰色） [教程](https://blog.csdn.net/RP123123123/article/details/118113026)

## vscode
ctrl+k arrowKey 调整窗口位置，配合 ctrl+\
## VIM

edit keys

- visio block后进入insert `Shift-i`
- undo all the changes on a line, `type U`
- replace steadily `R`
- changes to the end `C / D`
- put before the cursor `P`
- delete the char under cursor and enter insert mode `s`, and `S or CC` is the whole line 
- search the word under cursor forward/backward `\* #` and can use `4\`* to use number

move keys

- move to the beginning of sentence/paragraph/block `( { [in normal`

file keys

- show where you are in a file `<C-g>`
- jump to file under cursor `<C-]>` 
- retrieves disk file FILENAME and puts it below the cursor position `:r FILENAME` 

buffer and windows

- list all open buffers `ls`
- switch to a specific buffer `:b N`
- change buffer `bn/bp or :buffer (press tab)` buffer next/previous
- toggles between the last two files you edited `<C-^>`.  press ctrl and 6 or ctrl shift 6

[vim和系统剪贴板交互](https://www.zhihu.com/question/19863631/answer/89354508)

---
title: editor
time: 2022-4-5
author: WQ
tag: 
 - tools
categories: 
    - backend
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

??? tip "过时版"

    众所周知，可以用devC++，Visio Studio，vscode等等写C++，但是vscode可能会让人折腾半天。下面给出一个拿来就用的办法
    !!! 注意

        前提：需要安装好`vscode`，`mingw64`

    1. 配置文件夹

    2. 在`.vscode`文件夹下创建以下三个文件
        1. `c_cpp_properties.json`
        2. `launch.json`
        3. `tasks.json`
    3. 复制粘贴以下

        ===  "c_cpp_properties.json"
        
            ```json
            {
            "configurations": [
                {
                    "name": "Win32",
                    "includePath": [
                        "${workspaceFolder}/**"
                    ],
                    "defines": [
                        "_DEBUG",
                        "UNICODE",
                        "_UNICODE"
                    ],
                    "compilerPath": "D:/C/vscode/gcc/mingw64/bin/g++.exe",//你的g++位置
                    "cStandard": "gnu17",
                    "cppStandard": "gnu++14",
                    "intelliSenseMode": "windows-gcc-x64"
                }
                ],
            "version": 4
            }
            ```

        ===  "launch.json"  
            
            ```json
            {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "(gdb) 内部终端启动",
                    "type": "cppdbg",
                    "request": "launch",
                    "program": "${workspaceFolder}\\exe\\${fileBasenameNoExtension}.exe",//更多信息请查看gcc/g++的手册
                    "args": [],
                    "stopAtEntry": true,
                    "cwd": "${fileDirname}",
                    "environment": [],
                    "externalConsole": false,
                    
                    "MIMode": "gdb",
                    "miDebuggerPath": "D:\\C\\vscode\\gcc\\mingw64\\bin\\gdb.exe",
                    //你的gdb位置
                    "setupCommands": [
                        {
                            "description": "为 gdb 启用整齐打印",
                            "text": "-enable-pretty-printing",
                            
                            "ignoreFailures": true
                        },
                        {
                            "description": "将反汇编风格设置为 Intel",
                            "text": "-gdb-set disassembly-flavor intel",
                            "ignoreFailures": true
                        }
                    ]
                },
                ]
            }
            ```

        ===  "task.json"

            ```json
            {
            "tasks": [
                
                {
                    "type": "cppbuild",
                    "label": "g++.exe ",
                    "command": "D:/C/vscode/gcc/mingw64/bin/g++.exe",//对应你的g++位置
                    "args": [
                        "-fdiagnostics-color=always",
                        "-g",
                        "${file}",
                        "-o",
                        "${workspaceFolder}\\exe\\${fileBasenameNoExtension}.exe"
                    ],
                    "options": {
                        "cwd": "D:/C/vscode/gcc/mingw64/bin"
                    },
                    "problemMatcher": [
                        "$gcc"
                    ],
                    "group": {
                        "kind": "build",
                        "isDefault": true
                    },
                    "detail": "调试器生成的任务。"
                }
                ],
                "version": "2.0.0"
            }
            ```


    4. 在`sourcecode`文件夹写源代码即可


## markdown preview enhanced
- 打印背景（让代码块背景为灰色） [教程](https://blog.csdn.net/RP123123123/article/details/118113026)

## vscode
ctrl+k arrowKey 调整窗口位置，配合 ctrl+\
## VIM

edit keys

- visio block后进入insert **Shift-i**
- undo all the changes on a line, **type U**
- replace steadily **R**
- changes to the end **C / D**
- put before the cursor **P**
- delete the char under cursor and enter insert mode **s**, and **S or CC** is the whole line 
- search the word under cursor forward/backward **\* #** and can use **4\*** to use number

move keys

- move to the beginning of sentence/paragraph/block **( { [in normal**

file keys

- show where you are in a file **<C-g>**
- jump to file under cursor **<C-]>** 
- retrieves disk file FILENAME and puts it below the cursor position **:r FILENAME** 

buffer and windows

- list all open buffers **ls**
- switch to a specific buffer **:b N**
- change buffer **bn/bp or :buffer (press tab)** buffer next/previous
- toggles between the last two files you edited **<C-^>**.  press ctrl and 6 or ctrl shift 6

[vim和系统剪贴板交互](https://www.zhihu.com/question/19863631/answer/89354508)

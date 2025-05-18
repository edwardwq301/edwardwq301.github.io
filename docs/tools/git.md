---
title: git使用
date: 2023-2-7
tag: 
    - tools 
categories: 
    - backend
---

## 代理

```
git config --global --list | grep proxy

# 设置代理
git config --global http.proxy "http://127.0.0.1:7890"
git config --global https.proxy "https://127.0.0.1:7890"

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 推荐

`tig` git的tui，在不用vscode的图形界面也不错，按h就有够用的帮助文档。

[玩游戏学git](https://learngitbranching.js.org/?locale=zh_CN)

[git命令小贴士](https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/)

[gitignore文档](https://github.com/github/gitignore)

精通Git（第2版）Soctt Chacon    Ben Straub

[linux命令](https://wangchujiang.com/linux-command/c/tree.html)

[revert vs amend](https://stackoverflow.com/questions/28166547/what-are-the-differences-between-revert-amend-rollback-and-undo-a-com)

[git20year](https://github.blog/open-source/git/git-turns-20-a-qa-with-linus-torvalds/)

## gcm
git credential manager多用户：查了文档之后，排除了.gitconfig 文件，最后是在 控制面板—-用户账户—Windows管理凭据里删除了多余的账号 [参考](https://cloud.tencent.com/developer/article/2055131)

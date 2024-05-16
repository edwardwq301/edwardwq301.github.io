---
title : "GitHub部署"
date : 2022-01-01
draft : false
taxonomies:
   categories:
       - "tech"
   tags:
       - "GitHub"
extra:
   lang : "zh"
   toc : false
   comment : true
   copy : true
   math : false
   mermaid : false
   outdate_alert : false
   outdate_alert_days : 120
   display_tags : true
   truncate_summary : false # 摘要
   featured : false
---

官方提供的 ci 代码中提到设置 Personal access token， 然后生成后添加到 仓库->setting->secrets and variables->actions->repository secrets，这个时候我起的名字叫 forzola

结果发现还是不能正常运行，在 Set the GITHUB_TOKEN or TOKEN env variables 报错。最后发现是 ci 文件里指定的 TOKEN 就叫 TOKEN 这个名字，也就是要把刚才在 repository secrets 设置的名称 forzola 改成 TOKEN，或者把 ci 文件改成 forzola 

```yml
# On every push this script is executed
on: push
name: Build and deploy GH Pages
jobs:
  build:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: checkout
        uses: actions/checkout@v4
      - name: build_and_deploy
        uses: shalzz/zola-deploy-action@v0.17.2
        env:
          # Target branch
          PAGES_BRANCH: gh-pages
          # Provide personal access token
          TOKEN: ${{ secrets.TOKEN }} // 注意这个 TOKEN
```

# Linux
## Clash
### 云服务器安装
25年3月买的99一年的阿里云服务器，不知道为什么访问 GitHub 失败，在23年还能正常用的。使用 [mihomo](https://github.com/MetaCubeX/mihomo) 进行代理。

以下内容为 2025-3-31 日有效

安装

1. [下载对应的包](https://github.com/MetaCubeX/mihomo)，我的是Debian机器，用的 `mihomo-linux-amd64-v1.19.3.deb`
2. 安装包：`sudo apt install ./mihomo.deb` 不能少了 `./` ，要不然不知道是本地包
。默认安装到了 `/user/bin/mihomo` 配置在 `/etc/mihomo`，不知道在那就 `whereis`
3. 能命令行运行 `mihomo`再继续

配置

1. 把配置文件放到 `/etc/mihomo/config.yaml`，我用的本地 `clash for windows 0.20.39` 配置，点击首页的 cpu 图标就是最后提交的配置。
2. 下载[GeoLite2-Country.mmdb](https://github.com/Loyalsoldier/geoip)，启动mihomo时会下载，但是往往下载失败。手动下载后命名为 `Country.mmdb` 放在 `/etc/mihomo/` 文件夹下
3. 创建service来自动化，`sudo vim /etc/systemd/system/mihomo.service`

```
[Unit]
Description=mihomo Daemon, Another Clash Kernel.
After=network.target NetworkManager.service systemd-networkd.service iwd.service

[Service]
Type=simple
LimitNPROC=500
LimitNOFILE=1000000
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH
Restart=always
ExecStartPre=/usr/bin/sleep 1s
# 注意下边软件地址和配置文件地址，用别的也行
ExecStart=/usr/bin/mihomo -d /etc/mihomo
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

4. 重启服务

```
sudo systemctl daemon-reload
sudo systemctl enable mihomo
sudo systemctl start mihomo
sudo systemctl status mihomo
```

5. **必要的一步** ：如果想在 Linux 中让​命令行工具（如 curl、wget、git、apt 等）走代理，通常需要在 ~/.bashrc（或 ~/.zshrc）中设置 http_proxy 和 https_proxy 环境变量。**其实也能git自己走代理**。总之我让所有的都走代理了。

```
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"
export all_proxy="socks5://127.0.0.1:7890"
export no_proxy="localhost,127.*,10.*,172.16.*,172.17.*,172.18.*,172.19.*,172.20.*,172.21.*,172.22.*,172.23.*,172.24.*,172.25.*,172.26.*,172.27.*,172.28.*,172.29.*,172.30.*,172.31.*,192.168.*"
```


web页面

1. 安装 `metacubexd`
2. mihomo 配置文件里加上 `external-controller: 127.0.0.1:9091 external-ui: your-ui-location`
3. `sudo systemctl restart mihomo`
4. `http://127.0.0.1:9091/ui`

定时配置：我这个就没必要了，所以没配（`0 4 * * * curl -L -o /etc/mihomo/config.yaml -A "clash" SUB_URL; systemctl reload mihomo` 不明白可以问ai）

其实主要就是[照着抄人家的](https://nanodesu.net/archives/47/)，补充了还要 bash 配置

### Mixin模式
值得注意的点是使用 `...` 合并对象，可以理解成先把前者原封不动写上去，后者有相同键就用后者的值覆盖前者键（同一个键），多出来的其它键值就合并了。因此合并顺序也有关系。

```js
// content: yaml 格式化后的 JavaScript 对象
// name: 配置文件文件名
// url: 配置文件下载地址
// notify: 发出系统通知方法，签名为function notify(title:string, message:string, silent:bool)
module.exports.parse = async ({ content, name, url }, { axios, yaml, notify }) => {
  const origin_dns_fallback = content["dns"]["fallback"];
  content["dns"]["fallback"] = ["https://doh.pub/dns-query", "https://dns.alidns.com/dns-query", ...origin_dns_fallback];

  const extra_prepend_rule = [
    "DOMAIN-SUFFIX, dogfight360.com, DIRECT",
    "DOMAIN, support.microsoft.com, DIRECT",
    "DOMAIN, cn.vuejs.org, DIRECT",
  ];

  return {
    ...content,
    rules: [...extra_prepend_rule, ...content.rules],
  };
  // 另一种方法
  // content.rules.unshift("DOMAIN, cn.vuejs.org, DIRECT");
  // return content;
};

```

## Others
### 管道重定向
`some failed command > failed.txt 2>&1` 这个是把错误重定向到 `failed.txt`，为什么不能 `some failed command 2>&1 > failed.txt`，我的理解如下

正确的做法为什么行

```txt
1 ----> screen
1 ----> txt
2 的内容流向 1 所指的位置，也就是 txt
```

为什么后者不行

```txt
2 的内容流向 1 所指的位置，也就是 screen
1 ----> txt 此时只改变 1 的内容流向位置，不会改变 2 的
```

还可以写成 `some failed command &> failed.txt` 或者 `some failed command &>> failed.txt`，[后者在 bash4 开始可以](https://stackoverflow.com/a/876267/24175021)

### 同步异步
同步（拷贝）IO：假如是同步的 read，直到读完（内核空间拷到用户空间） read 才返回，

异步（拷贝）IO：read 直接返回，真正拷贝完会使用回调函数通知用户

eg： 烧水同步，一直看水开了再干别的；烧水异步，水开了会响铃，告诉我开了

[参考](https://www.cyhone.com/articles/reunderstanding-of-non-blocking-io/)

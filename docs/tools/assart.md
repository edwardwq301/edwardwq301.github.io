# 新机开荒

## 创建用户

创建用户并附加 wheel 组，fedora 的 wheel 组默认有 sudo 权限

```bash
sudo useradd --create-home -G wheel bob
sudo passwd bob
```

`adduser` is more convenient than `useradd`. 发现 fedora41 把 `adduser` 链接到 `useradd` 了，debian 就没有。

## 上传 SSH 密钥

假设用户是 `bob`

part1：本地生成并上传密钥

```bash
ssh-keygen -t rsa
# this uses the default location ~/.ssh/id_rsa.pub
ssh-copy-id bob@server_ip
# or use a specific public_key
# ssh-copy-id -i path/public_key user@server_ip
```

part2：确保密钥登录权限打开，大部分都是 `/etc/ssh/sshd_config`（不确定可以用 `locate sshd_config` 找一下）

```ini
PubkeyAuthentication yes
PasswordAuthentication yes
# if you want to allow password authentication
```

part3：重启 ssh 服务 `sudo systemctl restart ssh`

另外我发现还有些注意事项

- `authorized_keys` 要能被 bob 自己读
- `/home/bob` 别人不能有写的权限，就是 user group other 中的 other 不能有 w 权限

出错了还可以翻日志

Ubuntu, Debian:

- SSH server logs: `/var/log/auth.log`
- SSH client logs: `/var/log/syslog`

eg: `Mar 17 14:06:36 ub sshd[15869]: Authentication refused: bad ownership or modes for directory /home/bob`

## 安装开发工具

git、fish

```bash
sudo dnf install -y git fish
chsh -s $(which fish)
```

---

[clash](./linux#clash)

---

### neovim

```bash
# install
curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz
sudo rm -rf /opt/nvim
sudo tar -C /opt -xzf nvim-linux-x86_64.tar.gz

# set path
echo 'export PATH="$PATH:/opt/nvim-linux-x86_64/bin"' >> ~/.bashrc
# run in fish shell manually
set -Ua fish_user_paths /opt/nvim-linux-x86_64/bin

# config
git clone https://github.com/edwardwq301/kicknvim.git "${XDG_CONFIG_HOME:-$HOME/.config}"/nvim
```

## 换源

chsrc

```bash
curl https://chsrc.run/posix | sudo bash
# chsrc ls  ruby
# chsrc set ruby rubychina
```

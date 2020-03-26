Hyper-V の NAT をこねくり回そうとしたけれども、うまくいかなかった。`netsh` コマンドを使うことで、簡単にポート変換ができる。

## Workaround

[Issue #4150 microsoft/WSL | GitHub](https://github.com/microsoft/WSL/issues/4150#issuecomment-504209723)

```
# PowerShell (Administrator)

> netsh interface portproxy add v4tov4 \
    listenport=<External Port> \
    listenaddress=<External Address> \
    connectport=<Internal Port> \
    connectaddress=<Internal Address>
```

### connectaddress

WSL2 に割り当てられた内部 IP を指定する必要がある。WSL2 内で

```
# bash (WSL2)

$ ifconfig eth0 | grep inet
```

を叩くと取得できる。


## Netsh interface portproxy

[Netsh interface portproxy コマンド | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows-server/networking/technologies/netsh/netsh-interface-portproxy)

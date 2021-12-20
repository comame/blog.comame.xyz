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

WSL 2 に割り当てられた内部 IP を指定する必要がある。WSL 2 内で

```
# bash (WSL 2)

$ ifconfig eth0 | grep inet
```

を叩くと取得できる。


## netsh interface portproxy

[Netsh interface portproxy コマンド | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows-server/networking/technologies/netsh/netsh-interface-portproxy)

## サンプルスクリプト

```
$port = Read-Host 'Port'
$internal_ip = bash.exe -c "ip addr show eth0 | sed -nEe 's/^[ \t]*inet[ \t]*([0-9.]+)\/.*$/\1/p'"

netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$port connectaddress=$internal_ip connectport=$port
```

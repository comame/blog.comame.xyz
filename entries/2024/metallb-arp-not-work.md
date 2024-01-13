MetalLB が ARP 応答を返してくれなくなったことにより、自宅サーバで動かしているすべてのサービスに一切接続できない状況になっていた。

ロードバランサによって IP アドレスは割り振られるが、通信はできないという状況になるため、サーバへの通信が一切通らなくなってしまっていた。

## 原因

直接的な原因は L2Advertisements を設定していなかったこと。
背景としては、MetalLB の設定方法を CRD を使うように変えたときに、きちんとドキュメントを見なかったこと。

## 作業ログ

L2 (ARP) で経路を設定している。
Service に IP アドレスは割り振られているので、speaker が仕事をしていないのだろうと推測。普段使いしている Windows マシンから `Get-NetNeighbor` したところ、案の定経路がわからない状態になっていた。

<https://metallb.universe.tf/troubleshooting/#general-concepts-1> に従って `kubectl describe svc <svc>` をしてみると、イベントがない状態だった。
speaker が公告しない条件は以下であった。

- Service に有効な Endpoint がない
- Service が `externalTrafficPolicy=local` であり、speaker の Node で Endpoint がない
- L2Advertisements が speakers の Node にない
- Kubernetes API が 'network not available' と言っている

上から順に確かめると、IPAddressPool は存在するが、L2Advertisements を設定していないことに気が付いた。

<https://metallb.universe.tf/configuration/_advanced_l2_configuration/> を見ながら L2Advertisements を設定したところ、治った。

[設定ファイルの変更履歴](https://github.com/comame/kubernetes-manifests/commit/1a8a8d503fe918d378b8939028538a30af5155a6#diff-835cacfccf39c08c0a6a286a16abc4b64583a196d5b84c7ce96a6b742d5d6120) を見ると、ConfigMap から CRD に変更するときに、L2Advertisements を作成せず、IPAddressPool だけ作成していることが分かった。

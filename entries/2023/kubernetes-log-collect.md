Kubernetes で動かしているアプリケーションのログを収集するものを DaemonSet で動かすようにした。今までは温かみのある手作業でノードにセットアップしていたので、大幅に改善された。

## 環境

- kubeadm でセットアップしたクラスタ
- コンテナランタイムは Containerd

## ログを取得する

ログは `/var/log/containers/xxx.log` に吐き出されるので、`tail` などで内容を取ればよい。

## DaemonSet で配置する

各ノードで 1 つずつ実行されてほしいので、DaemonSet で配置する。

```yml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log
spec:
  selector:
    matchLables:
      name: log
  template:
    metadata:
      labels:
        name: log
    spec:
    containers:
    - name: log
      image: xxx
      securityContext:
        runAsUser: 0 # /var/log/containers へのアクセスが必要なため
      volumeMounts:
      - mountPath: /var/log/containers
        name: containers
      - mountPath: /var/log/pods
        name: pods
    volumes:
    - name: containers
      hostPath:
        path: /var/log/containers
        type: Directory
    - name: pods
      hostPath:
        path: /var/log/pods
        type: Directory
```

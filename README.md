# blog.comame.xyz
- [blog.comame.xyz](https://blog.comame.xyz)
- build/ にビルド済み静的ファイルが置いてある

## インストール
```
$ cd project-dir
$ docker run -v $(pwd):/files -p 8080:80 comameito/index-server
$ mkdir build
$ node build.js
```

## 画像
今のところノープラン。Google Photos からでも配信するか？

## ビルド
Puppeteer を使って、ページ生成用の JavaScript を消した。

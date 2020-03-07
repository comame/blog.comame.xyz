# blog.comame.xyz
- [blog.comame.xyz](https://blog.comame.xyz)
- build/ にビルド済み静的ファイルが置いてある

## インストール
```
$ cd project-dir
$ docker run -v $(pwd):/files -p 8080:80 comameito/index-server
$ mkdir build
$ BLOG_HOST=http://localhost:8080 OVERWRITE=1 node build.js
```

## ビルド
- assets/ 内のファイルはそのままコピー
- Puppeteer を使って、ページ生成用の JavaScript を消す。

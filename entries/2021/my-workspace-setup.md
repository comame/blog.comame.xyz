めも

## Windows

### インストールするアプリケーション

- CubePDF Utility
- foobar2000
- GIMP
- Google Chrome
- Google Drive
- iTunes
- Microsoft Visual Studio Code
- Mozilla Firefox
- OBS Studio
- PowerToys
- VLC media player
- Windows Terminal

### やること

- [WSL をセットアップする](/entries/2020-12-19/import-wsl)
- [各種設定ファイルを入れる](https://comame.xyz/dotfiles/)
- [スリープ設定をいじる](/entries/2021-01-18/windows-lockscreen-registry)
- 高速スタートアップをオフにする
- 電源ボタンを押したとき、休止状態にする
- ローカルグループポリシーエディター (gpedit.msc) で Aero Shake を無効にする (ユーザーの構成 > 管理用テンプレート > デスクトップ)
- [WSL2 のポートを公開できるようにする](/entries/2020-03-26/wsl2-publish-server)
- 適当にエクスプローラーの設定をする

## Chromebook

### 日本語入力を有効にする

1. `$ apt install fcitx-mozc`
1. `$ echo '/usr/bin/fcitx-autostart | exit 0' | cat >> .sommelierrc`
1. コンテナを再起動
1. `$ /usr/bin/fcitx-configtool`

1. `$ apt install uim-fep uim-mozc`
1. 後述の設定ファイルを `$HOME/.uim` に記述する
1. `$ uim-fep`

```
(define default-im-name 'mozc)
(define-key generic-on-key? '("<Control> "))
(define-key generic-off-key? '("<Control> "))
```

### SSH がつながらないとき、MTU を変更する

`$ ip link set eth0 mtu <mtu>`

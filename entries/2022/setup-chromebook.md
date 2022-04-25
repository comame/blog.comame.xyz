Crostini を入れて使えるようになるまで

100.0.4896.133 時点

## Chrome OS の設定

### 画面ロックの設定

- PIN を設定する
- Smart Lock を設定する (「デバイスのロック解除のみ」)

### 日本語入力の設定

- 辞書とかスペースとか

### ネットワークの設定

- Wi-Fi
- VPN

## Crostini の設定

### Crostini を有効にする

- 設定アプリから

### 日本語入力をできるようにする

```
$ sudo apt install fcitx fcitx-mozc

# 自動起動
$ echo "/usr/bin/fcitx-autostart" >> ~/.sommelierrc

# IME 切り替えキーの設定 / Mozc の選択
$ fcitx-configtool

# 辞書とかスペースとかの設定
$ /usr/lib/mozc/mozc_tool --mode=config_dialog
```

fcitx-configtool で Mozc を追加するとき、`Only show current language` のチェックに注意


### konsole のインストール

日本語入力とクリップボードがどちらも動いたので、konsole にした。Terminator も問題なく動作しそうなので、好みで選ぶ。

gnome-terminal は日本語入力が正しく動かず、xterm は起動が速くて好みだったがクリップボードが動作せず。

```
$ sudo apt install konsole
```

### MTU の設定 (VPN 接続時)

Chrome OS 側で VPN を設定していると、Crostini からネットワークにつながったり繋がらなくなったりする。必要に応じて MTU を小さくする。

```
$ echo "ip link eth0 set mtu <MTU>" >> ~/.sommelierrc
```

## 普段使ってるアプリケーションを入れる

- VSCode
- LibreOffice (なんだかんだあると便利)

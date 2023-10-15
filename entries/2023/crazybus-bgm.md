ベネズエラの有名なゲーム [CRAZYBUS](https://dic.pixiv.net/a/CRAZYBUS) の BGM を流す Web アプリを作った。Web Audio API を使っている。

<https://comame.xyz/crazybuz>

## やり方

ソースコードは [GitHub](https://github.com/comame/CRAZYBUZ/blob/main/app.js) にある。

### 十二平均律の周波数を求める

十二平均律では、半音の周波数比がすべて同じであり、1 オクターブで周波数が 2 倍になることから、半音の周波数比は

\begin{eqnarray}
    r = 2^{\frac{1}{12}}
\end{eqnarray}

となる。音程の基準を \\( 440 \ \mathrm{Hz} \\) として、上下 2 オクターブずつ周波数を算出する。

### `OscillatorNode` で矩形波を生成する

```
const context = new AudioContext()
const oscillator = context.createOscillator()
oscillator.type = 'square'
oscillator.frequency.value = 440
```

のようにして矩形波を作成できる。

### CRAZYBUS の BGM を作る

CRAZYBUS の BGM は、音程をランダムに 2 つ選び、BPM 360 で音程を変えながら混ぜればよい。

## ちなみに

バスの走行音は A2、クラクションの音は G5 らしい。

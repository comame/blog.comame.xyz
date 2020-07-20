JavaScript で TOTP を実装してみたので、その実装メモなど。

https://github.com/comame/TOTP

## TOTP

RFC 6238: TOTP: Time-Based One-Time Password Algorithm で規定される。Google Authenticator アプリなどを使って時刻ベースで生成される (大抵) 6 桁のワンタイムパスワードであり、2 要素認証に用いられる。

疑似コードで次のように表される。

```
K: 共有シークレット、QR コードとかで読み込むやつ
X: ステップ秒。大抵 30 秒。この値の周期でトークンが切り替わる
T0: Unix Time の開始秒。大抵 0

T = (Current Unix Time - T0) / X) as Integer

TOTP(K, T) = HOTP(K, T) = Truncate(HMAC-SHA-1(K, T))
```

トークンの生成アルゴリズムには HOTP を使用する。

のちに記述するように、HOTP では T の値が 32-bit までしかサポートされていないため、4.2 節では 32-bit より大きい整数をサポートするように規定されている。具体的にどう実装するのかは記述されていないので、Google Authenticator の実装などを見るのが良いと思われる。

## HOTP

RFC 4226: HOTP: An HMAC-Based One-Time Password Algorithm で規定される。カウンターベースのワンタイムパスワード。

```
K: 共有シークレット
C: カウンター。8-byte の整数
HS: 20-byte
S: 31-bit
D: 桁数が Digit の HOTP トークン

DT(HS: bytes[20])
    OffsetBits = HS[19] & 0xF // HS[19] の下位 4-bit
    Offset = OffsetBits as Integer // 0 <= offset<= 15
    P = HS[Offset]...HS[Offset + 3]
    return P & 0x7FFFFFFF // 下位 31-bit

HS = HMAC-SHA-1(K, C)
S = DT(HS)
D = (S as Integer) mod 10^Digit
```

RFC の 5.4 節の例は次の通りである。

```
HS = {
    1F, 86, 98, 69, 0E,
    02, CA, 16, 61, 85,
    50, EF, 7F, 19, DA,
    8E, 94, 5B, 55, 5A
}

OffsetBits = 0xA
Offset = 10
P = 0x50EF7F19

S = 0x50EF7F19 & 0x7FFFFFFF = 0x50EF7F19
D = 872921
```

## HMAC

https://www.ipa.go.jp/security/rfc/RFC2104JA.html に日本語での解説がある。

```
H: ハッシュ関数
K: シークレット
M: メッセージ

ipad = 0x3636...
opad = 0x5C5C...
// ipad, opad の長さはハッシュ関数のブロック長 (SHA-1 の場合 512-bit) と同一

||: ビットの連結

HMAC(K, M) = H((K xor opad) || H((K xor ipad) || M))
```

K と opad, ipad とで排他的論理和をとっていることから分かるように、K の長さもハッシュ関数のブロック長と同一にする必要がある。K は入力値であることから、長さを揃えるために次のような処理を順に行う。

K の長さがブロック長より大きい場合、K をハッシュ関数に通す。K の長さがブロック長より小さい場合、ブロック長と同一になるまで末尾に 0 を追加する。


## 実装で苦しんだところ (大体うっかり)

### HOTP

C は 8-byte 整数。

### HMAC

ハッシュ関数に SHA-1 を使用する場合、ブロック長は 64-byte、出力長は 20-byte であることから、K にハッシュを通した後に 0 を追加する処理を行う必要がある。

### SHA-1

左循環シフト。`(n: number, x: number) => (x << n) | (x >> (32 - n))` と素直に書くと、x は 32-bit 整数、`0 <= n < 32` であることからオーバーフローする。


## 参考にしたもの

<dl>
    <dt>IPA の RFC 日本語訳</dt>
    <dd>HMAC と SHA-1 の実装</dd>
    <dt>Golang のソースコード</dt>
    <dd>テストケースや各アルゴリズムの実装。読みやすい。</dd>
    <dt>RFC</dt>
    <dd>テスト用のサンプルケースが Appendix に書いてあることを初めて知った</dd>
</dl>

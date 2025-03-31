# これはなに？

スプラトゥーンの武器をランダムで選出してくれるツールです。
遊ぶプレイヤーの数に応じて武器の選出ロジックが変化します。

# 使い方

.env.example を基にして .env ファイルをプロジェクトルートに作成します。

`PLAYER_NAME_1` 〜 `PLAYER_NAME_4` に遊ぶプレイヤーの名前を記載します。
遊ぶプレイヤーの分だけ記載してください。例えば3人で遊ぶ場合は `PLAYER_NAME_4` の値は空白でOKです。

`REPORT_TYPE` に通知の送信先になるアプリを記載してください。<br>
※ 現状Discordのみです。

`REPORT_URL` に通知に必要になるURLを登録してください。<br>
例えばDiscordであれば、通知を送信するサーバーのWebhook URLです。

あとは以下を実行してください。

```
# 初回のみ
npm ci

# 選出ロジック実行
npm run battle
```

指定したURLのアプリに通知が飛びます。

# 選出ロジック

編成事故が発生しにくいロジックを考えています。

### 1人

全ての武器の中からランダムで1つ選択します。

### 2人

短射程が1人、もう1人は中射程か長射程になります。
どちらか1人は塗り武器、もう1人はバランス型、キル型、ヘイト型の武器のいずれかになります。

### 3人

短射程、中射程、長射程が1人ずつになります。
1人は塗り武器、残りの2人はバランス型、キル型、ヘイト型の武器のいずれかになります。

シューター以外の武器カテゴリが被ることはありません。
例えばブラスター2人や、スピナー3人などの編成にはなりません。

### 4人

短射程、中射程、長射程が1人ずつ、残りの1人は短射程か中射程のいずれかになります。
役割が被ることがあります。例えばチーム内にキルの役割を持つ武器が2つ選出される可能性があります。

シューター以外の武器カテゴリが被ることはありません。
例えばブラスター2人や、スピナー3人などの編成にはなりません。

同じ武器種は選出されません。
例えばスプラシューターとスプラシューターコラボは同時選出されません。

ヘイト型の武器が2人以上選出されることはありません。
例えばパブロとキャンピングシェルターは同時選出されません。
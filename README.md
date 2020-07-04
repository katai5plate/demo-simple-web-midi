# demo-simple-web-midi

以下の情報はツクールフォーラムへ向けた知見共有です。

MIDI を再生できるプラグインを作ろうと色々調べてみて、これはちょっとハードルが高すぎるなと感じたので技術だけ共有します。  
誰かこの技術を引き継いで MIDI 再生プラグイン作りに挑戦してみて頂けると嬉しいな。

ソースコードは MIT ライセンスの下で自由に使ってください。  
わからないことはフォーラムで聞いてね。

もしかしたらバグがあるかも。

## 動作デモ

GitHub に WEB 上でとりあえず MIDI を再生できる所まで作ったソースコードと動作デモを置いています。  
ソースコードを読むには Node.js と TypeScript の知識が必要です。

- [動作デモページ](https://katai5plate.github.io/demo-simple-web-midi/)
- [ソースコード](https://github.com/katai5plate/demo-simple-web-midi)

### 個人的に思う事

動作デモページを試してもらえたら分かると思うんですが、同時発音数が多くなると再生がものすごく重くなります。  
だからこれでも結構最適化しないと、使い物にならないかもしれないですね・・・

### 動作デモの仕様

- MIDI
  - 対応フォーマット: Format 0
  - 認識するイベント:
    - Note on
    - Note off
    - Pitch Bend
  - ベロシティ機能なし
- シンセサイザー
  - オシレーター:
    - sine
    - triangle
    - square
    - sawtooth
  - エンベロープ機能:
    - Volume: 0 ～ 1 推奨
    - Attack: 秒数
    - Decay: 秒数
    - Sustain: 0 ～ 1
    - Release: 秒数
- プレイヤー
  - 再生可能チャンネル: 1 ～ 4
  - ドラムチャンネル: なし
  - テンポの認識: 初期設定のみ

## ツクール MV 上で MIDI を再生するメリット/デメリット

### メリット

- 音楽の容量をかなり削減できる。
- 2000 時代の素材を使えるかもしれない。

### デメリット

- **動作がめちゃくそ重い。**
- MIDI 音源を実装するハードルが高い。

ツクール MV は WEB ベースなので、MIDI を再生するためにはそのためのプレイヤーを実装する必要があります。  
音符が再生されるたびにオブジェクトが生成されるため、音数が多ければ多いほどメモリや遅延の問題が大きくなる気がします。

## MIDI 再生の処理フロー

WEB 上で MIDI を再生するには、以下のような処理を書いていく必要があります。

### 1. MIDI ファイルをバッファ配列で読み込む

まずデータを読み込みます。動作デモでは以下のようにして読み込んでいます。

```js
(async () => {
  const filebuf = new Uint8Array(
    await (await fetch("./midi/multi.mid")).arrayBuffer()
  );
  console.log(filebuf);
})();
```

### 2. MIDI のバイナリデータを JSON に変換する

読み込んだデータはバイナリデータなので、JavaScript で扱いやすいように JSON 形式に変換してやる必要があります。  
この動作デモでは、[midi-file](https://www.npmjs.com/package/midi-file) を使用しました。

これにより、以下のようにすることで JSON ファイルに変換できます。

```js
import { parseMidi } from "midi-file";

(async () => {
  const filebuf = new Uint8Array(
    await (await fetch("./midi/multi.mid")).arrayBuffer()
  );
  const midi = parseMidi(fileBuf);
  console.log(midi);
})();
```

### 3. MIDI イベントに合わせて、シンセサイザーに演奏させる

現在のブラウザには、MIDI ファイルを直接再生できる機構がないので、音源を自分で実装する必要があります。  
また、ピッチやビブラートなどのパラメータによって音をどのように変化させるかといった仕組みも作る必要が出てきます。

今回の動作デモでは、Web Audio API で動作するシンセサイザーを作ることにしました。

## 簡素なシンセサイザー

このデモで作られたシンセサイザーは、以下のクラスで構成されています。

- Player: 音楽再生。
  - Channel: チャンネルの設定。
    - Note: 音符管理。使い捨て。
      - Oscillator: 音色管理。
      - Envelope: 発声管理。

Player に MIDI の音楽情報と、それぞれのチャンネルの音色情報を与えられると、音楽の再生処理に入ります。  
再生処理が始まると、MIDI のイベント情報が順次読み込まれ、音符を作るイベントが発生する度に Note が作られます。  
作られた Note は Channel 内のステートで管理され、一度音符として使われた Note は役目を終えたらすぐに削除されます。
Note 内部では、Oscillator と Envelope が定義され、親クラスから指定されたパラメータに応じて値を変化させます。

この辺りは結構説明が面倒なので、詳しくはソースコードを読んでください。  
とりあえず以下の順に読んでいけばいいと思います。

- index.html
- src/index.ts
- src/Player.ts
- src/Channel.ts
- src/Note.ts
- src/Oscillator.ts
- src/Envelope.ts

## これをベースに開発したい人向け

### プロジェクトの使い方

- 必要なもの:
  - Git
  - Node.js
  - yarn

1. ターミナルやコマンドプロンプトを開く
2. `git clone https://github.com/katai5plate/demo-simple-web-midi` する
3. `cd demo-simple-web-midi` する
4. `yarn` する

ローカルサーバーを実行して、watch モードで開発を開始するなら `yarn dev` してください。  
ビルドされた JS は ./dist に保存されます。

### 最適化にまつわる噂

- 今回のデモでは MIDI イベントの実行に setInterval を使用していますが、Web Audio API の機能のみを使ってここの機構を実装すれば、もっと高速になるかもしれないです。
  - 参考記事: https://www.html5rocks.com/en/tutorials/audio/scheduling/#toc-usingsettimeout

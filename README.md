# 【開発者向け知見共有】MIDI の再生に関する知見

MIDIを再生できるプラグインを作ろうと色々調べてみて、これはちょっとハードルが高すぎるなと感じたので技術だけ共有します。  
誰かこの技術を引き継いで MIDI 再生プラグイン作りに挑戦してみて頂けると嬉しいな。

## 動作デモ

GitHub に WEB 上でとりあえず MIDI を再生できる所まで作ったソースコードと動作デモを置いています。  
ソースコードを読むには Node.js と TypeScript の知識が必要です。

- 動作デモページ
- [ソースコード](https://github.com/katai5plate/demo-simple-web-midi)

### 動作デモの仕様

- MIDI
  - 対応フォーマット: Format 0
  - 認識するイベント:
    - Note on
    - Note off
    - Pitch Bend
- シンセサイザー
  - オシレーター: ノコギリ波のみ
  - エンベロープ機能: なし。常に Sustain 。
- プレイヤー
  - 再生可能チャンネル: 1 ～ 16
  - ドラムチャンネル: なし
  - テンポの認識: 初期設定のみ

## ツクール MV 上で MIDI を再生するメリット/デメリット

### メリット
- 音楽の容量をかなり削減できる。
- 2000 時代の素材を使える
### デメリット
- 重い
- MIDI 音源を実装するハードルが高い

ツクール MV は WEB ベースなので、MIDI を再生するためにはそのためのプレイヤーを実装する必要があります。  
音符が再生されるたびにオブジェクトが生成されるため、音数が多ければ多いほどメモリや遅延の問題が大きくなる気がします。

## MIDI 再生の処理フロー

### 1. MIDI ファイルをバッファ配列で読み込む

まずデータを読み込みます。動作デモでは以下のようにして読み込んでいます。

```js
(async () => {
  const filebuf = new Uint8Array(
    await (await fetch("./midi/multi.mid")).arrayBuffer()
  );
  console.log(filebuf);
})()
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
})()
```

### 3. MIDI イベントに合わせて、シンセサイザーに演奏させる

現在のブラウザには、MIDI ファイルを直接再生できる機構がないので、音源を自分で実装する必要があります。  
また、ピッチやビブラートなどのパラメータによって音をどのように変化させるかといった仕組みも作る必要が出てきます。

今回の動作デモでは、Web Audio API で動作するシンセサイザーを作ることにしました。

## 簡素なシンセサイザーを作るには



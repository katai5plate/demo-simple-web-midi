import { parseMidi } from "midi-file";
import Player from "./Player";

(async () => {
  /** MIDI ファイルのバイナリ情報 */
  const filebuf = new Uint8Array(
    await (await fetch("./midi/song.mid")).arrayBuffer()
  );

  /** JSON パースされた MIDI ファイル */
  const midi = parseMidi(filebuf);
  console.log("MIDI:", midi);

  // 「MIDI を再生する」ボタンが押されたとき
  (window as any).play = () => {
    document.querySelector("#play").remove();
    // 再生するために必要な情報を入力
    new Player(new AudioContext(), {
      // MIDI のイベントリスト
      track: midi.tracks[0],
      // 分解能
      ticksPerBeat: midi.header.ticksPerBeat,
      // テンポ
      bpm: 140,
      // 各チャンネルの音色設定
      channels: [
        {
          vadsr: [0.5, 0, 0.1, 0.75, 0],
          oscType: "triangle",
        },
        {
          vadsr: [0.5, 0, 0, 0.5, 0],
          oscType: "sawtooth",
        },
        {
          vadsr: [0.5, 0, 0.1, 0.5, 0.5],
          oscType: "sine",
        },
        {
          vadsr: [0.5, 0, 0, 0.5, 0],
          oscType: "square",
        },
      ],
    });
    (window as any).play = null;
  };
})();

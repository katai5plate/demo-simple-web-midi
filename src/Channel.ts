import { VADSR } from "./types";
import Note from "./Note";

export type ChannelParams = {
  vadsr: VADSR;
  panpot?: number;
  oscType?: OscillatorType;
  noteArgs?: any[];
};

/**
 * チャンネルの音符の状態管理
 */
export default class Channel {
  context: AudioContext;
  /** エンベロープ */
  vadsr: VADSR;
  /** 波形タイプ */
  oscType: OscillatorType;
  /** Note を格納する場所 */
  polyState: { [key: number]: Note };
  /** Node に共通して何かを接続したい時に使用する */
  globalSend: GainNode;
  constructor(context: AudioContext, params: ChannelParams) {
    this.context = context;
    this.vadsr = params.vadsr;
    this.oscType = params.oscType || "sine";
    this.polyState = {};
    this.globalSend = new GainNode(this.context);
    this.globalSend.connect(this.context.destination);
  }
  /** Node を作成する */
  startNote(noteNumber: number, pitch: number) {
    this.polyState[noteNumber] = new Note(this.context, {
      noteNumber,
      pitch,
      vadsr: this.vadsr,
      oscType: this.oscType,
    });
    // 出力を globalSend に繋げる
    this.polyState[noteNumber].out.connect(this.globalSend);
    // Note を使い終わったら自動的に cleanNote が走るようにする
    this.polyState[noteNumber].osc.onended = this.cleanNote.bind(
      this,
      noteNumber
    );
  }
  /** すべての Note を取得 */
  getAllNote() {
    return Object.values(this.polyState);
  }
  /** ピッチを変更する */
  setPitch(pitch: number) {
    return this.getAllNote().forEach((x) => x.osc.setPitch(pitch / 8192));
  }
  /** Note の出力を終え、Release 処理へ移行させる */
  stopNote(noteNumber: number) {
    if (this.polyState[noteNumber]) this.polyState[noteNumber].up();
  }
  /** 完全に役目を終えた Note を削除する */
  cleanNote(noteNumber: number) {
    console.log(
      this.polyState[noteNumber].env.getPhase() === -1 ? "clear:" : "keep:",
      noteNumber,
      Object.keys(this.polyState).length
    );
    if (this.polyState[noteNumber].env.getPhase() === -1)
      delete this.polyState[noteNumber];
  }
}

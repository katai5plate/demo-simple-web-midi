/**
 * 音色と音程
 */
export default class Oscillator extends OscillatorNode {
  /** 音階 */
  noteNumber: number;
  /** ピッチ */
  pitch: number;
  constructor(
    context: AudioContext,
    params: {
      noteNumber: number;
      type: OscillatorType;
      pitch: number;
    }
  ) {
    super(context);
    this.noteNumber = params.noteNumber;
    this.type = params.type;
    this.pitch = params.pitch;
    this.setFrequency();
  }
  /** 音階とピッチから周波数を計算する */
  setFrequency() {
    this.frequency.value =
      440 * 2 ** ((this.noteNumber + this.pitch - 69) / 12);
  }
  /** ピッチを変更する */
  setPitch(pitch: number) {
    this.pitch = pitch;
    this.setFrequency();
  }
}

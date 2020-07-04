/**
 * エンベロープ
 */
export default class Envelope extends GainNode {
  /** 最大音量 */
  volume: number;
  /** アタック（音が最大音量まで立ち上がるまでの時間） */
  attack: number;
  /** ディケイ（アタックの後サステインの音量になるまでの時間） */
  decay: number;
  /** サステイン（鍵盤を押している間に維持し続ける音量） */
  sustain: number;
  /** リリース（鍵盤が離された後の音の余韻が残る時間） */
  release: number;
  /** 最初からアタックまでの時間 */
  attackTime: number;
  /** アタックからディケイまでの時間 */
  decayTime: number;
  /** リリースから終わりまでの時間 */
  stopTime: number;
  constructor(context: AudioContext, params: { vadsr: number[] }) {
    super(context);
    [
      this.volume,
      this.attack,
      this.decay,
      this.sustain,
      this.release,
    ] = params.vadsr;
    this.gain.value = 0;
    this.stopTime = NaN;
    this.down();
  }
  /** 今のエンベロープの状態を取得する */
  getPhase() {
    if (this.context.currentTime < this.attackTime) return 0;
    if (this.context.currentTime < this.decayTime) return 1;
    if (Number.isNaN(this.stopTime)) return 2;
    if (this.context.currentTime < this.stopTime) return 3;
    return -1;
  }
  /** 鍵盤を押し始める */
  down() {
    this.attackTime = this.context.currentTime + this.attack;
    this.decayTime = this.attackTime + this.decay;
    this.gain.setValueAtTime(0, this.context.currentTime);
    this.gain.linearRampToValueAtTime(this.volume, this.attackTime);
    this.gain.linearRampToValueAtTime(
      this.volume * this.sustain,
      this.decayTime
    );
  }
  /** 鍵盤を離す */
  up() {
    this.stopTime = this.context.currentTime + this.release;
    this.gain.setValueAtTime(this.gain.value, this.context.currentTime);
    this.gain.linearRampToValueAtTime(0, this.stopTime);
  }
}

import { VADSR } from "./types";
import Oscillator from "./Oscillator";
import Envelope from "./Envelope";

/**
 * 音符
 */
export default class Note {
  context: AudioContext;
  /** 音階 */
  noteNumber: number;
  /** ピッチ */
  pitch: number;
  /** エンベロープ */
  vadsr: VADSR;
  /** 波形タイプ */
  oscType: OscillatorType;

  osc: Oscillator;
  env: Envelope;
  out: GainNode;

  constructor(
    context: AudioContext,
    params: {
      noteNumber: number;
      pitch: number;
      vadsr: VADSR;
      oscType: OscillatorType;
    }
  ) {
    this.context = context;
    this.noteNumber = params.noteNumber;
    this.pitch = params.pitch;
    this.vadsr = params.vadsr;
    this.oscType = params.oscType;
    this.out = new GainNode(this.context);
    this.connection();
    this.down();
  }
  connection() {
    this.osc = new Oscillator(this.context, {
      noteNumber: this.noteNumber,
      type: this.oscType,
      pitch: this.pitch,
    });
    this.env = new Envelope(this.context, {
      vadsr: this.vadsr,
    });

    this.osc.connect(this.env).connect(this.out);
  }
  down() {
    this.env.down();
    this.osc.start();
  }
  up() {
    this.env.up();
    this.osc.stop(this.env.stopTime);
  }
}

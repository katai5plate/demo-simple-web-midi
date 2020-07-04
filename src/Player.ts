import Channel, { ChannelParams } from "./Channel";
import { MIDITrackEvent } from "midi-file";

/**
 * 再生プレイヤー
 */
export default class Player {
  context: AudioContext;
  /** チャンネル情報 */
  channels: Channel[];
  /** イベントリスト */
  track: MIDITrackEvent[];
  /** 実際に実行するイベントリスト */
  interpreters: (() => Promise<MIDITrackEvent>)[];
  /** 分解能 */
  ticksPerBeat: number;
  /** テンポ */
  bpm: number;
  constructor(
    context: AudioContext,
    params: {
      track: MIDITrackEvent[];
      channels: ChannelParams[];
      ticksPerBeat: number;
      bpm: number;
    }
  ) {
    this.context = context;
    this.track = params.track;
    this.channels = params.channels.map(
      (channelParams) => new Channel(this.context, channelParams)
    );
    this.ticksPerBeat = params.ticksPerBeat;
    this.bpm = params.bpm;
    this.generateInterpreters();
    this.readInterpreters();
  }
  /** イベントリストの音符のタイミング時間を BPM と合わせる */
  generateInterpreters() {
    this.interpreters = this.track.map((event) => () =>
      new Promise<MIDITrackEvent>((r) =>
        setTimeout(
          () => r(event),
          (event.deltaTime / this.ticksPerBeat) * (60000 / this.bpm)
        )
      )
    );
  }
  /** イベントリストを再生する */
  async readInterpreters() {
    await Promise.all(
      this.channels.map(async (channel, currentChannelId) => {
        for await (let elm of this.interpreters.slice(1)) {
          const event = await elm();
          console.log(event);
          if (event.channel === currentChannelId) {
            if (event.type === "noteOn") channel.startNote(event.noteNumber, 0);
            if (event.type === "noteOff") channel.stopNote(event.noteNumber);
            if (event.type === "pitchBend") channel.setPitch(event.value);
          }
        }
      })
    );
  }
}

import { playSynthTone } from "./connectAudioSynth";

export class RingtoneLoopManager {
  private timer: any = null;

  public startIncoming(intervalMs = 2500) {
    this.stop();
    const play = () => { playSynthTone(440, 0.4, "sine", 0.15); setTimeout(() => playSynthTone(480, 0.4, "sine", 0.15), 100); };
    play();
    this.timer = setInterval(play, intervalMs);
  }

  public startOutgoing(intervalMs = 3000) {
    this.stop();
    const play = () => playSynthTone(440, 1.2, "sine", 0.08);
    play();
    this.timer = setInterval(play, intervalMs);
  }

  public stop() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
}

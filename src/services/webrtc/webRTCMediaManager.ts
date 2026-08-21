export class WebRTCMediaManager {
  public localStream: MediaStream | null = null;
  public screenStream: MediaStream | null = null;

  public async getLocalMedia(audio = true, video = true): Promise<MediaStream | null> {
    try {
      if (this.localStream) this.stopLocalMedia();
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio, video });
      return this.localStream;
    } catch { return null; }
  }
  public async startScreenShare(): Promise<MediaStream | null> {
    try { if (this.screenStream) this.stopScreenShare(); this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true }); return this.screenStream; } catch { return null; }
  }
  public stopLocalMedia() { if (this.localStream) { this.localStream.getTracks().forEach((t) => t.stop()); this.localStream = null; } }
  public stopScreenShare() { if (this.screenStream) { this.screenStream.getTracks().forEach((t) => t.stop()); this.screenStream = null; } }
  public toggleMicrophone(on: boolean) { if (this.localStream) this.localStream.getAudioTracks().forEach((t) => { t.enabled = on; }); }
  public toggleCamera(on: boolean) { if (this.localStream) this.localStream.getVideoTracks().forEach((t) => { t.enabled = on; }); }
}

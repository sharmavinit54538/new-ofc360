export class WebRTCMediaManager {
  public localStream: MediaStream | null = null;
  public screenStream: MediaStream | null = null;

  public async getLocalMedia(audio = true, video = true): Promise<MediaStream | null> {
    try {
      if (this.localStream) {
        this.stopLocalMedia();
      }

      const constraints: MediaStreamConstraints = {
        audio: audio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
        video: video
          ? {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
            }
          : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (err) {
      console.warn("[WEBRTC_MEDIA] Preferred constraints failed, attempting basic media:", err);
      try {
        if (audio) {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: Boolean(video),
          });
          return this.localStream;
        }
      } catch (fallbackErr) {
        console.error("[WEBRTC_MEDIA] getUserMedia failed completely:", fallbackErr);
      }
      return null;
    }
  }

  public async startScreenShare(): Promise<MediaStream | null> {
    try {
      if (this.screenStream) this.stopScreenShare();
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      return this.screenStream;
    } catch (err) {
      console.error("[WEBRTC_MEDIA] getDisplayMedia error:", err);
      return null;
    }
  }

  public stopLocalMedia() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.localStream = null;
    }
  }

  public stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.screenStream = null;
    }
  }

  public toggleMicrophone(on: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = on;
      });
    }
  }

  public toggleCamera(on: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = on;
      });
    }
  }
}

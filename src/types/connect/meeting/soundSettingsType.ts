export interface ConnectSoundSettings {
  masterSoundEnabled: boolean;
  ringtoneVolume: number;
  notificationVolume: number;
  messageVolume: number;
  chimeVolume: number;
  preferredRingtone: "classic_corporate" | "gentle_pulse" | "modern_synth" | "minimal_bell";
  isMutedAll: boolean;
  notifyOnDirectMessage: boolean;
  notifyOnChannelMention: boolean;
  notifyOnCallIncoming: boolean;
  [key: string]: any;
}

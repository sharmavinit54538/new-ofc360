import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectSoundSettingsState, selectCurrentUserPresence } from "@/features/connect/selectors";
import * as soundActions from "@/features/connect/soundSettingsSlice";
import { useUpdateSoundSettingsMutation } from "@/services/api/connectApi";
import { connectAudioManager } from "@/services/connectAudioManager";
import {
  Volume2,
  VolumeX,
  Phone,
  PhoneCall,
  MessageSquare,
  AtSign,
  Users,
  Hash,
  Video,
  UserPlus,
  Play,
  RotateCcw,
  Sliders,
  ShieldAlert,
} from "lucide-react";

interface ConnectSoundSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectSoundSettingsModal({ open, onOpenChange }: ConnectSoundSettingsModalProps) {
  const dispatch = useAppDispatch();
  const store = useAppSelector(selectSoundSettingsState);
  const currentUserPresence = useAppSelector(selectCurrentUserPresence);

  const [updateSoundSettingsApi] = useUpdateSoundSettingsMutation();

  const handleUpdate = (partial: any) => {
    try {
      updateSoundSettingsApi(partial);
    } catch {}
  };

  const handleTestSound = (type: string) => {
    // Force unlock context if locked
    connectAudioManager.unlockAudio();

    switch (type) {
      case "incoming":
        connectAudioManager.playIncomingCall();
        setTimeout(() => connectAudioManager.stopIncomingCall(), 2500);
        break;
      case "outgoing":
        connectAudioManager.playOutgoingCall();
        setTimeout(() => connectAudioManager.stopOutgoingCall(), 3000);
        break;
      case "message":
        connectAudioManager.playMessage({ force: true });
        break;
      case "mention":
        connectAudioManager.playMention({ force: true });
        break;
      case "connected":
        connectAudioManager.playCallConnected();
        break;
      case "ended":
        connectAudioManager.playCallEnded();
        break;
      case "meeting":
        connectAudioManager.playMeetingStarted({ force: true });
        break;
      case "participant":
        connectAudioManager.playParticipantJoined({ force: true });
        break;
      case "screenshare":
        connectAudioManager.playScreenShareStarted({ force: true });
        break;
      default:
        connectAudioManager.playNotification({ force: true });
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shadow-md">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  Connect Settings
                  <span className="text-xs text-muted-foreground font-normal">→ Notifications & Sounds</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Customize notification chimes, call ringtones, volume levels, and audio behaviors.
                </DialogDescription>
              </div>
            </div>

            {/* Reset Defaults */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch(soundActions.resetToDefaults());
                handleUpdate({ masterVolume: 70, isMasterEnabled: true, isMutedAll: false });
              }}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 cursor-pointer"
              title="Reset all sound preferences to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mute All Sounds & DND Notice Banner */}
          {store.isMutedAll ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-600 dark:text-rose-400">
              <div className="flex items-center gap-2.5 text-xs font-bold">
                <VolumeX className="w-4 h-4" />
                <span>🔇 Connect Sounds Muted</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  dispatch(soundActions.setMutedAll(false));
                  handleUpdate({ isMutedAll: false });
                }}
                className="h-7 text-xs border-rose-500/40 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
              >
                Unmute All
              </Button>
            </div>
          ) : currentUserPresence === "dnd" ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                <strong>Do Not Disturb Active:</strong> Normal message/mention sounds are suppressed, but incoming call ringtones will ring according to your preference.
              </span>
            </div>
          ) : null}

          {/* Master Controls Section */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span>Master Sound & Volume</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Master Enable */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="master-sound-toggle" className="text-sm font-semibold cursor-pointer">
                    Master Sound
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Enable or disable all OFC360 sounds</p>
                </div>
                <Switch
                  id="master-sound-toggle"
                  checked={store.isMasterEnabled}
                  onCheckedChange={(val) => {
                    dispatch(soundActions.setMasterEnabled(val));
                    handleUpdate({ isMasterEnabled: val });
                  }}
                  aria-label="Master Sound Toggle"
                />
              </div>

              {/* Mute All Sounds */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
                <div className="space-y-0.5">
                  <Label htmlFor="mute-all-toggle" className="text-sm font-semibold cursor-pointer text-rose-600 dark:text-rose-400">
                    Mute All Connect Sounds
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Quickly silence all audio output</p>
                </div>
                <Switch
                  id="mute-all-toggle"
                  checked={store.isMutedAll}
                  onCheckedChange={(val) => {
                    dispatch(soundActions.setMutedAll(val));
                    handleUpdate({ isMutedAll: val });
                  }}
                  aria-label="Mute All Connect Sounds Toggle"
                />
              </div>
            </div>

            {/* Volume Slider */}
            <div className="p-3 rounded-lg bg-card border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="volume-slider" className="font-semibold flex items-center gap-1.5 cursor-pointer">
                  {store.masterVolume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary" />}
                  <span>Notification Volume</span>
                </Label>
                <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded text-[11px] text-foreground">
                  {store.masterVolume}%
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Slider
                  id="volume-slider"
                  value={[store.masterVolume]}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!store.isMasterEnabled || store.isMutedAll}
                  onValueChange={([val]) => {
                    dispatch(soundActions.setMasterVolume(val));
                    handleUpdate({ masterVolume: val });
                  }}
                  className="flex-1"
                  aria-label="Notification Volume Slider"
                />
              </div>
            </div>
          </div>

          {/* Calls Sound Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Call & Ringtone Sounds</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Incoming Calls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <Label htmlFor="inc-call-toggle" className="text-xs font-bold block cursor-pointer">
                      Incoming Calls
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Ringtone loop on call receive</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("incoming")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Ringtone"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="inc-call-toggle"
                    checked={store.isIncomingCallsEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setIncomingCallsEnabled(val));
                      handleUpdate({ isIncomingCallsEnabled: val });
                    }}
                    aria-label="Incoming Calls Sound Toggle"
                  />
                </div>
              </div>

              {/* Outgoing Calls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <Label htmlFor="out-call-toggle" className="text-xs font-bold block cursor-pointer">
                      Outgoing Calls
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Ringback tone while calling</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("outgoing")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Ringback Sound"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="out-call-toggle"
                    checked={store.isOutgoingCallsEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setOutgoingCallsEnabled(val));
                      handleUpdate({ isOutgoingCallsEnabled: val });
                    }}
                    aria-label="Outgoing Calls Sound Toggle"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages & Mentions Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-500" />
              <span>Messages & Notifications</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Direct Messages */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <Label htmlFor="dm-toggle" className="text-xs font-bold block cursor-pointer">
                      Direct Messages
                    </Label>
                    <span className="text-[11px] text-muted-foreground">New 1-on-1 chat notification</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("message")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Message Sound"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="dm-toggle"
                    checked={store.isMessagesEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setMessagesEnabled(val));
                      handleUpdate({ isMessagesEnabled: val });
                    }}
                    aria-label="Direct Messages Sound Toggle"
                  />
                </div>
              </div>

              {/* Mentions */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <AtSign className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <Label htmlFor="mention-toggle" className="text-xs font-bold block cursor-pointer">
                      @Mentions
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Distinctive mention chime</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("mention")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Mention Sound"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="mention-toggle"
                    checked={store.isMentionsEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setMentionsEnabled(val));
                      handleUpdate({ isMentionsEnabled: val });
                    }}
                    aria-label="Mentions Sound Toggle"
                  />
                </div>
              </div>

              {/* Group Messages */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <Label htmlFor="group-toggle" className="text-xs font-bold block cursor-pointer">
                      Group Messages
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Group chat notification sound</span>
                  </div>
                </div>
                <Switch
                  id="group-toggle"
                  checked={store.isGroupMessagesEnabled}
                  onCheckedChange={(val) => {
                    dispatch(soundActions.setGroupMessagesEnabled(val));
                    handleUpdate({ isGroupMessagesEnabled: val });
                  }}
                  aria-label="Group Messages Sound Toggle"
                />
              </div>

              {/* Channel Messages */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Hash className="w-4 h-4 text-violet-500 shrink-0" />
                  <div>
                    <Label htmlFor="channel-toggle" className="text-xs font-bold block cursor-pointer">
                      Channel Messages
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Public & private channel alerts</span>
                  </div>
                </div>
                <Switch
                  id="channel-toggle"
                  checked={store.isChannelMessagesEnabled}
                  onCheckedChange={(val) => {
                    dispatch(soundActions.setChannelMessagesEnabled(val));
                    handleUpdate({ isChannelMessagesEnabled: val });
                  }}
                  aria-label="Channel Messages Sound Toggle"
                />
              </div>
            </div>
          </div>

          {/* Meeting & Participant Sounds */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-500" />
              <span>Meetings & Screen Share</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Meeting Sounds */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <Label htmlFor="meeting-toggle" className="text-xs font-bold block cursor-pointer">
                      Meeting Start/End & Share
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Meeting state audio notifications</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("meeting")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Meeting Sound"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="meeting-toggle"
                    checked={store.isMeetingSoundsEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setMeetingSoundsEnabled(val));
                      handleUpdate({ isMeetingSoundsEnabled: val });
                    }}
                    aria-label="Meeting Sounds Toggle"
                  />
                </div>
              </div>

              {/* Participant Join/Leave */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <Label htmlFor="part-toggle" className="text-xs font-bold block cursor-pointer">
                      Participant Join / Leave
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Subtle entrance & exit dings</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleTestSound("participant")}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Test Participant Sound"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                  <Switch
                    id="part-toggle"
                    checked={store.isParticipantJoinLeaveEnabled}
                    onCheckedChange={(val) => {
                      dispatch(soundActions.setParticipantJoinLeaveEnabled(val));
                      handleUpdate({ isParticipantJoinLeaveEnabled: val });
                    }}
                    aria-label="Participant Join/Leave Sound Toggle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            {store.isMutedAll ? (
              <span className="text-rose-500 font-bold">🔇 Connect Sounds Muted</span>
            ) : (
              <span>🔊 Sounds Active ({store.masterVolume}%)</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gradient-bg text-primary-foreground font-semibold px-5 rounded-xl h-9 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../public/sounds');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createWavBuffer(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length minus RIFF identifier & length itself
  buffer.writeUInt32LE(36 + dataSize, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (1 = PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count
  buffer.writeUInt16LE(numChannels, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate
  buffer.writeUInt32LE(byteRate, 28);
  // block align
  buffer.writeUInt16LE(blockAlign, 32);
  // bits per sample
  buffer.writeUInt16LE(16, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit PCM samples
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  return buffer;
}

function generateSineTone(freq, durationSec, sampleRate = 44100, gain = 0.5, attackSec = 0.01, decaySec = 0.05) {
  const totalSamples = Math.floor(durationSec * sampleRate);
  const samples = new Float32Array(totalSamples);
  const attackSamples = Math.floor(attackSec * sampleRate);
  const decaySamples = Math.floor(decaySec * sampleRate);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let env = 1.0;
    if (i < attackSamples) {
      env = i / attackSamples;
    } else if (i > totalSamples - decaySamples) {
      env = (totalSamples - i) / decaySamples;
    }
    samples[i] = Math.sin(2 * Math.PI * freq * t) * gain * env;
  }
  return samples;
}

function mixTracks(trackList, sampleRate = 44100) {
  let maxLen = 0;
  for (const { samples, offsetSec } of trackList) {
    const offsetSamples = Math.floor((offsetSec || 0) * sampleRate);
    const end = offsetSamples + samples.length;
    if (end > maxLen) maxLen = end;
  }

  const mixed = new Float32Array(maxLen);
  for (const { samples, offsetSec } of trackList) {
    const offsetSamples = Math.floor((offsetSec || 0) * sampleRate);
    for (let i = 0; i < samples.length; i++) {
      mixed[offsetSamples + i] += samples[i];
    }
  }

  // Normalize if clipping
  let peak = 0;
  for (let i = 0; i < mixed.length; i++) {
    const abs = Math.abs(mixed[i]);
    if (abs > peak) peak = abs;
  }
  if (peak > 0.95) {
    const factor = 0.95 / peak;
    for (let i = 0; i < mixed.length; i++) {
      mixed[i] *= factor;
    }
  }

  return mixed;
}

// 1. Incoming Call Ringtone (Melodic marimba ringtone ~2.2s loopable)
function generateIncomingCallSound() {
  const sampleRate = 44100;
  const tracks = [
    // Phrase 1
    { samples: generateSineTone(659.25, 0.14, sampleRate, 0.45, 0.005, 0.05), offsetSec: 0.0 }, // E5
    { samples: generateSineTone(783.99, 0.14, sampleRate, 0.45, 0.005, 0.05), offsetSec: 0.12 }, // G5
    { samples: generateSineTone(1046.5, 0.35, sampleRate, 0.55, 0.005, 0.15), offsetSec: 0.24 }, // C6
    // Phrase 2
    { samples: generateSineTone(659.25, 0.14, sampleRate, 0.45, 0.005, 0.05), offsetSec: 0.70 }, // E5
    { samples: generateSineTone(783.99, 0.14, sampleRate, 0.45, 0.005, 0.05), offsetSec: 0.82 }, // G5
    { samples: generateSineTone(1046.5, 0.45, sampleRate, 0.55, 0.005, 0.2), offsetSec: 0.94 }, // C6
    // Trail silence to 2.2s total duration for seamless loop
    { samples: new Float32Array(Math.floor(0.7 * sampleRate)), offsetSec: 1.5 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 2. Outgoing Call Ringback Tone (~3.0s telecom burst)
function generateOutgoingCallSound() {
  const sampleRate = 44100;
  const dualTone = mixTracks([
    { samples: generateSineTone(440, 1.2, sampleRate, 0.35, 0.02, 0.05), offsetSec: 0.0 },
    { samples: generateSineTone(480, 1.2, sampleRate, 0.35, 0.02, 0.05), offsetSec: 0.0 },
  ]);
  const tracks = [
    { samples: dualTone, offsetSec: 0.0 },
    { samples: new Float32Array(Math.floor(1.8 * sampleRate)), offsetSec: 1.2 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 3. Message Pop Sound (Soft double chime ~0.35s)
function generateMessageSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(659.25, 0.12, sampleRate, 0.5, 0.003, 0.05), offsetSec: 0.0 }, // E5
    { samples: generateSineTone(987.77, 0.22, sampleRate, 0.6, 0.003, 0.12), offsetSec: 0.08 }, // B5
  ];
  return mixTracks(tracks, sampleRate);
}

// 4. Mention Sound (Bright double ping ~0.4s)
function generateMentionSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(783.99, 0.14, sampleRate, 0.55, 0.003, 0.06), offsetSec: 0.0 }, // G5
    { samples: generateSineTone(1174.66, 0.26, sampleRate, 0.65, 0.003, 0.15), offsetSec: 0.10 }, // D6
  ];
  return mixTracks(tracks, sampleRate);
}

// 5. Call Connected Sound (Pleasant ascending chime)
function generateCallConnectedSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(523.25, 0.12, sampleRate, 0.45, 0.005, 0.04), offsetSec: 0.0 }, // C5
    { samples: generateSineTone(659.25, 0.12, sampleRate, 0.5, 0.005, 0.04), offsetSec: 0.09 }, // E5
    { samples: generateSineTone(783.99, 0.28, sampleRate, 0.6, 0.005, 0.15), offsetSec: 0.18 }, // G5
  ];
  return mixTracks(tracks, sampleRate);
}

// 6. Call Ended Sound (Gentle descending chime)
function generateCallEndedSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(392.0, 0.15, sampleRate, 0.45, 0.005, 0.05), offsetSec: 0.0 }, // G4
    { samples: generateSineTone(293.66, 0.32, sampleRate, 0.45, 0.005, 0.15), offsetSec: 0.12 }, // D4
  ];
  return mixTracks(tracks, sampleRate);
}

// 7. Call Rejected Sound
function generateCallRejectedSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(587.33, 0.14, sampleRate, 0.45, 0.005, 0.04), offsetSec: 0.0 }, // D5
    { samples: generateSineTone(440.0, 0.3, sampleRate, 0.45, 0.005, 0.15), offsetSec: 0.11 }, // A4
  ];
  return mixTracks(tracks, sampleRate);
}

// 8. Call Failed Sound
function generateCallFailedSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(220.0, 0.18, sampleRate, 0.45, 0.01, 0.05), offsetSec: 0.0 },
    { samples: generateSineTone(185.0, 0.28, sampleRate, 0.45, 0.01, 0.1), offsetSec: 0.14 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 9. Notification Ping Sound
function generateNotificationSound() {
  const sampleRate = 44100;
  return generateSineTone(783.99, 0.22, sampleRate, 0.55, 0.003, 0.12);
}

// 10. Participant Joined
function generateParticipantJoinedSound() {
  const sampleRate = 44100;
  return generateSineTone(698.46, 0.22, sampleRate, 0.45, 0.005, 0.12);
}

// 11. Participant Left
function generateParticipantLeftSound() {
  const sampleRate = 44100;
  return generateSineTone(523.25, 0.25, sampleRate, 0.45, 0.005, 0.15);
}

// 12. Meeting Start
function generateMeetingStartSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(440.0, 0.12, sampleRate, 0.45, 0.005, 0.04), offsetSec: 0.0 },
    { samples: generateSineTone(554.37, 0.12, sampleRate, 0.5, 0.005, 0.04), offsetSec: 0.08 },
    { samples: generateSineTone(659.25, 0.32, sampleRate, 0.6, 0.005, 0.18), offsetSec: 0.16 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 13. Meeting End
function generateMeetingEndSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(659.25, 0.14, sampleRate, 0.45, 0.005, 0.04), offsetSec: 0.0 },
    { samples: generateSineTone(440.0, 0.35, sampleRate, 0.45, 0.005, 0.18), offsetSec: 0.12 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 14. Screen Share Start
function generateScreenShareStartSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(880.0, 0.08, sampleRate, 0.45, 0.003, 0.03), offsetSec: 0.0 },
    { samples: generateSineTone(1318.51, 0.16, sampleRate, 0.5, 0.003, 0.08), offsetSec: 0.06 },
  ];
  return mixTracks(tracks, sampleRate);
}

// 15. Screen Share Stop
function generateScreenShareStopSound() {
  const sampleRate = 44100;
  const tracks = [
    { samples: generateSineTone(1318.51, 0.08, sampleRate, 0.45, 0.003, 0.03), offsetSec: 0.0 },
    { samples: generateSineTone(880.0, 0.18, sampleRate, 0.45, 0.003, 0.08), offsetSec: 0.06 },
  ];
  return mixTracks(tracks, sampleRate);
}

const sounds = {
  'incoming-call.wav': generateIncomingCallSound(),
  'outgoing-call.wav': generateOutgoingCallSound(),
  'message.wav': generateMessageSound(),
  'mention.wav': generateMentionSound(),
  'call-connected.wav': generateCallConnectedSound(),
  'call-ended.wav': generateCallEndedSound(),
  'call-rejected.wav': generateCallRejectedSound(),
  'call-failed.wav': generateCallFailedSound(),
  'notification.wav': generateNotificationSound(),
  'participant-joined.wav': generateParticipantJoinedSound(),
  'participant-left.wav': generateParticipantLeftSound(),
  'meeting-start.wav': generateMeetingStartSound(),
  'meeting-end.wav': generateMeetingEndSound(),
  'screen-share-start.wav': generateScreenShareStartSound(),
  'screen-share-stop.wav': generateScreenShareStopSound(),
};

// Write both .wav and .mp3 (WAV container with valid header works across HTML5 audio in all browsers)
for (const [filename, samples] of Object.entries(sounds)) {
  const wavBuffer = createWavBuffer(samples);
  const wavPath = path.join(outputDir, filename);
  fs.writeFileSync(wavPath, wavBuffer);
  console.log(`Generated: ${wavPath} (${wavBuffer.length} bytes)`);

  // Also create .mp3 alias to satisfy any direct mp3 references seamlessly
  const mp3Path = path.join(outputDir, filename.replace('.wav', '.mp3'));
  fs.writeFileSync(mp3Path, wavBuffer);
  console.log(`Generated: ${mp3Path} (${wavBuffer.length} bytes)`);
}

console.log('All OFC360 sound assets successfully generated in public/sounds/!');

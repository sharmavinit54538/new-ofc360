import fs from 'fs';
import path from 'path';

const distAssets = path.resolve('c:/Users/Dell/OneDrive/Desktop/new-ofc/new-ofc360/dist/assets');
const files = fs.readdirSync(distAssets);
const jsFile = files.find(f => f.endsWith('.js'));
const code = fs.readFileSync(path.join(distAssets, jsFile), 'utf-8');

console.log('JS bundle size:', code.length);

// Let's search for keywords like WebSocket, RTCPeerConnection, WebRTC, connectCallOrchestrator, etc.
const keywords = ['WebRTCMediaManager', 'iceServers', 'stun:stun.l.google.com', 'call:incoming', 'typing:start', 'normalizeConnectConversation'];

for (const kw of keywords) {
  const idx = code.indexOf(kw);
  if (idx !== -1) {
    console.log(`\nFound "${kw}" at index ${idx}:`);
    console.log(code.substring(Math.max(0, idx - 150), Math.min(code.length, idx + 150)));
  } else {
    console.log(`\nKeyword "${kw}" NOT found`);
  }
}

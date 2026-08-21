export async function createPeerOffer(pc: RTCPeerConnection, targetUserId: string | null, sendSig: (s: any) => void) {
  const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
  await pc.setLocalDescription(offer);
  if (targetUserId) sendSig({ type: "offer", sdp: offer.sdp });
  return offer;
}

export async function createPeerAnswer(pc: RTCPeerConnection, targetUserId: string | null, sendSig: (s: any) => void) {
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  if (targetUserId) sendSig({ type: "answer", sdp: answer.sdp });
  return answer;
}

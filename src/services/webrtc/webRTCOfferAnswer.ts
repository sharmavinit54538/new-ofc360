export async function createPeerOffer(
  pc: RTCPeerConnection,
  targetUserId: string | null,
  sendSig: (s: any) => void
) {
  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(offer);
    if (targetUserId) {
      sendSig({ type: "offer", sdp: offer.sdp });
    }
    return offer;
  } catch (err) {
    console.error("[WEBRTC_CREATE_OFFER_ERROR]", err);
    return null;
  }
}

export async function createPeerAnswer(
  pc: RTCPeerConnection,
  targetUserId: string | null,
  sendSig: (s: any) => void
) {
  try {
    if (!pc || !pc.remoteDescription) {
      console.warn("[WEBRTC_CREATE_ANSWER] Remote description not set yet");
      return null;
    }
    const answer = await pc.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(answer);
    if (targetUserId) {
      sendSig({ type: "answer", sdp: answer.sdp });
    }
    return answer;
  } catch (err) {
    console.error("[WEBRTC_CREATE_ANSWER_ERROR]", err);
    return null;
  }
}

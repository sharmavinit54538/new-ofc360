export function streamAiResponse(full: string, onChunk: (c: string) => void, onComplete: () => void, interval = 20) {
  const words = full.split(" ");
  let currentIndex = 0;
  const timer = setInterval(() => {
    if (currentIndex >= words.length) {
      clearInterval(timer);
      onComplete();
      return;
    }
    const currentChunk = words.slice(0, currentIndex + 1).join(" ");
    onChunk(currentChunk);
    currentIndex++;
  }, interval);
  return () => clearInterval(timer);
}

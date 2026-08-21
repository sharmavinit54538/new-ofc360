export type TokenUpdateListener = (token: string) => void;
const tokenUpdateListeners = new Set<TokenUpdateListener>();

export const registerTokenUpdateListener = (listener: TokenUpdateListener) => {
  tokenUpdateListeners.add(listener);
  return () => {
    tokenUpdateListeners.delete(listener);
  };
};

export const notifyTokenUpdated = (newToken: string) => {
  tokenUpdateListeners.forEach((listener) => {
    try {
      listener(newToken);
    } catch {}
  });
};

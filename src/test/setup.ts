import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as any;
window.ResizeObserver = MockResizeObserver as any;

if (typeof globalThis.Request !== "undefined") {
  const OriginalRequest = globalThis.Request;
  const SafeRequest = function (input: any, init?: any) {
    if (init && typeof init === "object" && "signal" in init) {
      const { signal, ...rest } = init;
      return new OriginalRequest(input, rest);
    }
    return new OriginalRequest(input, init);
  };
  SafeRequest.prototype = OriginalRequest.prototype;
  globalThis.Request = SafeRequest as any;
  window.Request = SafeRequest as any;
}





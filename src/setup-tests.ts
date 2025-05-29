import "@testing-library/jest-dom";

if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.fetch === "undefined") {
  const fetch = require("cross-fetch");
  global.fetch = fetch;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
  global.Headers = fetch.Headers;
}

if (typeof global.URL === "undefined") {
  const { URL, URLSearchParams } = require("url");
  global.URL = URL;
  global.URLSearchParams = URLSearchParams;
}

if (typeof global.BroadcastChannel === "undefined") {
  (global as any).BroadcastChannel = class BroadcastChannel {
    constructor(name: string) {
      this.name = name;
    }
    name: string;
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
      return true;
    }
    onmessage = null;
    onmessageerror = null;
  };
}

if (typeof global.MessageChannel === "undefined") {
  (global as any).MessageChannel = class MessageChannel {
    port1 = {
      postMessage() {},
      close() {},
      addEventListener() {},
      removeEventListener() {},
      onmessage: null,
    };
    port2 = {
      postMessage() {},
      close() {},
      addEventListener() {},
      removeEventListener() {},
      onmessage: null,
    };
  };
}

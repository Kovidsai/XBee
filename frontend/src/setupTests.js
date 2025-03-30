// setupTests.js
import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ token: "fake-token" }),
  })
);
// setupTests.js
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
    removeItem: (key) => delete store[key],
  };
})();

global.localStorage = localStorageMock;

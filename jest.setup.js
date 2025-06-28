require('@testing-library/jest-dom');

// mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// глобальный мок import.meta.env для ESM-модулей
if (typeof globalThis.importMeta === 'undefined') {
  globalThis.importMeta = { env: { VITE_BACKEND_URL: 'http://localhost:3001' } };
}
Object.defineProperty(globalThis, 'import.meta', {
  value: { env: { VITE_BACKEND_URL: 'http://localhost:3001' } },
  configurable: true,
});

// polyfill TextEncoder для node
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
} 
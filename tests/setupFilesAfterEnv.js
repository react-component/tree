import '@testing-library/jest-dom';

if (typeof global.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = ResizeObserver;
  window.ResizeObserver = ResizeObserver;
}

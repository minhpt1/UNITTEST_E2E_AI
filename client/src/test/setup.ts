import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock HTMLFormElement.prototype.requestSubmit for jsdom compatibility
// This is needed because jsdom doesn't implement requestSubmit yet
const originalRequestSubmit = HTMLFormElement.prototype.requestSubmit;

// Define the mock implementation
const mockRequestSubmit = function(this: HTMLFormElement, submitter?: HTMLElement) {
  // Simulate the default behavior of requestSubmit
  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  
  // If a submitter is provided, set it as the submitter
  if (submitter) {
    Object.defineProperty(submitEvent, 'submitter', {
      value: submitter,
      enumerable: true
    });
  }
  
  this.dispatchEvent(submitEvent);
};

// Override both the prototype method and define a property descriptor
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: mockRequestSubmit,
  writable: true,
  configurable: true
});

// Also try to prevent jsdom's error by suppressing the not-implemented error
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Suppress the specific jsdom requestSubmit error
  if (typeof args[0] === 'string' && args[0].includes('HTMLFormElement.prototype.requestSubmit')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Suppress console.log in tests
  log: vi.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};
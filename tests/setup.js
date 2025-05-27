/**
 * Jest setup file for Hello World Web Application tests
 */

// Mock global objects and functions for testing
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console.log to avoid noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};

// Setup DOM testing environment
beforeEach(() => {
    // Clear any timers
    jest.clearAllTimers();
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});

afterEach(() => {
    // Clean up any timers
    jest.clearAllTimers();
});
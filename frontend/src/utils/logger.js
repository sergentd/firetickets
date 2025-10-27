/**
 * Logger Utility
 * Centralized logging with environment-based control
 *
 * Set VITE_ENABLE_LOGGING=true in .env.local for development
 * Set VITE_ENABLE_LOGGING=false (or omit) for production
 */

const isLoggingEnabled = import.meta.env.VITE_ENABLE_LOGGING === 'true';

export const logger = {
  log: (...args) => {
    if (isLoggingEnabled) {
      console.log(...args);
    }
  },

  warn: (...args) => {
    if (isLoggingEnabled) {
      console.warn(...args);
    }
  },

  error: (...args) => {
    // Always log errors, even in production
    console.error(...args);
  },

  info: (...args) => {
    if (isLoggingEnabled) {
      console.info(...args);
    }
  },

  debug: (...args) => {
    if (isLoggingEnabled) {
      console.debug(...args);
    }
  },

  // Helper to check if logging is enabled
  get enabled() {
    return isLoggingEnabled;
  }
};

export default logger;

/**
 * Logger utility for consistent logging throughout the application
 * Provides different log levels and can be configured for production
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private isDevelopment = import.meta.env.DEV;

  constructor() {
    // Set log level based on environment
    if (this.isDevelopment) {
      this.level = LogLevel.DEBUG;
    } else {
      this.level = LogLevel.WARN;
    }
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} [DEBUG]`, message, ...args);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} [INFO]`, message, ...args);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} [WARN]`, message, ...args);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} [ERROR]`, message, ...args);
        break;
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Log general information
   */
  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Log warnings
   */
  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Log errors
   */
  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

// Export singleton instance
export const logger = new Logger();
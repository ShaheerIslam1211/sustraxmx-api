/**
 * Logger
 * Centralized logging system with different levels and contexts
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: Date;
  stack?: string;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private enableConsole: boolean;
  private enableStorage: boolean;
  private maxStorageEntries: number;

  constructor() {
    this.logLevel =
      process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO;
    this.enableConsole = true;
    this.enableStorage = process.env.NODE_ENV === "development";
    this.maxStorageEntries = 1000;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configure logger
   */
  configure(config: {
    logLevel?: LogLevel;
    enableConsole?: boolean;
    enableStorage?: boolean;
    maxStorageEntries?: number;
  }): void {
    this.logLevel = config.logLevel ?? this.logLevel;
    this.enableConsole = config.enableConsole ?? this.enableConsole;
    this.enableStorage = config.enableStorage ?? this.enableStorage;
    this.maxStorageEntries = config.maxStorageEntries ?? this.maxStorageEntries;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    if (level < this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
      stack: error?.stack,
    };

    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.enableStorage) {
      this.logToStorage(logEntry);
    }
  }

  /**
   * Log to console with appropriate styling
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context
      ? JSON.stringify(entry.context, null, 2)
      : "";
    const stackStr = entry.stack ? `\n${entry.stack}` : "";

    const logMessage = `[${timestamp}] ${levelName}: ${entry.message}${contextStr}${stackStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug("🔍", logMessage);
        break;
      case LogLevel.INFO:
        console.info("ℹ️", logMessage);
        break;
      case LogLevel.WARN:
        console.warn("⚠️", logMessage);
        break;
      case LogLevel.ERROR:
        console.error("❌", logMessage);
        break;
    }
  }

  /**
   * Log to localStorage for debugging
   */
  private logToStorage(entry: LogEntry): void {
    if (typeof window === "undefined") return;

    try {
      const logs = this.getStoredLogs();
      logs.push(entry);

      // Keep only the most recent entries
      if (logs.length > this.maxStorageEntries) {
        logs.splice(0, logs.length - this.maxStorageEntries);
      }

      localStorage.setItem("app_logs", JSON.stringify(logs));
    } catch (error) {
      console.warn("Failed to store log entry:", error);
    }
  }

  /**
   * Get stored logs
   */
  getStoredLogs(): LogEntry[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("app_logs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  clearStoredLogs(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("app_logs");
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    const logs = this.getStoredLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.getStoredLogs().filter(log => log.level === level);
  }

  /**
   * Get logs by component
   */
  getLogsByComponent(component: string): LogEntry[] {
    return this.getStoredLogs().filter(
      log => log.context?.component === component
    );
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    const logs = this.getStoredLogs();
    return logs.slice(-count);
  }
}

// Create singleton instance
export const logger = Logger.getInstance();

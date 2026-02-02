type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  accountId?: string;
  organizationId?: string;
  requestId?: string;
  endpoint?: string;
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === "production";

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

function log(level: LogLevel, message: string, context?: LogContext) {
  if (level === "debug" && isProduction) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (isProduction) {
    // In production, output structured JSON for log aggregation
    const output = JSON.stringify(entry);
    if (level === "error") {
      // eslint-disable-next-line no-console
      console.error(output);
    } else if (level === "warn") {
      // eslint-disable-next-line no-console
      console.warn(output);
    } else {
      // eslint-disable-next-line no-console
      console.log(output);
    }
  } else {
    // In development, pretty print for readability
    const prefix = `[${level.toUpperCase()}]`;
    if (level === "error") {
      // eslint-disable-next-line no-console
      console.error(prefix, message, context ?? "");
    } else if (level === "warn") {
      // eslint-disable-next-line no-console
      console.warn(prefix, message, context ?? "");
    } else {
      // eslint-disable-next-line no-console
      console.log(prefix, message, context ?? "");
    }
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log("debug", msg, ctx),
  info: (msg: string, ctx?: LogContext) => log("info", msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log("warn", msg, ctx),
  error: (msg: string, ctx?: LogContext) => log("error", msg, ctx),
};

/** Helper to extract error message safely for logging */
export { formatError };

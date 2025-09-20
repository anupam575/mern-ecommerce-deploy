import winston from "winston";
import path from "path";
import fs from "fs";

// ========================
// Create log directory if not exists
// ========================
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ========================
// Define custom log format
// ========================
const logFormat = winston.format.printf(({ level, message, timestamp, metadata }) => {
  let metaString = metadata && Object.keys(metadata).length ? ` | metadata: ${JSON.stringify(metadata)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
});

// ========================
// Winston Logger
// ========================
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, "exceptions.log") })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, "rejections.log") })
  ],
  exitOnError: false,
});

export default logger;

const fs = require("fs");
const pino = require("pino");
const path = require("path");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../logs");

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 🔁 Rotate when log file exceeds 10MB
const rotatingStream = rfs.createStream("app.log", {
  size: "2M", // rotate every 10 megabytes
  maxFiles: 10, // keep last 10 rotated logs
  compress: "gzip", // compress rotated files
  path: logDirectory,
});

const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  rotatingStream
);

module.exports = logger;

import winston from "winston";
import config from "./config.js";

const customLevelsLogger = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "black",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
  },
};

export const devLogger = winston.createLogger({
  levels: customLevelsLogger.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsLogger.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const prodLogger = winston.createLogger({
  levels: customLevelsLogger.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsLogger.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

export const logger = config.ENV === "production" ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

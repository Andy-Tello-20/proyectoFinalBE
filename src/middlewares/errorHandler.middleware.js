import { logger } from "../config/logger.js";
import { statusError } from "../utils/StatusError.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  switch (error.status) {
    case statusError.NOT_FOUND:
      logger.error(
        `${error.message ? error.message : "Not Found"} - Status: ${
          statusError.NOT_FOUND
        } - Details: ${error.name}`
      );
      res.status(404).send({
        message: error.message || "Not Found",
        status: statusError.NOT_FOUND,
      });
      break;
    case statusError.BAD_REQUEST:
      logger.error(
        `${error.message ? error.message : "Bad Request"} - Status: ${
          statusError.BAD_REQUEST
        } - Details: ${error.name}`
      );
      res.status(400).json({
        message: error.message || "Bad Request",
        status: statusError.BAD_REQUEST,
      });
      break;
    case statusError.CONFLICT:
      logger.error(
        `${error.message ? error.message : "Bad Request"} - Status: ${
          statusError.CONFLICT
        } - Details: ${error.name}`
      );
      res.status(409).json({
        message: error.message || "Bad Request",
        status: statusError.CONFLICT,
      });
      break;
    default:
      logger.fatal(
        `Error no catcheado: ${error.message} - Details: ${error.name}`
      );
      res.status(500).json({
        message: "Internal Server Error",
        status: statusError.SERVER_ERROR,
      });
  }
};

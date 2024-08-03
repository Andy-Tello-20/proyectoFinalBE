import { logger } from "../config/logger.js";
import { Users } from "../dao/models/index.js";
import { UserDto } from "../dto/users.js";
import { CustomError } from "../utils/CustomError.js";
import { messageError } from "../utils/MessageError.js";
import { statusError } from "../utils/StatusError.js";

export const getOwner = async (owner) => {
  const user = await Users.findById(owner);
  if (!user) {
    logger.warning(`User ID: ${req.query} not found`);
    return CustomError.create({
      name: `User ID: ${req.params.cid} not found`,
      status: statusError.NOT_FOUND,
      message: messageError.NOT_FOUND,
    });
  }
  return new UserDto(user);
};

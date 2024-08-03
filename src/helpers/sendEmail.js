import { logger } from "../config/logger.js";
import EmailService from "../services/email.service.js";
import { CustomError } from "../utils/CustomError.js";
import { messageError } from "../utils/MessageError.js";
import { statusError } from "../utils/StatusError.js";

export const sendEmail = async (user, product) => {
  const emailService = EmailService.getInstance();
  const result = await emailService.sendEmail(
    `${user.email}`,
    "This notification is sent because your product has been deleted",
    `<h1>Product ${product.title} with id '${product.id}' has been deleted by Admin.</h1>`
  );

  if (!result) {
    logger.warning(`Ha ocurrido un error al enviar el email`);
    return CustomError.create({
      name: `Ha ocurrido un error al enviar el email`,
      status: statusError.SERVER_ERROR,
      message: messageError.SERVER_ERROR,
    });
  }
};

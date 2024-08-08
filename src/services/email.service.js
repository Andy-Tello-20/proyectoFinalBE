import nodemailer from "nodemailer";
import config from "../config/config.js";

export default class EmailService {
  static #instance = null;
  constructor() {
    this.transport = nodemailer.createTransport({
      service: config.MAIL.emailService,
      port: config.MAIL.emailPort,
      auth: { user: config.MAIL.emailUser, pass: config.MAIL.emailPassword },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transport.sendMail({
      from: config.MAIL.emailUser,
      to,
      subject,
      html,
      attachments,
    });
  }

  static getInstance() {
    if (!EmailService.#instance) {
      EmailService.#instance = new EmailService();
    }
    return EmailService.#instance;
  }
}

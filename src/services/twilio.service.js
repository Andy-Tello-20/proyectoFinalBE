import twilio from "twilio";
import config from "../config/config.js";

export default class TwilioService {
  static #instance = null;
  constructor() {
    this.client = twilio(config.TWILIO.accountSid, config.TWILIO.authToken);
  }

  sendSMS(to, body) {
    return this.client.messages.create({
      body,
      to,
      from: config.TWILIO.phoneNumber,
    });
  }

  static getInstance() {
    if (!TwilioService.#instance) {
      TwilioService.#instance = new TwilioService();
    }
    return TwilioService.#instance;
  }
}

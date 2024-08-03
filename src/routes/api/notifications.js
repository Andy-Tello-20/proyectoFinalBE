import { Router } from "express";
import TwilioService from "../../services/twilio.service.js";

const notifications = new Router();

notifications.get("/send-otp", async (req, res) => {
  const twilioService = TwilioService.getInstance();

  const response = await twilioService.sendSMS(
    "+543364524350",
    "Twilio service has been enabled"
  );

  res.json(response);
});

export default notifications;

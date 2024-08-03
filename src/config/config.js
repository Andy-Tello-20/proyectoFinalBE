import dotenv from "dotenv";
dotenv.config();

dotenv.config(

  {
      path:"./src/.env",
      override: true

  }
)

export default {
  DB_URL: process.env.MONGODB_URI,
  CLIENTID_GITHUB: process.env.CLIENTID_GITHUB,
  CLIENTSECRET_GITHUB: process.env.CLIENTSECRET_GITHUB,
  CALLBACKURL_GITHUB: process.env.CALLBACKURL_GITHUB,
  JWT_SECRET: process.env.JWT_SECRET,
  PERSISTENCE: process.env.PERSISTENCE || "mongoDB",
  TWILIO: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_SMS_NUMBER,
  },
  MAIL: {
    emailService: process.env.EMAIL_SERVICE || "gmail",
    emailPort: process.env.EMAIL_PORT || 587,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
  },
  ENV: process.env.NODE_ENV || "development",
};

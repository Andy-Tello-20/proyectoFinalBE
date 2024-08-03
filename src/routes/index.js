import { Router } from "express";
import bcrypt from "bcrypt";
import cartRouter from "./carts.router.js";
import productRouter from "./products.router.js";
import viewRouter from "./views/index.js";
import messageRouter from "./messages/index.js";
import sessionsRouter from "./sessions/index.js";
import notifications from "./api/notifications.js";
import {
  authMiddleware,
  authRolesMiddleware,
  generateTokenInEmail,
} from "../helpers/jwt.js";
import { generateProduct } from "../utils/generateProduct.js";
import EmailService from "../services/email.service.js";
import UsersService from "../services/user.service.js";
import { logger } from "../config/logger.js";
import { CustomError } from "../utils/CustomError.js";
import { messageError } from "../utils/MessageError.js";
import { statusError } from "../utils/StatusError.js";
import { Users } from "../dao/models/index.js";
import user from "./users.router.js";

const router = new Router();
router.use("/products", authMiddleware("jwt"), productRouter);
router.use("/carts", authMiddleware("jwt"), cartRouter);
router.use("/views", viewRouter);
router.use(
  "/chat",
  authMiddleware("jwt"), //agregar payload al req
  authRolesMiddleware(["user"]), //verificar que solo rol 'user' ingrese
  messageRouter
);
router.use("/sessions", sessionsRouter);
router.use("/notifications", notifications);
router.get("/mockingproducts", async (req, res, next) => {
  try {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
    res.send(products);
  } catch (error) {
    next(error);
  }
});
router.get("/loggerTest", (req, res) => {
  try {
    req.logger.debug("debug");
    req.logger.http("verbose");
    req.logger.info("info");
    req.logger.warning("warning");
    req.logger.error("error");
    req.logger.fatal("fatal");
    res.send({ message: "Probando logger en consola" });
  } catch (error) {
    next(error);
  }
});
router.post("/recovery-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UsersService.getByEmail(email);
    if (!user) {
      logger.warning(`Email: ${email} no registrado`);
      return CustomError.create({
        name: `Email: ${email} no registrado`,
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }
    const token = generateTokenInEmail(user);
    const emailService = EmailService.getInstance();
    const result = await emailService.sendEmail(
      `${user.email}`,
      "Reestablecimiento de contraseña",
      `<h1>Este correo tiene validez por 1 hora.</h1><br><a href="http://localhost:8080/api/views/generate-new-password?token=${token}" target="_blank">Reestablecer contraseña</a>`
    );

    if (!result) {
      logger.warning(`Ha ocurrido un error al enviar el email`);
      return CustomError.create({
        name: `Ha ocurrido un error al enviar el email`,
        status: statusError.SERVER_ERROR,
        message: messageError.SERVER_ERROR,
      });
    }

    res.send({ message: "Correo enviado" });
  } catch (error) {
    next(error);
  }
});
router.post("/verify-password", async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ isSame: true });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const updateResult = await Users.updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
      );
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      return res.json({ isSame: false });
    }
  } catch (error) {
    next(error);
  }
});
router.use("/users", user);

export default router;

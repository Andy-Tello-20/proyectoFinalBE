import { Router } from "express";
import { logout, profile } from "../../dao/index.js";
import passport from "passport";
import {
  authMiddleware,
  authRolesMiddleware,
  generateToken,
} from "../../helpers/jwt.js";
import { Users } from "../../dao/models/index.js";
import bcrypt from "bcrypt";
import { CurrentDTO } from "../../dto/current.js";

const router = new Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Todos los campos son requeridos" });
    }

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Correo o contraseña invalidos" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).send({ message: "Correo o contraseña invalidos" });
    const dateNow = new Date();
    user.last_connection = dateNow;
    user.save();
    const token = generateToken(user);
    res
      .cookie("token", token, { maxAge: 1000 * 500, httpOnly: true })
      .redirect("/api/views/products");
  } catch (error) {
    console.log("Error en el servicio de autenticacion", error);
    res.status(500).send({ message: "Algo salio mal" });
  }
});
router.get("/logout", authMiddleware("jwt"), logout);

router.post("/register", async (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    try {
      if (err) {
        throw new Error(err);
      }
      res.redirect("/");
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  })(req, res, next);
});

router.get("/profile", authMiddleware("jwt"), profile);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api/views/profile");
  }
);
router.get(
  "/current",
  authMiddleware("jwt"),
  authRolesMiddleware(["admin"]),
  (req, res) => {
    res.send(new CurrentDTO(req.user));
  }
);

export default router;

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Users } from "../dao/models/index.js";
import bcrypt from "bcrypt";
import CartsService from "../services/carts.service.js";

const cookieExtractor = (req) => {
  let token;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

export const passportStrategy = () => {
  const registerOpts = {
    usernameField: "email",
    passReqToCallback: true,
  };

  passport.use(
    "register",
    new LocalStrategy(registerOpts, async (req, email, password, done) => {
      const { firstName, lastName, age } = req.body;

      if (!firstName || !lastName) {
        return done(new Error("Todos los campos son requeridos"));
      }

      const user = await Users.findOne({ email });

      if (user)
        return done(new Error(`El correo ${email} ya ha sido registrado.`));

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Users.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
      });

      const cart = await CartsService.createNewCart();
      await Users.findByIdAndUpdate(newUser._id, { cart: cart._id });

      return done(null, newUser);
    })
  );

  const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  };

  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, (payload, done) => {
      return done(null, payload);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await Users.findById(uid);
    done(null, user);
  });
};

import jwt from "jsonwebtoken";
import passport from "passport";

export const generateToken = (user) => {
  const { id, email, firstName, lastName, role, age, cart } = user;
  const payload = { id, email, firstName, lastName, role, age, cart };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });
};

export const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};

export const authMiddleware = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, function (error, payload, info) {
    if (error) return next(error);
    if (!payload) return res.redirect("/");
    req.user = payload;
    next();
  })(req, res, next);
};

export const authRolesMiddleware = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).send({ message: "Unauthorized" });
  const { role: userRole } = req.user;
  if (!roles.includes(userRole))
    return res.status(403).send({ message: "Forbidden" });

  next();
};

export const generateTokenInEmail = (user) => {
  const { email, _id } = user;
  const payload = { email, _id };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

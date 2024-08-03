import { Users } from "../../models/index.js";

export const logout = async (req, res) => {
  try {
    req.session.destroy(async (error) => {
      if (error) {
        return res.send({
          message: "Hubo un error al cerrar sesión",
          error: error,
        });
      }

      const { email } = req.user;
      const user = await Users.findOne({ email });
      const dateNow = new Date();
      user.last_connection = dateNow;
      user.save();

      res.clearCookie("token");
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
};

export const profile = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/");

    res.render("profile", { user: req.user });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Ocurrio un error" });
  }
};

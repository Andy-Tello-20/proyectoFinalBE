import passport from "passport";
import { Router } from "express";
import { CartManagerMongo, ProductManager } from "../../dao/index.js";
import { Users, productsMongo } from "../../dao/models/index.js";
import { authMiddleware, authRolesMiddleware } from "../../helpers/jwt.js";
import { UserDto } from "../../dto/index.js";

const router = Router();
const cartManager = new CartManagerMongo();

router.get("/products", authMiddleware("jwt"), async (req, res) => {
  try {
    if (!req.cookies.token) return res.redirect("/");
    const { page = 1, limit = 10 } = req.query;
    const products = await productsMongo.paginate(
      {},
      { page, limit, lean: true }
    );

    if (req.user.role === "user") {
      req.user.user = true;
    } else if (req.user.role === "premium") {
      req.user.premium = true;
    } else {
      req.user.admin = true;
    }

    products.docs.forEach((product) => {
      product.showForm = product.stock > 0;
      product.isOwner =
        "premium" === req.user.role &&
        req.user.id === product.owner?.toString();
      product.isNotFromOwner = product.showForm && !product.isOwner;
    });

    res.render("products", { products, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/carts/:cid", authMiddleware("jwt"), async (req, res) => {
  try {
    if (!req.cookies.token) return res.redirect("/");
    const { cid } = req.params;
    let cart = await cartManager.getCartById(cid);
    let serializedProducts = JSON.stringify(cart?.products || []);

   
    const totalSum = cart.products.reduce((accumulator, item) => {
      return accumulator + (item.quantity * item.product.price);
    }, 0);
    


    res.render("carts", {
      cart: cart?.toJSON() || [],
      email: req.user.email,
      serializedProducts,
      totalSum,

    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.get("/payment",authMiddleware("jwt"), (req,res)=>{
  res.render("payment",{})
})

router.get(
  "/profile",
  authMiddleware("jwt"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (!req.cookies.token) return res.redirect("/");
      res.render("profile", { user: req.user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get("/login", async (req, res) => {
  try {
    if (req.cookies.token) return res.redirect("/api/views/products");
    res.render("login", {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
router.get("/register", async (req, res) => {
  try {
    if (req.cookies.token) return res.redirect("/api/views/products");
    res.render("register", {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
router.get("/generate-new-password", async (req, res, next) => {
  try {
    const { token } = req.query;

    validateToken(token)
      .then(async (payload) => {
        res.render("recoveryPassword", { user: payload });
      })
      .catch((error) => {
        if (error.name === "TokenExpiredError") {
          return res.redirect("/");
        }
      });
  } catch (error) {
    next(error);
  }
});
router.get(
  "/usersManagement",
  authMiddleware("jwt"),
  authRolesMiddleware(["admin"]),
  async (req, res, next) => {
    try {
      const users = await Users.find();
      const usersFormatted = users.map((u) => new UserDto(u));
      res.render("usersManagement", { data: usersFormatted });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/*", async (req, res) => {
  try {
    if (!req.cookies.token) return res.redirect("/");
    res.redirect("/api/views/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error redirecting to products page");
  }
});

export default router;

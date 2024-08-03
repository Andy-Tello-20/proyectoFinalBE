import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { AllProductsDTO, ProductDTO } from "../dto/index.js";
import { CustomError } from "../utils/CustomError.js";
import { statusError } from "../utils/StatusError.js";
import { messageError } from "../utils/MessageError.js";
import { logger } from "../config/logger.js";
import { getOwner } from "../helpers/getOwner.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { authRolesMiddleware } from "../helpers/jwt.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductsController.getAll(req.query);
    res.send({ message: "Query finished", ...new AllProductsDTO(products) });
  } catch (error) {
    next(error);
  }
});

router.get("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await ProductsController.getById(id);
    if (!product) {
      logger.warning("Producto no encontrado");
      return CustomError.create({
        name: "Producto no encontrado",
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }
    res.send(new ProductDTO(product));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authRolesMiddleware(["admin", "premium"]),
  async (req, res, next) => {
    try {
      const product = await ProductsController.addProduct(req.body);
      res.status(201).send(new ProductDTO(product));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  authRolesMiddleware(["admin", "premium"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const productToUpdate = req.body;
      const productUpdated = await ProductsController.updateById(
        id,
        productToUpdate
      );
      if (productUpdated.acknowledged) {
        const product = await ProductsController.getById(id);
        return res.send({
          message: "The product was updated",
          product: new ProductDTO(product),
        });
      }
      logger.warning("Actualización fallida");
      CustomError.create({
        name: "Actualización fallida",
        status: statusError.SERVER_ERROR,
        message: messageError.SERVER_ERROR,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authRolesMiddleware(["admin", "premium"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let owner = null;
      const productToDelete = await ProductsController.getById(id);

      if (productToDelete?.owner) {
        owner = await getOwner(productToDelete.owner);
      }
      const productDeleted = await ProductsController.deleteById(id);
      if (productDeleted.deletedCount > 0) {
        if (owner.rol === "premium") {
          sendEmail(owner, productToDelete);
        }
        return res.send({
          message: `Product deleted succesfully with ID: ${id}`,
        });
      } else {
        logger.warning("Eliminación fallida");
        CustomError.create({
          name: "Eliminación fallida",
          status: statusError.SERVER_ERROR,
          message: messageError.SERVER_ERROR,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

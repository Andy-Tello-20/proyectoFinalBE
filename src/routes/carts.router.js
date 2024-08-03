import { Router } from "express";
import { CartsDTO, ProductsInCartDTO } from "../dto/index.js";
import CartsController from "../controllers/carts.controller.js";
import ProductsService from "../services/products.service.js";
import TicketsService from "../services/tickets.service.js";
import { statusError } from "../utils/StatusError.js";
import { messageError } from "../utils/MessageError.js";
import { CustomError } from "../utils/CustomError.js";
import { logger } from "../config/logger.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const cart = await CartsController.getAll();
    const cartFormatted = cart.map((c) => new CartsDTO(c));
    res.send(cartFormatted);
  } catch (error) {
    next(error);
  }
});

router.get("/:cid", async (req, res, next) => {
  try {
    const cart = await CartsController.getById(req.params.cid);
    if (!cart) {
      logger.warning(`Cart ID: ${req.params.cid} no encontrado`);
      return CustomError.create({
        name: `Cart ID: ${req.params.cid} no encontrado`,
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }
    res.send(new ProductsInCartDTO(cart));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (_req, res, next) => {
  try {
    const cart = await CartsController.createNewCart();
    res.status(201).send(new ProductsInCartDTO(cart));
  } catch (error) {
    next(error);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    let cartFounded = await CartsController.getById(req.params.cid);
    if (!cartFounded) {
      logger.warning(`Cart ID: ${req.params.cid} no encontrado`);
      return CustomError.create({
        name: `Cart ID: ${req.params.cid} no encontrado`,
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }
    const cart = await CartsController.addProductOrIncreaseQuantity(
      cartFounded,
      req.params.pid
    );
    if (cart) {
      cartFounded = await CartsController.getById(req.params.cid);
    }
    res.send(new ProductsInCartDTO(cartFounded));
  } catch (error) {
    next(error);
  }
});

router.put("/:cid", async (req, res, next) => {
  const { products } = req.body;
  const cid = req.params.cid;

  if (!products || products.length === 0) {
    logger.warning("Body vacío o sin producto en la petición");
    return CustomError.create({
      name: "Body vacío o sin producto en la petición",
      status: statusError.BAD_REQUEST,
      message: messageError.BAD_REQUEST,
    });
  }

  try {
    await CartsController.updateById(cid, products);
    const updatedCart = await CartsController.getById(cid);
    res.send({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity) {
      logger.warning("Quantity no provista");
      return CustomError.create({
        name: "Quantity no provista",
        status: statusError.BAD_REQUEST,
        message: messageError.BAD_REQUEST,
      });
    }
    let cartFounded = await CartsController.getById(req.params.cid);
    if (!cartFounded) {
      logger.warning(`Cart ID: ${req.params.cid} no encontrado`);
      return CustomError.create({
        name: `Cart ID: ${req.params.cid} no encontrado`,
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }
    const cart = await CartsController.updateQuantityOfProduct(
      req.params,
      quantity,
      cartFounded
    );
    res.send({ message: "Cart updated", cart: new ProductsInCartDTO(cart) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid", async (req, res, next) => {
  try {
    const productDeleted = await CartsController.deleteById(req.params.cid);
    if (!productDeleted) {
      logger.warning(`Cart ID: ${req.params.cid} no encontrado`);
      return CustomError.create({
        name: `Cart ID: ${req.params.cid} no encontrado`,
        status: statusError.NOT_FOUND,
        message: messageError.NOT_FOUND,
      });
    }

    res.send({ message: "Cart deleted", cart: new CartsDTO(productDeleted) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid/products/:pid", async (req, res, next) => {
  try {
    const cartFounded = await CartsController.getById(req.params.cid);
    const productDeleted = await CartsController.deleteProductInCart(
      cartFounded,
      req.params.pid
    );
    res.send(new CartsDTO(productDeleted));
  } catch (error) {
    next(error);
  }
});

router.post("/:cid/purchase", async (req, res, next) => {
  try {
    const { products = [], email } = req.body;

    let allProducts = products.map((p) =>
      ProductsService.getById(p.product._id)
    );
    allProducts = await Promise.all(allProducts);

    let productsNotPurchased = [];
    let tickets = [];
    for (let product of allProducts) {
      const productRequested = products.find(
        (p) => p.product._id == String(product._id)
      );

      if (productRequested.quantity > product.stock) {
        productsNotPurchased.push({
          id: product._id,
          product: product.title,
          requestedQuantity: productRequested.quantity,
          reason: "Stock insuficiente",
        });
      } else {
        const updatedProducts = await ProductsService.updateById(product._id, {
          stock: product.stock - productRequested.quantity,
        });

        if (!updatedProducts.acknowledged) {
          logger.warning("Error al actualizar el stock del producto");
          return CustomError.create({
            name: "Error al actualizar el stock del producto",
            status: statusError.SERVER_ERROR,
            message: messageError.SERVER_ERROR,
          });
        }

        const ticket = await TicketsService.createTicket({
          amount: productRequested.quantity,
          purchaser: email,
        });

        tickets.push({
          idProduct: product._id,
          idTicket: ticket._id,
          product: product.title,
        });
      }
    }

    if (productsNotPurchased.length > 0) {
      logger.warning("Compra realizada parcialmente");
      return res.send({
        message: "Compra realizada parcialmente",
        productsNotPurchased,
        tickets,
      });
    }

    res.send({
      message: "Compra realizada exitosamente",
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

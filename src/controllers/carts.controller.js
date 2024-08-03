import CartsService from "../services/carts.service.js";

export default class CartsController {
  static getAll() {
    return CartsService.getAll();
  }

  static getById(cid) {
    return CartsService.getById(cid);
  }

  static createNewCart() {
    return CartsService.createNewCart();
  }

  static addProductOrIncreaseQuantity(cart, pid) {
    const productExist = cart.products.findIndex(
      (p) => p?.product?._id.toString() === pid
    );
    if (productExist === -1) {
      return CartsService.addProductToCart(cart, pid);
    } else {
      return CartsService.increaseQuantityOfProduct(cart, productExist);
    }
  }

  static updateById(cid, product) {
    return CartsService.updateById(cid, product);
  }

  static updateQuantityOfProduct(params, quantity, cart) {
    const productPosition = cart.products.findIndex(
      (p) => p.product._id.toString() === params.pid
    );
    if (productPosition != -1) {
      cart.products[productPosition].quantity = quantity;
      return CartsService.updateQuantityOfProduct(cart);
    }

    throw new Error("The Product is not in the Cart");
  }

  static deleteById(cid) {
    return CartsService.deleteById(cid);
  }

  static deleteProductInCart(cart, pid) {
    const productIndex = cart.products.findIndex(
      (prod) => prod?.product?._id.toString() === pid
    );
    if (productIndex != -1) {
      cart.products.splice(productIndex, 1);
      return CartsService.deleteProductInCart(cart);
    }
  }
}

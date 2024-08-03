import { cartsDAO } from "../dao/factory.js";

export default class CartsService {
  static getAll() {
    return cartsDAO.getAll();
  }

  static async getById(cid) {
    return await cartsDAO.getCartById(cid);
  }

  static createNewCart() {
    return cartsDAO.createNewCart();
  }

  static addProductToCart(cart, pid) {
    return cartsDAO.addProductToCart(cart, pid);
  }

  static increaseQuantityOfProduct(cart, product) {
    return cartsDAO.increaseQuantityOfProduct(cart, product);
  }

  static updateById(cid, product) {
    return cartsDAO.updateCart(cid, product);
  }

  static updateQuantityOfProduct(cart) {
    return cartsDAO.updateQuantityOfProduct(cart);
  }

  static deleteById(cid) {
    return cartsDAO.deleteCart(cid);
  }

  static deleteProductInCart(cart) {
    return cartsDAO.deleteProductInCart(cart);
  }
}

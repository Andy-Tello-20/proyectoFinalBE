import fs from "fs";

export default class CartsDAO {
  constructor() {
    this.id = 1;
    this.cartsArray = [];
    this.path = "./src/mocks/carts.json";
  }

  async getAll() {
    try {
      const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJSON);
      return carts;
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async createCart() {
    try {
      const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(cartsJSON);
      let cart = {};
      cart.id = carts.length + 1;
      cart.products = [];
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return carts;
    } catch {
      let cart = {};
      cart.id = this.id++;
      cart.products = [];
      await fs.promises.appendFile(this.path, JSON.stringify([cart]) + "\n");
      return cart;
    }
  }

  async getCartById(cid) {
    try {
      const cartJSON = await fs.promises.readFile(this.path, "utf-8");
      const allCart = JSON.parse(cartJSON);
      const cartId = allCart.find((cart) => cart.id == cid);
      if (!cartId) {
        throw new Error(`Cart not found with ID: ${cid}`);
      } else {
        return cartId;
      }
    } catch {
      throw new Error(`Cart not found with ID: ${cid}`);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cartJSON = await fs.promises.readFile(this.path, "utf8");
      const allCart = JSON.parse(cartJSON);
      const selectedCart = allCart.find((cart) => cart.id == cid);
      if (!selectedCart) {
        throw new Error(`Cart ID: ${cid} not found`);
      } else {
        const productIndex = selectedCart.products.findIndex(
          (product) => product.product === pid
        );
        if (productIndex === -1) {
          selectedCart.products.push({ product: pid, quantity: 1 });
        } else {
          selectedCart.products[productIndex].quantity++;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(allCart));
        return allCart;
      }
    } catch {
      throw new Error(`Cart ID: ${cid} not found`);
    }
  }
}

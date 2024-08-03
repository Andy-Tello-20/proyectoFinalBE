import { cartsMongo } from "../../models/index.js";
export default class CarstDAO {
  getAll() {
    try {
      return cartsMongo.find();
    } catch (error) {
      throw new Error();
    }
  }

  async getCartById(cid) {
    try {
      return await cartsMongo.findById(cid);
    } catch (error) {
      throw Error(error);
    }
  }

  createNewCart() {
    try {
      return cartsMongo.create({});
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCart(cart, pid) {
    try {
      cart.products.push({ product: pid, quantity: 1 });
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async increaseQuantityOfProduct(cart, pid) {
    try {
      cart.products[pid].quantity++;

      // console.log('cart.products[pid].quantity++ es: ',cart.products[pid].quantity)

      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteCart(cid) {
    try {
      return cartsMongo.findByIdAndDelete(cid);
    } catch (error) {
      throw Error(error);
    }
  }

  deleteProductInCart(cart) {
    return cartsMongo.findByIdAndUpdate(
      cart._id,
      {
        products: cart.products,
      },
      { new: true }
    );
  }

  async updateCart(cid, productsToUpdate) {
    try {
      const productsForUpdate = productsToUpdate.map((p) => ({
        product: p.id,
        quantity: p.quantity,
      }));

      const result = await cartsMongo.updateOne(
        { _id: cid },
        { $set: { products: productsForUpdate } }
      );

      return result;
    } catch (error) {
      throw new Error("Update failed");
    }
  }

  updateQuantityOfProduct(cart) {
    try {
      return cart.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}

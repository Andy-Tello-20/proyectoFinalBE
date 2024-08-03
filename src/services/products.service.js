import { productsDAO } from "../dao/factory.js";

export default class ProductsService {
  static getAll(filter, option) {
    return productsDAO.getAll(filter, option);
  }

  static async getById(pid) {
    return await productsDAO.getProductById(pid);
  }

  static addProduct(product) {
    return productsDAO.addProduct(product);
  }

  static updateById(id, product) {
    return productsDAO.updateProduct(id, product);
  }

  static deleteById(pid) {
    return productsDAO.deleteProduct(pid);
  }
}

import { productsMongo } from "../../models/index.js";

export default class ProductsDAO {
  getAll(filter, option) {
    try {
      return productsMongo.paginate(filter, option);
    } catch (error) {
      throw new Error();
    }
  }

  getProductById(pid) {
    try {
      return productsMongo.findById(pid);
    } catch (error) {
      throw Error(error);
    }
  }

  addProduct(product) {
    try {
      return productsMongo.create(product);
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteProduct(pid) {
    try {
      return productsMongo.deleteOne({
        _id: pid,
      });
    } catch (error) {
      throw Error(error);
    }
  }

  updateProduct(id, product) {
    try {
      return productsMongo.updateOne({ _id: id }, product);
    } catch {
      throw new Error("Update failed");
    }
  }
}

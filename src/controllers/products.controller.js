import ProductsService from "../services/products.service.js";

export default class ProductsController {
  static getAll(queries) {
    const {
      limit = 10,
      page = 1,
      sort,
      _id,
      title,
      description,
      code,
      status,
      price,
      stock,
      category,
    } = queries;
    const filter = {};
    _id && (filter._id = _id);
    title && (filter.title = title);
    description && (filter.description = description);
    code && (filter.code = code);
    price && (filter.price = price);
    status && (filter.status = status);
    stock && (filter.stock = stock);
    category && (filter.category = category);
    const option = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort && { price: sort === "asc" ? 1 : -1 },
    };
    return ProductsService.getAll(filter, option);
  }

  static getById(pid) {
    return ProductsService.getById(pid);
  }

  static addProduct(product) {
    return ProductsService.addProduct(product);
  }

  static updateById(id, product) {
    return ProductsService.updateById(id, product);
  }

  static deleteById(pid) {
    return ProductsService.deleteById(pid);
  }
}

import config from "../config/config.js";

export let cartsDAO;
export let productsDAO;
switch (config.PERSISTENCE) {
  case "mongoDB":
    const CartsDaoMongoDB = (await import("./db/carts/index.js")).default;
    const ProductsDaoMongoDB = (await import("./db/products/index.js")).default;
    cartsDAO = new CartsDaoMongoDB();
    productsDAO = new ProductsDaoMongoDB();
    console.log("persistencia: MongoDB");
    break;

  case "filesystem":
    const CartsDaoFileSystem = (await import("./filesystem/carts/index.js"))
      .default;
    cartsDAO = new CartsDaoFileSystem();
    const ProductsDaoFileSystem = (
      await import("./filesystem/products/index.js")
    ).default;
    productsDAO = new ProductsDaoFileSystem();
    cartsDAO = new CartsDaoFileSystem();
    console.log("persistencia: FileSystem");
    break;
}

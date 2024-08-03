export class ProductsInCartDTO {
  constructor(data) {
    this.id = data?._id || null;
    this.products = [];

    if (Array.isArray(data?.products) && data?.products.length > 0) {
      this.products = data.products.map((p) => ({
        id: p.product?._id || null,
        title: p.product?.title || null,
        description: p.product?.description || null,
        price: parseFloat(p.product?.price) || null,
        stock: parseInt(p.product?.stock, 10) || null,
        code: p.product?.code || null,
        category: p.product?.category || null,
        status: p.product?.status === 200 ? "Available" : "Not Available",
        images:
          Array.isArray(p.product?.thumbnail) && p.product.thumbnail.length > 0
            ? p.product.thumbnail.map((img) => ({ name: img }))
            : [],
        quantity: p.quantity || null,
      }));
    }
  }
}

export class CartsDTO {
  constructor(data) {
    this.id = data?._id || null;
    this.products = [];

    if (Array.isArray(data?.products)) {
      this.products = data?.products.map((p) => ({
        product: p?.product || null,
        quantity: p?.quantity || null,
      }));
    }
  }
}

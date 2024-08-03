export class AllProductsDTO {
  constructor(data) {
    this.payload = [];
    if (Array.isArray(data?.docs)) {
      this.payload = data?.docs.map((p) => ({
        ...new ProductDTO(p),
      }));
    }
    this.prevPage = data?.prevPage || null;
    this.totalPages = data?.totalPages || null;
    this.nextPage = data?.nextPage || null;
    this.page = data?.page || null;
    this.hasPrevPage = data?.hasPrevPage || null;
    this.hasNextPage = data?.hasNextPage || null;
    this.prevLink = data?.hasPrevPage || null;
    this.nextLink = data?.hasNextPage || null;
  }
}

export class ProductDTO {
  constructor(data) {
    this.id = data?._id || data?.id || null;
    this.title = data?.title || null;
    this.description = data?.description || null;
    this.price = parseFloat(data?.price) || null;
    this.stock = parseInt(data?.stock, 10) || null;
    this.code = data?.code || null;
    this.category = data?.category || null;
    this.status = data?.status === 200 ? "Available" : "Not Available";
    this.owner = data?.owner || "65711e75c1b4bd53f8c2e9fc";
    this.images =
      Array.isArray(data?.thumbnail) && data.thumbnail.length > 0
        ? data.thumbnail.map((img) => ({ name: img }))
        : [];
  }
}

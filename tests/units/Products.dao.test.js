import mongoose from "mongoose";
import Assert from "assert";
import ProductsDAO from "../../src/dao/db/products/index.js";

const assert = Assert.strict;

describe("Testing Products DAO", function () {
  before(async function () {
    await mongoose.connect(
      "mongodb+srv://andrest911:M3gPtTin1bfuAeSR@cluster0.nakuen6.mongodb.net/EcommerceProduction?retryWrites=true"
    );
    this.productsDAO = new ProductsDAO();
  });

  // afterEach(function() {});
  beforeEach(async function () {
    await mongoose.connection.collections.products.drop();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("To create an array", async function () {
    const res = await this.productsDAO.addProduct({
      title: "iphone13",
      description: "This is iPhone 13.",
      price: 950,
      category: "Electronics",
      code: "IW1",
      status: 200,
      stock: 25,
      thumbnail: [],
    });

    const expectedOwnerId = new mongoose.Types.ObjectId(
      "65711e75c1b4bd53f8c2e9fc"
    );
    assert.ok(res);
    assert.strictEqual(res.owner.toString(), expectedOwnerId.toString());
    assert.strictEqual(Array.isArray(res.thumbnail), true);
    assert.deepEqual(res.thumbnail, []);
    assert.deepEqual(res.code, "IW1");
  });
});

//1.25hs

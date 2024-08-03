import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        _id: false,
      },
    ],
    default: [],
  },
});

cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});

export const cartsMongo = mongoose.model(cartsCollection, cartsSchema);

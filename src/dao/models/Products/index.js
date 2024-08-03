import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Number,
  stock: Number,
  category: String,
  thumbnail: { type: Array, default: [] },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Referencia al modelo de usuarios
    default: new mongoose.Types.ObjectId("65711e75c1b4bd53f8c2e9fc"), //id del coderAdmin
  },
});

productSchema.plugin(mongoosePaginate);

export const productsMongo = mongoose.model(productsCollection, productSchema);

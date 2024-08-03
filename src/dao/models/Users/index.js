import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: String,
    role: { type: String, default: "user" },
    age: Number,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    documents: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    last_connection: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Users = mongoose.model(collection, schema);

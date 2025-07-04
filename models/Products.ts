import { IProduct } from "@/types";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema<IProduct>(
  {
    productName: {
      type: String,
      index: true,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      index: true,
      trim: true,
    },
    productDescription: {
      type: String,
    },
    barcode: {
      type: String,
      unique: true,
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],
    productImages: {
      type: [String],
      required: true
    },
    prices: {
      type: [Object],
    },
    packageSize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageSize"
    },
    otherAvailablePackageSize: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PackageSize",
      },
    ],
    ingredients: [
      {
        ingredient: {
          type: String,
          ref: "Ingredient",
        },

        ingredientQuantity: {
          type: String,
        },
      },
    ],
    productReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductReview",
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

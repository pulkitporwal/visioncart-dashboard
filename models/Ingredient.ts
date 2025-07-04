import { IIngredients } from "@/types";
import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema<IIngredients>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    commonUses: {
      type: [String], 
      default: [],
    },

    healthFlag: {
      type: String,
      enum: ["good", "neutral", "bad", "dangerous"],
      default: "neutral",
    },

    healthTags: {
      type: [String], 
      default: [],
    },
    sources: {
      type: [String], 
    },

    references: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const IngredientModel =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);

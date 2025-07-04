import { ICategory } from "@/types";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            index: true,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

export const CategoryModel =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

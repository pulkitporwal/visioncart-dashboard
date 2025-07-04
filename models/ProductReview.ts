import { IProductReview } from "@/types";
import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema<IProductReview>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true,
        },

        reviews: {
            1: {
                summarizedReview: { type: String },
                reviewRatingCount: { type: Number },
            },
            2: {
                summarizedReview: { type: String },
                reviewRatingCount: { type: Number },
            },
            3: {
                summarizedReview: { type: String },
                reviewRatingCount: { type: Number },
            },
            4: {
                summarizedReview: { type: String },
                reviewRatingCount: { type: Number },
            },
            5: {
                summarizedReview: { type: String },
                reviewRatingCount: { type: Number },
            },
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        averageRating: {
            type: Number,
            default: 0.0,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

export const ProductReviewModel = mongoose.models.ProductReview || mongoose.model("ProductReview", productReviewSchema);

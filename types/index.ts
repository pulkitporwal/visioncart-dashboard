import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId | string,
    fullName: string,
    userName: string,
    email: string,
    phoneNumber: string,
    avatarURL: string,
    isVerified: boolean,
    password: string,
    DOB: Date,
    gender: string,
    referralCode: string
}

export interface IAdminUser {
    _id: Types.ObjectId | string,
    fullName: string,
    email: string,
    phoneNumber: string,
    permissions: [Types.ObjectId],
    role: string,
    password: string,
    isActive: boolean,
    avatarURL: string,
}

export interface IRetailer {
    _id: Types.ObjectId | string,
    businessName: string,
    businessAddress: string,
}

export interface IProduct {
    _id: Types.ObjectId | string,
    productName: string,
    productDescription: string,
    brand: string,
    barcode: string,
    category: [Types.ObjectId],
    productImages: [string],
    prices: [{ platform: string, price: string }],
    packageSize: Types.ObjectId,
    otherAvailablePackageSize: [Types.ObjectId],
    ingredients: [{ ingredient: Types.ObjectId, ingredientQuantity: string }],
    productReview: Types.ObjectId
}

export interface ICategory {
    _id: Types.ObjectId | string,
    name: string,
    description: string,
}

export interface IPackageSize {
    _id: Types.ObjectId | string,
    sizeName: string,
    sizeValue: string,
    sizeUnit: string,
}

export interface IIngredients {
    _id: Types.ObjectId | string,
    name: string,
    description: string,
    commonUses: [string],
    healthFlag: string,
    healthTags: [string],
    sources: [string],
    references: [string]
}

export interface IProductReview {
    _id: Types.ObjectId | string,
    productId: Types.ObjectId | string,
    reviews: { 1: { summarizedReview: string, reviewRatingCount: number }, 2: { summarizedReview: string, reviewRatingCount: number }, 3: { summarizedReview: string, reviewRatingCount: number }, 4: { summarizedReview: string, reviewRatingCount: number }, 5: { summarizedReview: string, reviewRatingCount: number } },
    totalReviews: number,
    averageRating: number
}

export interface IActivity {
    _id: Types.ObjectId | string,
    userId: Types.ObjectId;
    activityType: string;
    description: string;
    metadata: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }

export interface IPermission {
    _id: Types.ObjectId | string,
    title: string,
    description: string
}
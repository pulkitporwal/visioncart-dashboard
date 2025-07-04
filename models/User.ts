import { IUser } from "@/types";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    avatarURL: {
      type: String,
    },
    referralCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

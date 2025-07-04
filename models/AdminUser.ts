import { IAdminUser } from "@/types";
import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema<IAdminUser>(
  {
    fullName: {
      type: String,
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
    avatarURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "manager"],
      default: "manager",
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminUserModel =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);

import { IPermission } from "@/types";
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema<IPermission>(
  {
    title: {
      type: String,
      unique: true,
      index: true,
      uppercase: true,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PermissionModel =
  mongoose.models.Permission || mongoose.model("Permission", permissionSchema);

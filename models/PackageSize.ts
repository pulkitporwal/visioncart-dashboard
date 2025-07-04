import { IPackageSize } from "@/types";
import mongoose from "mongoose";

const packageSizeSchema = new mongoose.Schema<IPackageSize>({
  sizeName: {
    type: String,
    index: true,
    required: true,
  },
  sizeValue: {
    type: String,
  },
  sizeUnit: {
    type: String,
  },
});


export const PackageSizeModel =
  mongoose.models.PackageSize || mongoose.model("PackageSize", packageSizeSchema);

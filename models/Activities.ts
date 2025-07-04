import { IActivity } from "@/types";
import mongoose, { Schema, Document, Types } from "mongoose";


const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'userType'
    },
    activityType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ activityType: 1, createdAt: -1 });

export const ActivityModel = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);

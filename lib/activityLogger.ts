import { ActivityModel } from "@/models/Activities";
import { dbConnect } from "./dbConnect";

export interface ActivityLogData {
  userId: string;
  activityType: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(activityData: ActivityLogData) {
  try {
    await dbConnect();
    const activity = await ActivityModel.create(activityData);
    return activity;
  } catch (error) {
    console.error("Error logging activity:", error);
    return null;
  }
}

export function getClientInfo(request: Request) {
  const headers = request.headers;
  const userAgent = headers.get('user-agent') || '';
  
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';
  
  return { ipAddress: ip, userAgent };
}

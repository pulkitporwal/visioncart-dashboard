
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "./dbConnect";
import { PermissionModel } from "@/models/Permission";
import { AdminUserModel } from "@/models/AdminUser";

export const getCurrentUserWithPermissions = async () => {
  await dbConnect();

  const permissionModelName = PermissionModel.modelName;

  const session = await getServerSession(authOptions);

  const userId = session?.user?.id
  if (!userId) return null;


  const user = await AdminUserModel.findById(userId).populate("permissions").select("-password -isActive");

  return user;
};

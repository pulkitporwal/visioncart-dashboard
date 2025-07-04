import { getClientInfo, logActivity } from "@/lib/activityLogger";
import { checkAnyPermission, createAnyPermissionErrorResponse } from "@/lib/checkPermissions";
import { dbConnect } from "@/lib/dbConnect";
import { getCurrentUserWithPermissions } from "@/lib/getCurrentUserPermissions";
import { PackageSizeModel } from "@/models/PackageSize";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUserWithPermissions();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const packageSizes = await PackageSizeModel.find({}).sort({ sizeName: 1 });

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "PACKAGE_SIZE_VIEW",
      description: "Viewed all package sizes",
      metadata: { count: packageSizes?.length },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: packageSizes,
      msg: "Package sizes fetched successfully" 
    });
  } catch (error) {
    console.error("Error fetching package sizes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch package sizes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const currentUser = await getCurrentUserWithPermissions();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permissions for package size creation
    if (currentUser.role !== "super-admin") {
      const permissionCheck = await checkAnyPermission(["PACKAGE_SIZE_CREATE"]);
      if (!permissionCheck.hasPermission) {
        return NextResponse.json(
          createAnyPermissionErrorResponse(
            ["PACKAGE_SIZE_CREATE"],
            permissionCheck.permissions
          ),
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { sizeName, sizeValue, sizeUnit } = body;

    // Validate required fields
    if (!sizeName) {
      return NextResponse.json(
        { success: false, error: "Size name is required" },
        { status: 400 }
      );
    }

    // Create new package size
    const newPackageSize = new PackageSizeModel({
      sizeName,
      sizeValue,
      sizeUnit,
    });

    const savedPackageSize = await newPackageSize.save();

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "PACKAGE_SIZE_CREATE",
      description: `Created package size: ${sizeName}`,
      metadata: { packageSizeId: savedPackageSize._id, sizeName },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: savedPackageSize,
      msg: "Package size created successfully" 
    });
  } catch (error) {
    console.error("Error creating package size:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create package size" },
      { status: 500 }
    );
  }
} 
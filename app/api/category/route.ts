import { getClientInfo, logActivity } from "@/lib/activityLogger";
import { checkAnyPermission, createAnyPermissionErrorResponse } from "@/lib/checkPermissions";
import { dbConnect } from "@/lib/dbConnect";
import { getCurrentUserWithPermissions } from "@/lib/getCurrentUserPermissions";
import { CategoryModel } from "@/models/Category";
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

    const categories = await CategoryModel.find({}).sort({ name: 1 });

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "CATEGORY_VIEW",
      description: "Viewed all categories",
      metadata: { count: categories?.length },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: categories,
      msg: "Categories fetched successfully" 
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
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

    // Check permissions for category creation
    if (currentUser.role !== "super-admin") {
      const permissionCheck = await checkAnyPermission(["CATEGORY_CREATE"]);
      if (!permissionCheck.hasPermission) {
        return NextResponse.json(
          createAnyPermissionErrorResponse(
            ["CATEGORY_CREATE"],
            permissionCheck.permissions
          ),
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = new CategoryModel({
      name: name.toLowerCase(),
      description,
    });

    const savedCategory = await newCategory.save();

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "CATEGORY_CREATE",
      description: `Created category: ${name}`,
      metadata: { categoryId: savedCategory._id, categoryName: name },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: savedCategory,
      msg: "Category created successfully" 
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
} 
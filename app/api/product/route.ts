import { getClientInfo, logActivity } from "@/lib/activityLogger";
import { checkAnyPermission, createAnyPermissionErrorResponse } from "@/lib/checkPermissions";
import { dbConnect } from "@/lib/dbConnect";
import { getCurrentUserWithPermissions } from "@/lib/getCurrentUserPermissions";
import { CategoryModel } from "@/models/Category";
import { IngredientModel } from "@/models/Ingredient";
import { PackageSizeModel } from "@/models/PackageSize";
import { ProductReviewModel } from "@/models/ProductReview";
import { ProductModel } from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
      await dbConnect();
  
      const currentUser = await getCurrentUserWithPermissions();

      console.log(currentUser)

      if (!currentUser) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      PackageSizeModel.modelName
      CategoryModel.modelName
      IngredientModel.modelName
      ProductReviewModel.modelName
  
      const baseQuery = ProductModel.find({})
        .sort({ createdAt: -1 })
        .populate("packageSize", "sizeName sizeValue sizeUnit")
        .populate("otherAvailablePackageSize", "sizeName sizeValue sizeUnit")
        .populate("category", "name")
        .populate("ingredients.ingredient", "name")
        .populate("productReview"); 
  
      let product;
  
      if (currentUser.role === "super-admin") {
        product = await baseQuery.exec();
  
        await logActivity({
          userId: currentUser._id.toString(),
          activityType: "PRODUCT_VIEW",
          description: "Viewed all products (Super Admin)",
          metadata: { count: product?.length },
          ...getClientInfo(request),
        });
  
        return NextResponse.json({ success: true, data: product , msg: "Products Fetched Successfully"});
      }
  
      if (currentUser.role === "admin" || currentUser.role === "manager") {
        const permissionCheck = await checkAnyPermission(["PRODUCT_VIEW"]);
        if (!permissionCheck.hasPermission) {
          return NextResponse.json(
            createAnyPermissionErrorResponse(
              ["PRODUCT_VIEW"],
              permissionCheck.permissions
            ),
            { status: 403 }
          );
        }
  
        product = await baseQuery.exec();
  
        await logActivity({
          userId: currentUser._id.toString(),
          activityType: "PRODUCT_VIEW",
          description: "Viewed all products (Admin/Manager)",
          metadata: { count: product?.length },
          ...getClientInfo(request),
        });
  
        return NextResponse.json({ success: true, data: product });
      }
  
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch products" },
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

    // Check permissions for product creation
    if (currentUser.role !== "super-admin") {
      const permissionCheck = await checkAnyPermission(["PRODUCT_CREATE"]);
      if (!permissionCheck.hasPermission) {
        return NextResponse.json(
          createAnyPermissionErrorResponse(
            ["PRODUCT_CREATE"],
            permissionCheck.permissions
          ),
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      productName,
      productDescription,
      brand,
      barcode,
      category,
      productImages,
      prices,
      packageSize,
      otherAvailablePackageSize,
      ingredients,
    } = body;

    // Validate required fields
    if (!productName) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = new ProductModel({
      productName,
      productDescription,
      brand,
      barcode,
      category: category || [],
      productImages: productImages || [],
      prices: prices || [],
      packageSize: packageSize || null,
      otherAvailablePackageSize: otherAvailablePackageSize || [],
      ingredients: ingredients || [],
    });

    const savedProduct = await newProduct.save();

    console.log((savedProduct))

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "PRODUCT_CREATE",
      description: `Created product: ${productName}`,
      metadata: { productId: savedProduct._id, productName },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: savedProduct,
      msg: "Product created successfully" 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
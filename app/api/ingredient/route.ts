import { getClientInfo, logActivity } from "@/lib/activityLogger";
import { checkAnyPermission, createAnyPermissionErrorResponse } from "@/lib/checkPermissions";
import { dbConnect } from "@/lib/dbConnect";
import { getCurrentUserWithPermissions } from "@/lib/getCurrentUserPermissions";
import { IngredientModel } from "@/models/Ingredient";
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

    const ingredients = await IngredientModel.find({}).sort({ name: 1 });

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "INGREDIENT_VIEW",
      description: "Viewed all ingredients",
      metadata: { count: ingredients?.length },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: ingredients,
      msg: "Ingredients fetched successfully" 
    });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ingredients" },
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

    // Check permissions for ingredient creation
    if (currentUser.role !== "super-admin") {
      const permissionCheck = await checkAnyPermission(["INGREDIENT_CREATE"]);
      if (!permissionCheck.hasPermission) {
        return NextResponse.json(
          createAnyPermissionErrorResponse(
            ["INGREDIENT_CREATE"],
            permissionCheck.permissions
          ),
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      commonUses, 
      healthFlag, 
      healthTags, 
      sources, 
      references 
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Ingredient name is required" },
        { status: 400 }
      );
    }

    // Check if ingredient already exists
    const existingIngredient = await IngredientModel.findOne({ name: name.toLowerCase() });
    if (existingIngredient) {
      return NextResponse.json(
        { success: false, error: "Ingredient already exists" },
        { status: 400 }
      );
    }

    // Create new ingredient
    const newIngredient = new IngredientModel({
      name: name.toLowerCase(),
      description,
      commonUses: commonUses || [],
      healthFlag: healthFlag || "neutral",
      healthTags: healthTags || [],
      sources: sources || [],
      references: references || [],
    });

    const savedIngredient = await newIngredient.save();

    await logActivity({
      userId: currentUser._id.toString(),
      activityType: "INGREDIENT_CREATE",
      description: `Created ingredient: ${name}`,
      metadata: { ingredientId: savedIngredient._id, ingredientName: name },
      ...getClientInfo(request),
    });

    return NextResponse.json({ 
      success: true, 
      data: savedIngredient,
      msg: "Ingredient created successfully" 
    });
  } catch (error) {
    console.error("Error creating ingredient:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ingredient" },
      { status: 500 }
    );
  }
} 
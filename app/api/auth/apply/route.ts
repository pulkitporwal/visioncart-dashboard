import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { AdminUserModel } from "@/models/AdminUser";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { fullName, email, password, phoneNumber, role, notes } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await AdminUserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const validRoles = ["manager", "admin"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await AdminUserModel.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      role: role || "manager",
      notes: notes || "",
      isActive: false,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully. A super admin will review and activate your account.",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 
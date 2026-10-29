import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const staffList = await db.user.findMany({
      where: {
        role: UserRole.STAFF,
      },
      include: {
        staffPermission: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = staffList.map((staff) => ({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      createdAt: staff.createdAt,
      permissions: staff.staffPermission?.permissions || [],
    }));

    return NextResponse.json({ success: true, staff: formatted });
  } catch (error: any) {
    console.error("Error fetching staff list:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff members" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId, password, permissions } = body;

    if (!name || !userId || !password) {
      return NextResponse.json(
        { success: false, error: "Name, User ID/Email, and Password are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one feature permission for this staff." },
        { status: 400 }
      );
    }

    // Format email: If user enters just a username like 'counselor1', append '@admissionhere.in'
    const email = userId.includes("@")
      ? userId.trim().toLowerCase()
      : `${userId.trim().toLowerCase()}@admissionhere.in`;

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A user with User ID / Email "${email}" already exists.` },
        { status: 409 }
      );
    }

    // Hash the password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and staff permission record
    const newStaff = await db.user.create({
      data: {
        name: name.trim(),
        email,
        passwordHash,
        role: UserRole.STAFF,
        staffPermission: {
          create: {
            permissions,
          },
        },
      },
      include: {
        staffPermission: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Staff account created successfully.",
        staff: {
          id: newStaff.id,
          name: newStaff.name,
          email: newStaff.email,
          permissions: newStaff.staffPermission?.permissions || [],
          createdAt: newStaff.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create staff member." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff user ID is required." },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Staff account deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete staff member." },
      { status: 500 }
    );
  }
}


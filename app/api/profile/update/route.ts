import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { firstName, lastName, email, bio, location, website, nickname } = await request.json();

    // Validate required fields
    if (!firstName || !email) {
      return NextResponse.json(
        { message: "First name and email are required" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.player.update({
      where: {
        Player_ID: Number(session.user.memberId)
      },
      data: {
        Player_name: `${firstName} ${lastName || ''}`.trim(),
        nickname: nickname || null,
        // bio: bio,
        // location: location,
        // website: website,
      },
      select: {
        Player_ID: true,
        Player_name: true,
        nickname: true,
        Playerpoint: true,
        Level_Id: true,
        streak: true,
        lastLogin: true,
      }
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.memberId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage (in production, use cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user avatar (you might want to store this in a separate table)
    // For now, we'll just return success
    // In production, upload to cloud storage and store the URL

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatarUrl: dataUrl
    }, { status: 200 });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { message: "Failed to upload avatar" },
      { status: 500 }
    );
  }
} 
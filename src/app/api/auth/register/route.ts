import { connectDB } from "@libs/db/mongoose";
import User from "@libs/db/models/user-model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create MD5 hash of email for Gravatar
    const emailHash = crypto
      .createHash('md5')
      .update(email.toLowerCase().trim())
      .digest('hex');

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: `https://www.gravatar.com/avatar/${emailHash}?d=mp&s=200`, // Default avatar with size
    });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
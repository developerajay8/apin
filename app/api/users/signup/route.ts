import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

/* --------------------------------------------------
   Types
-------------------------------------------------- */

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
}

/* --------------------------------------------------
   POST Route
-------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body: SignupRequestBody = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Send OTP email
    await sendEmail({
      email,
      emailType: "OTP",
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "Signup successful. OTP sent to email",
      success: true,
      email,
    });

  } catch (error: unknown) {

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect(); // ✅ inside function

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("Signup body:", reqBody);

    const user = await User.findOne({ email });
    if (user) {
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

    // ✅ Send OTP
    await sendEmail({
      email,
      emailType: "OTP",
      userId: savedUser._id,
    });

    // ✅ fetch updated user (to confirm otp saved)
    const updatedUser = await User.findById(savedUser._id);
    console.log("Updated user after OTP:", updatedUser);

    return NextResponse.json({
      message: "Signup success. OTP sent to email",
      success: true,
      email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




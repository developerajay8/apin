import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       1️⃣ Exchange code → access_token + id_token
    -------------------------------------------------- */
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       2️⃣ Get user info from Google
    -------------------------------------------------- */
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { id, email, name, picture } = userInfoResponse.data;

    if (!email) {
      return NextResponse.json(
        { error: "Google account has no email" },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       3️⃣ Check if user already exists
    -------------------------------------------------- */
    let user = await User.findOne({ email });

    if (!user) {
      // 🆕 New Google user → create account
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        provider: "google",
        googleId: id,
        profileImage: picture,
        isVerified: true, // ✅ Google users auto-verified
      });
    }

    /* --------------------------------------------------
       4️⃣ Generate JWT (same as your normal login)
    -------------------------------------------------- */
    const tokenData = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    /* --------------------------------------------------
       5️⃣ Set cookie & return response
    -------------------------------------------------- */
    const response = NextResponse.json({
      message: "Google login successful",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error.response?.data || error.message);

    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }
}

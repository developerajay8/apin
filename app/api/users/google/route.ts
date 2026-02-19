import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

/* --------------------------------------------------
   Types
-------------------------------------------------- */

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

/* --------------------------------------------------
   POST Route
-------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body: { code: string } = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    /* --------------------------------------------------
       1️⃣ Exchange code → access_token
    -------------------------------------------------- */
    const tokenResponse = await axios.post<GoogleTokenResponse>(
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
    const userInfoResponse = await axios.get<GoogleUserInfo>(
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
       3️⃣ Find or Create User
    -------------------------------------------------- */
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        provider: "google",
        googleId: id,
        profileImage: picture,
        isVerified: true,
      });
    }

    /* --------------------------------------------------
       4️⃣ Generate JWT
    -------------------------------------------------- */
    const tokenData: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin ?? false,
    };

    const token = jwt.sign(
      tokenData,
      process.env.TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    /* --------------------------------------------------
       5️⃣ Set Cookie & Return Response
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

  } catch (error: unknown) {

    if (axios.isAxiosError(error)) {
      console.error(
        "Google Auth Axios Error:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Google Auth Error:", error.message);
    } else {
      console.error("Unknown Google Auth Error");
    }

    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }
}

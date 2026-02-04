"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Google login handler
  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  // Google OAuth callback: code milne ke baad API call karna
  useEffect(() => {
    if (!code) return;

    const googleAuth = async () => {
      try {
        setLoading(true);
        await axios.post("/api/users/google", { code });
        router.push("/profile");
      } catch (error) {
        console.error("Google login failed", error);
      } finally {
        setLoading(false);
      }
    };

    googleAuth();
  }, [code]);

  const onLogin = async () => {
    try {
      setLoading(true);
      setEmailError("");
      setPasswordError("");

      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);

      router.push("/profile");
    } catch (error: any) {
      console.log("Login failed", error);

      const errMsg = error.response?.data?.error;

      if (errMsg === "User not found") {
        setEmailError("Email not found");
      } else if (errMsg === "Invalid password") {
        setPasswordError("Incorrect password");
      } else if (errMsg === "Please verify your OTP first") {
        setEmailError("Please verify your OTP first");
      } else {
        setEmailError("Something went wrong. Try again");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {loading ? "Processing..." : "Login"}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Enter your credentials to continue
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-4 rounded-xl py-3 bg-white text-black font-semibold transition active:scale-[0.98]"
        >
          Continue with Google
        </button>

        <hr className="border-white/10 mb-6" />

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            type="email"
            className={`w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition
              ${emailError ? "border-red-500" : "border-white/10"}`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            type="password"
            className={`w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition
              ${passwordError ? "border-red-500" : "border-white/10"}`}
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div className="flex items-end justify-end pb-3">
          <Link
            // href="/forgotpassword"
                href="/forgot-password"
            className="text-sm text-gray-300 hover:text-white underline underline-offset-4 transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          onClick={onLogin}
          disabled={buttonDisabled || loading}
          className={`w-full rounded-xl py-3 cursor-pointer font-semibold transition active:scale-[0.98]
            ${
              buttonDisabled || loading
                ? "bg-white/10 text-gray-400 cursor-not-allowed border border-white/10"
                : "bg-white text-black hover:bg-gray-200"
            }`}
        >
          {loading ? "Please wait..." : buttonDisabled ? "No Login" : "Login"}
        </button>

        {/* Link */}
        <div className="mt-5 text-center">
          <Link
            href="/signup"
            className="text-sm text-gray-300 hover:text-white underline underline-offset-4 transition"
          >
            Visit Signup page
          </Link>
        </div>
      </div>
    </div>
  );
}

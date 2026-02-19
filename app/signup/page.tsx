"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* --------------------------------------------------
   Types
-------------------------------------------------- */

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);

      toast.success("OTP sent to your email");

      router.push(`/verify-otp?email=${encodeURIComponent(user.email)}`);

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { error?: string })?.error ||
          "Signup failed";
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {loading ? "Processing..." : "Signup"}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Create your account to continue
          </p>
        </div>

        <hr className="border-white/10 mb-6" />

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Username
          </label>
          <input
            value={user.username}
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
            placeholder="Enter your username"
            type="text"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Email
          </label>
          <input
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
            placeholder="Enter your email"
            type="email"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Password
          </label>
          <input
            value={user.password}
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            placeholder="Enter your password"
            type="password"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 transition"
          />
        </div>

        <button
          onClick={onSignup}
          disabled={buttonDisabled || loading}
          className={`w-full rounded-xl py-3 font-semibold transition active:scale-[0.98]
            ${
              buttonDisabled || loading
                ? "bg-white/10 text-gray-400 cursor-not-allowed border border-white/10"
                : "bg-white text-black hover:bg-gray-200"
            }`}
        >
          {loading ? "Please wait..." : "Signup"}
        </button>

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white underline underline-offset-4 transition"
          >
            Visit login page
          </Link>
        </div>
      </div>
    </div>
  );
}

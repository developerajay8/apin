"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setButtonDisabled(email.length === 0);
  }, [email]);

  const onSendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      await axios.post("/api/users/forgotpassword-otp", { email });

      setSuccessMsg("OTP sent to your email!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);

    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { error?: string })?.error ||
          "Something went wrong";
        setError(msg);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {loading ? "Processing..." : "Forgot Password"}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email to receive OTP
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            className={`w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition
              ${error ? "border-red-500" : "border-white/10"}`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {successMsg && (
            <p className="text-green-400 text-sm mt-1">{successMsg}</p>
          )}
        </div>

        <button
          onClick={onSendOtp}
          disabled={buttonDisabled || loading}
          className={`w-full rounded-xl py-3 cursor-pointer font-semibold transition active:scale-[0.98]
            ${
              buttonDisabled || loading
                ? "bg-white/10 text-gray-400 cursor-not-allowed border border-white/10"
                : "bg-white text-black hover:bg-gray-200"
            }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}

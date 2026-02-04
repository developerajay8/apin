"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post("/api/users/verifyotp", {
        email,
        otp,
      });

      setMsg(res.data.message || "OTP Verified Successfully ✅");

      router.push("/login");
    } catch (error: any) {
      setMsg(error?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">OTP</label>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {msg && (
          <p className="mt-4 text-center text-sm text-red-600">{msg}</p>
        )}
      </div>
    </div>
  );
}

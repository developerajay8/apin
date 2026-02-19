"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ResetForm {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [form, setForm] = useState<ResetForm>({
    email: emailFromQuery,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setForm((prev) => ({ ...prev, email: emailFromQuery }));
  }, [emailFromQuery]);

  useEffect(() => {
    const ok =
      form.email &&
      form.otp &&
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword === form.confirmPassword;

    setButtonDisabled(!ok);
  }, [form]);

  const onResetPassword = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      if (form.newPassword !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await axios.post("/api/users/resetpassword-otp", form);

      setSuccessMsg("Password reset successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: unknown) {
      // ✅ Type-safe error handling
      if (axios.isAxiosError(err)) {
        setError(
          (err.response?.data as { error?: string })?.error ||
            "Something went wrong"
        );
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
            {loading ? "Processing..." : "Reset Password"}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Enter OTP and set new password
          </p>
        </div>

        {/* OTP */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            OTP
          </label>
          <input
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
            placeholder="Enter OTP"
            type="text"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition"
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            New Password
          </label>
          <input
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
            placeholder="Enter new password"
            type="password"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Confirm Password
          </label>
          <input
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            placeholder="Confirm password"
            type="password"
            className={`w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition
              ${
                form.confirmPassword &&
                form.newPassword !== form.confirmPassword
                  ? "border-red-500"
                  : "border-white/10"
              }`}
          />
          {form.confirmPassword &&
            form.newPassword !== form.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {successMsg && (
          <p className="text-green-400 text-sm mb-3">{successMsg}</p>
        )}

        <button
          onClick={onResetPassword}
          disabled={buttonDisabled || loading}
          className={`w-full rounded-xl py-3 cursor-pointer font-semibold transition active:scale-[0.98]
            ${
              buttonDisabled || loading
                ? "bg-white/10 text-gray-400 cursor-not-allowed border border-white/10"
                : "bg-white text-black hover:bg-gray-200"
            }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

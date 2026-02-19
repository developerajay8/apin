"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<string>("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/me");
      console.log(res.data.data._id);
      setData(res.data.data._id);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response?.data as { error?: string })?.error ||
            "Failed to fetch user"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch user");
      }
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout success");
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response?.data as { error?: string })?.error ||
            "Logout failed"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Logout failed");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
        Profile page
      </h1>

      <hr className="w-full max-w-md my-6 border-white/10" />

      <h2 className="text-base sm:text-lg font-medium text-gray-200">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link
            href={`/profile/${data}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-white hover:bg-white/15 transition active:scale-[0.98]"
          >
            {data}
          </Link>
        )}
      </h2>

      <hr className="w-full max-w-md my-6 border-white/10" />

      <button
        onClick={logout}
        className="w-full max-w-md cursor-pointer rounded-xl bg-white px-5 py-3 text-sm sm:text-base font-semibold text-black hover:bg-gray-200 transition active:scale-[0.98]"
      >
        logout
      </button>

      <button
        onClick={getUserDetails}
        className="w-full max-w-md mt-2 cursor-pointer rounded-xl bg-white px-5 py-3 text-sm sm:text-base font-semibold text-black hover:bg-gray-200 transition active:scale-[0.98]"
      >
        Get user details
      </button>
    </div>
  );
}

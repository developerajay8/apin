"use client";
import axios from 'axios';
import { log } from 'console';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing")

    const getUserDetails = async () => {
        const res = await axios.post("/api/users/me")
        console.log(res.data.data._id);
        setData(res.data.data._id)
        
    }

    const logout = async () => {
        try {
            await axios.get("/api/users/logout")
            toast.success("logout success")
            router.push("/login")
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }  
  return (
    // <div>
    //     <h1>Profile page</h1>
    //     <hr />
    //     <h2>{data === "nothing" ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
    //     <hr />
    //     <button onClick={logout}>logout</button>
    // </div>

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


//     <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black px-4">
//   <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-10">
    
//     {/* Header */}
//     <div className="text-center">
//       <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
//         Profile Page
//       </h1>
//       <p className="mt-2 text-sm text-gray-300">
//         Welcome back! Manage your profile & session here.
//       </p>
//     </div>

//     <div className="my-6 h-[1] w-full bg-white/10" />

//     {/* Profile Info Card */}
//     <div className="rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6">
//       <p className="text-xs uppercase tracking-widest text-gray-400">
//         Profile ID / User
//       </p>

//       <div className="mt-2">
//         {data === "nothing" ? (
//           <h2 className="text-base sm:text-lg font-semibold text-gray-300">
//             Nothing
//           </h2>
//         ) : (
//           <Link
//             href={`/profile/${data}`}
//             className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm sm:text-base font-semibold text-white hover:bg-white/15 transition active:scale-[0.98]"
//           >
//             <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
//             {data}
//           </Link>
//         )}
//       </div>

//       <p className="mt-3 text-xs text-gray-400">
//         Click your ID to open detailed profile page.
//       </p>
//     </div>

//     <div className="my-6 h-[1] w-full bg-white/10" />

//     {/* Logout Button */}
//     <button
//       onClick={logout}
//       className="w-full rounded-xl bg-white px-5 py-3 text-sm sm:text-base font-semibold text-black hover:bg-gray-200 transition active:scale-[0.98]"
//     >
//       Logout
//     </button>

//     {/* Footer */}
//     <p className="mt-5 text-center text-xs text-gray-400">
//       Secure session enabled • You can logout anytime
//     </p>
//   </div>
// </div>

  )
}

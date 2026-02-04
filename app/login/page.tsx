import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}

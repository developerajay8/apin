import { Suspense } from "react";
import VerifyOtpPage from "./VerifyOtpPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}

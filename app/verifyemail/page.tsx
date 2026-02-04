import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmailPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}

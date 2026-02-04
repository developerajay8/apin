import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}

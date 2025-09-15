import { Suspense } from "react";
import ResetPasswordPage from "./ResetPass";

export default function Page({ searchParams }) {
  // You could also read token directly here (server-side):
  const token = searchParams?.token;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage token={token} />
    </Suspense>
  );
}

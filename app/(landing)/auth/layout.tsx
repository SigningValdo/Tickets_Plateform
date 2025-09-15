"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return null;
  }

  if (session.data?.user.role === "ADMIN") {
    return router.push("/admin/dashboard");
  }
  return children;
}

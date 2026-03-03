"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status !== "loading" && session.data?.user.role === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [session.status, session.data, router]);

  if (session.status === "loading") {
    return null;
  }

  if (session.data?.user.role === "ADMIN") {
    return null;
  }

  return children;
}

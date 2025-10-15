import type { PropsWithChildren } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-1 mt-[100px]">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

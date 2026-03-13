import type { PropsWithChildren } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <SiteHeader />
      <main className="flex-1 mt-[90px]">{children}</main>
      <SiteFooter />
    </div>
  );
}

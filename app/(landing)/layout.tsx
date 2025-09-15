import React from "react";
import { SiteLayout } from "@/components/site-layout";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SiteLayout>{children}</SiteLayout>
    </div>
  );
};

export default layout;

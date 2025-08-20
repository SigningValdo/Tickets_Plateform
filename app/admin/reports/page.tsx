"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ReportsOverview } from "@/components/admin/reports-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Rapports et analyses
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualisez et analysez les performances de votre plateforme
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques générales</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsOverview />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

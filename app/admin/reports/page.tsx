"use client";

import { ReportsOverview } from "@/components/admin/reports-overview";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Rapports et analyses</h1>
        <p className="text-gris2 text-sm mt-0.5">
          Visualisez et analysez les performances de votre plateforme
        </p>
      </div>

      <ReportsOverview />
    </div>
  );
}

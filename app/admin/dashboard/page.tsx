"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  Calendar,
  Users,
  Loader2,
  BarChart3,
  Tag,
} from "lucide-react";
import { AdminSalesChart } from "@/components/admin-sales-chart";

interface DashboardData {
  stats: {
    revenue: { value: number; change: string; trend: "up" | "down" };
    ticketsSold: { value: number; change: string; trend: "up" | "down" };
    activeEvents: { value: number; change: string; trend: "up" | "down" };
    users: { value: number; change: string; trend: "up" | "down" };
  };
  dailySales: { date: string; total: number }[];
  categories: { name: string; total: number; percentage: number }[];
}

const CATEGORY_COLORS = [
  "bg-green",
  "bg-blue-500",
  "bg-yellow",
  "bg-purple-500",
  "bg-gris3",
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Erreur lors du chargement des données");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red text-sm">{error || "Erreur de chargement"}</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Ventes totales",
      value: formatCurrency(data.stats.revenue.value),
      change: data.stats.revenue.change,
      trend: data.stats.revenue.trend,
      icon: DollarSign,
      iconBg: "bg-green/10",
      iconColor: "text-green",
    },
    {
      label: "Billets vendus",
      value: data.stats.ticketsSold.value.toLocaleString("fr-FR"),
      change: data.stats.ticketsSold.change,
      trend: data.stats.ticketsSold.trend,
      icon: Ticket,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      label: "Événements actifs",
      value: data.stats.activeEvents.value.toString(),
      change: data.stats.activeEvents.change,
      trend: data.stats.activeEvents.trend,
      icon: Calendar,
      iconBg: "bg-yellow/10",
      iconColor: "text-yellow",
    },
    {
      label: "Utilisateurs",
      value: data.stats.users.value.toLocaleString("fr-FR"),
      change: data.stats.users.change,
      trend: data.stats.users.trend,
      icon: Users,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
  ];

  const totalCategorySales = data.categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Tableau de bord</h1>
        <p className="text-gris2 text-sm mt-0.5">
          Bienvenue dans votre espace administrateur
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 flex items-start justify-between"
          >
            <div className="space-y-2">
              <p className="text-xs font-medium text-gris2">{stat.label}</p>
              <p className="text-xl font-bold text-navy">{stat.value}</p>
              <div className="flex items-center gap-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red" />
                )}
                <span
                  className={`text-xs font-medium ${stat.trend === "up" ? "text-green" : "text-red"}`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-gris3">ce mois</span>
              </div>
            </div>
            <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">
                Ventes des 30 derniers jours
              </h3>
            </div>
          </div>
          <AdminSalesChart data={data.dailySales} />
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-5 w-5 text-green" />
            <h3 className="text-sm font-semibold text-navy">
              Ventes par catégorie
            </h3>
          </div>
          <div className="space-y-4">
            {data.categories.length === 0 ? (
              <p className="text-sm text-gris2 text-center py-4">
                Aucune donnée disponible
              </p>
            ) : (
              data.categories.map((cat, index) => (
                <div key={cat.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-navy">{cat.name}</span>
                    <span className="text-sm font-medium text-navy">
                      {cat.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-bg rounded-full h-2">
                    <div
                      className={`${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} h-2 rounded-full transition-all`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Legend summary */}
          <div className="mt-6 pt-4 border-t border-gris4/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gris2">Total des ventes</span>
              <span className="text-sm font-semibold text-navy">
                {formatCurrency(totalCategorySales)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

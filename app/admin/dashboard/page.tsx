"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  Calendar,
  Users,
  Loader2,
  ArrowUpRight,
  BarChart3,
  Tag,
} from "lucide-react";
import { AdminSalesChart } from "@/components/admin-sales-chart";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    label: "Ventes totales",
    value: "1 250 000 FCFA",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    iconBg: "bg-green/10",
    iconColor: "text-green",
  },
  {
    label: "Billets vendus",
    value: "458",
    change: "+8.2%",
    trend: "up",
    icon: Ticket,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "Événements actifs",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Calendar,
    iconBg: "bg-yellow/10",
    iconColor: "text-yellow",
  },
  {
    label: "Utilisateurs",
    value: "1 245",
    change: "+5.3%",
    trend: "up",
    icon: Users,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
];

const categoryData = [
  { name: "Concerts", percentage: 45, color: "bg-green" },
  { name: "Conférences", percentage: 25, color: "bg-blue-500" },
  { name: "Festivals", percentage: 15, color: "bg-yellow" },
  { name: "Théâtre", percentage: 10, color: "bg-purple-500" },
  { name: "Autres", percentage: 5, color: "bg-gris3" },
];

export default function AdminDashboardPage() {
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
        {stats.map((stat) => (
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
          <AdminSalesChart />
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
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-navy">{cat.name}</span>
                  <span className="text-sm font-medium text-navy">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="w-full bg-bg rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legend summary */}
          <div className="mt-6 pt-4 border-t border-gris4/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gris2">Total des ventes</span>
              <span className="text-sm font-semibold text-navy">
                1 250 000 FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

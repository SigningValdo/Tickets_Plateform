"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Ticket, ShieldCheck } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const { ref, isVisible } = useIntersectionObserver();

  const { data } = useQuery<{
    eventCount: number;
    userCount: number;
    ticketsSold: number;
  }>({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const stats = [
    {
      icon: Calendar,
      value: data?.eventCount ?? 0,
      label: "Événements organisés",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Users,
      value: data?.userCount ?? 0,
      label: "Utilisateurs inscrits",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Ticket,
      value: data?.ticketsSold ?? 0,
      label: "Billets vendus",
      color: "from-green-500 to-green-600",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Paiements sécurisés",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-16 bg-gray-900 text-white -mx-4 px-4"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 fanzone-heading">
          La confiance de toute une communauté
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center",
                isVisible && "animate-fade-in-up"
              )}
              style={
                isVisible
                  ? { animationDelay: `${index * 100}ms`, animationFillMode: "both" }
                  : { opacity: 0 }
              }
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}
              >
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("fr-FR")
                  : stat.value}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

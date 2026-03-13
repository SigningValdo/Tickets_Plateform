"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PlusCircle, Filter, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminEventList,
  type EventWithTicketTypes,
} from "@/components/admin-event-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchEvents = async (): Promise<EventWithTicketTypes[]> => {
  const response = await fetch("/api/admin/events");
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export default function AdminEventsPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useQuery<EventWithTicketTypes[]>({
    queryKey: ["admin-events"],
    queryFn: fetchEvents,
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Gestion des événements
          </h1>
          <p className="text-gris2 text-sm mt-1">
            Créez, modifiez et gérez tous vos événements
          </p>
        </div>
        <Link href="/admin/events/create">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Créer un événement
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par catégorie
            </label>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="concerts">Concerts</SelectItem>
                <SelectItem value="conferences">Conférences</SelectItem>
                <SelectItem value="expositions">Expositions</SelectItem>
                <SelectItem value="festivals">Festivals</SelectItem>
                <SelectItem value="theatre">Théâtre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par date
            </label>
            <input
              type="date"
              className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
            />
          </div>
          <div className="w-full md:w-1/3 flex justify-end">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + Event list */}
      <Tabs defaultValue="all">
        <TabsList className="bg-white rounded-xl p-1 border border-gris4">
          <TabsTrigger
            value="all"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Tous
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Actifs
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            À venir
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Passés
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="all">
            <AdminEventList
              events={events}
              isLoading={isLoading}
              error={error as Error | null}
              filter="all"
              onDeleted={() => { refetch(); }}
            />
          </TabsContent>
          <TabsContent value="active">
            <AdminEventList
              events={events}
              isLoading={isLoading}
              error={error as Error | null}
              filter="active"
              onDeleted={() => { refetch(); }}
            />
          </TabsContent>
          <TabsContent value="upcoming">
            <AdminEventList
              events={events}
              isLoading={isLoading}
              error={error as Error | null}
              filter="upcoming"
              onDeleted={() => { refetch(); }}
            />
          </TabsContent>
          <TabsContent value="past">
            <AdminEventList
              events={events}
              isLoading={isLoading}
              error={error as Error | null}
              filter="past"
              onDeleted={() => { refetch(); }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4">
        <span className="text-sm text-gris2">
          Affichage de {events?.length ?? 0} événements
        </span>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
            Précédent
          </button>
          <button className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

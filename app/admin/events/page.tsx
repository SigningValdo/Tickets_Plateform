"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Calendar,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  PlusCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    <div>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion des événements</h1>
            <p className="text-gray-500">
              Créez, modifiez et gérez tous vos événements
            </p>
          </div>
          <Link href="/admin/events/create">
            <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par catégorie
                </label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par date
                </label>
                <Input type="date" className="w-full" />
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
          </TabsList>

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
        </Tabs>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de 5 événements sur 5
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

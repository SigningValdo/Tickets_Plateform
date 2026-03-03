"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Search,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  imageUrl: string;
  status: string;
  ticketTypes: { name: string; price: number; quantity: number }[];
  category: { name: string } | null;
}

export default function AccountEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const now = new Date();

  const upcomingEvents = events.filter(
    (e) =>
      (e.status === "ACTIVE" || e.status === "UPCOMING") &&
      new Date(e.date) > now
  );
  const pastEvents = events.filter(
    (e) => e.status === "PAST" || new Date(e.date) <= now
  );

  const filterBySearch = (list: EventData[]) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
    );
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Actif
          </Badge>
        );
      case "UPCOMING":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            À venir
          </Badge>
        );
      case "PAST":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-fanzone-orange" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Événements</h1>
        <p className="text-gray-500">
          Découvrez les événements disponibles et achetez vos billets
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un événement, lieu, ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">
            À venir ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Passés ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {filterBySearch(upcomingEvents).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun événement à venir
                </h3>
                <p className="text-gray-500 mb-4">
                  {search
                    ? "Aucun résultat pour votre recherche."
                    : "Il n'y a pas d'événements disponibles pour le moment."}
                </p>
                <Link href="/events">
                  <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
                    Voir tous les événements
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(upcomingEvents).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  statusLabel={statusLabel}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {filterBySearch(pastEvents).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucun événement passé
                </h3>
                <p className="text-gray-500">
                  {search
                    ? "Aucun résultat pour votre recherche."
                    : "Vous n'avez pas encore participé à des événements."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(pastEvents).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  statusLabel={statusLabel}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  formatPrice={formatPrice}
                  isPast
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventCard({
  event,
  statusLabel,
  formatDate,
  formatTime,
  formatPrice,
  isPast,
}: {
  event: EventData;
  statusLabel: (status: string) => React.ReactNode;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
  formatPrice: (p: number) => string;
  isPast?: boolean;
}) {
  const minPrice =
    event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((t) => t.price))
      : null;

  return (
    <Card className="overflow-hidden">
      <div className={`relative h-44 ${isPast ? "grayscale" : ""}`}>
        <Image
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2">
          {statusLabel(event.status)}
        </div>
        {event.category && (
          <Badge className="absolute top-2 right-2 bg-fanzone-orange">
            {event.category.name}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            {formatTime(event.date)}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.location}, {event.city}
            </span>
          </div>
          {minPrice !== null && (
            <div className="flex items-center">
              <Ticket className="h-4 w-4 mr-2 flex-shrink-0" />
              À partir de {formatPrice(minPrice)}
            </div>
          )}
        </div>
        <Link href={`/events/${event.id}`}>
          <Button
            className={`w-full ${
              isPast
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-fanzone-orange hover:bg-fanzone-orange/90"
            }`}
          >
            {isPast ? "Voir les détails" : "Acheter des billets"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

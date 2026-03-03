"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CountdownTimer } from "@/components/countdown-timer";

type ApiEvent = {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  status?: "UPCOMING" | "ACTIVE" | "PAST";
  category?: { name: string } | null;
  ticketTypes?: { price: number }[];
};

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/admin/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export default function UpcomingEvents() {
  const { data, isLoading, error } = useQuery<ApiEvent[]>({
    queryKey: ["events", "upcoming"],
    queryFn: fetchEvents,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[260px] bg-gray-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Impossible de charger les événements.
      </div>
    );
  }

  const upcoming = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "UPCOMING")
    .slice(0, 4);

  if (upcoming.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Aucun événement à venir pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {upcoming.map((event) => {
        const minPrice =
          event.ticketTypes && event.ticketTypes.length
            ? Math.min(...event.ticketTypes.map((t) => t.price))
            : undefined;
        const daysUntil = Math.floor(
          (new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const showCountdown = daysUntil >= 0 && daysUntil <= 7;

        return (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative h-[260px] w-full">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 event-card-gradient" />

              {/* Top badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                <Badge className="bg-fanzone-orange text-white text-xs">
                  {event.category?.name ?? "À venir"}
                </Badge>
                {showCountdown && (
                  <CountdownTimer targetDate={event.date} compact />
                )}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-base mb-2 line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center text-white/80 text-xs mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-white/80 text-xs mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                {minPrice !== undefined && (
                  <div className="font-bold text-fanzone-orange text-sm">
                    {minPrice.toLocaleString("fr-FR")} FCFA
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

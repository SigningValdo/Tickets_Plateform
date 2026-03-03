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
  city?: string;
  status?: "UPCOMING" | "ACTIVE" | "PAST";
  category?: { name: string } | null;
  ticketTypes?: { price: number }[];
};

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/admin/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export default function FeaturedEvents() {
  const { data, isLoading, error } = useQuery<ApiEvent[]>({
    queryKey: ["events", "featured"],
    queryFn: fetchEvents,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 md:row-span-2 h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-[192px] bg-gray-200 rounded-2xl animate-pulse"
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

  const featured = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "ACTIVE")
    .slice(0, 3);

  if (featured.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Aucun événement en vedette pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {featured.map((event, index) => {
        const isFirst = index === 0;
        const minPrice =
          event.ticketTypes && event.ticketTypes.length
            ? Math.min(...event.ticketTypes.map((t) => t.price))
            : undefined;
        const isUpcoming =
          new Date(event.date).getTime() > Date.now();

        return (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className={`group relative overflow-hidden rounded-2xl ${
              isFirst ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div
              className={`relative w-full ${
                isFirst ? "h-[300px] md:h-[420px]" : "h-[200px]"
              }`}
            >
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
                  {event.category?.name ?? "En vedette"}
                </Badge>
                {isUpcoming && (
                  <CountdownTimer targetDate={event.date} compact />
                )}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className={`font-bold text-white mb-2 line-clamp-2 ${
                    isFirst ? "text-2xl md:text-3xl" : "text-base"
                  }`}
                >
                  {event.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-white/80 text-sm mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {minPrice !== undefined ? (
                    <span className="text-fanzone-orange font-bold text-sm">
                      À partir de {minPrice.toLocaleString("fr-FR")} FCFA
                    </span>
                  ) : (
                    <span />
                  )}
                  <Badge
                    variant="outline"
                    className="border-white/30 text-white text-xs"
                  >
                    En vedette
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

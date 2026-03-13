"use client";

import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event-card";
import { ApiEvent } from "@/types";

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/events");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-[200px] bg-gris4/30 rounded-2xl animate-pulse" />
            <div className="h-4 w-3/4 bg-gris4/30 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gris4/30 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gris2">
        Impossible de charger les événements.
      </div>
    );
  }

  const upcoming = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "UPCOMING")
    .slice(0, 4);

  if (upcoming.length === 0) {
    return (
      <div className="text-sm text-gris2">
        Aucun événement à venir pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      {upcoming.map((event) => {
        const minPrice =
          event.ticketTypes && event.ticketTypes.length
            ? Math.min(...event.ticketTypes.map((t) => t.price))
            : undefined;

        return (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            imageUrl={event.imageUrl}
            date={event.date}
            location={event.location}
            city={event.city}
            categoryName={event.category?.name}
            minPrice={minPrice}
          />
        );
      })}
    </div>
  );
}

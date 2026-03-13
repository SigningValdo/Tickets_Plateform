"use client";

import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event-card";
import { ApiEvent } from "@/types";

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/events");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 md:row-span-2 h-[300px] md:h-[470px] bg-gris4/30 rounded-2xl animate-pulse" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-[220px] bg-gris4/30 rounded-2xl animate-pulse"
          />
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

  const featured = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "ACTIVE")
    .slice(0, 3);

  if (featured.length === 0) {
    return (
      <div className="text-sm text-gris2">
        Aucun événement en vedette pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {featured.map((event, index) => {
        const isFirst = index === 0;
        const minPrice =
          event.ticketTypes && event.ticketTypes.length
            ? Math.min(...event.ticketTypes.map((t) => t.price))
            : undefined;

        return (
          <div
            key={event.id}
            className={isFirst ? "md:col-span-2 md:row-span-2 h-full" : ""}
          >
            <EventCard
              id={event.id}
              title={event.title}
              imageUrl={event.imageUrl}
              date={event.date}
              location={event.location}
              city={event.city}
              categoryName={event.category?.name}
              minPrice={minPrice}
              featured
              size={isFirst ? "large" : "default"}
            />
          </div>
        );
      })}
    </div>
  );
}

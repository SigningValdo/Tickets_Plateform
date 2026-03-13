"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { EventAndCategory } from "@/types";
import { EventCard } from "@/components/event-card";

export function EventList() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const [category] = useQueryState("category", { defaultValue: "" });
  const [date] = useQueryState("date", { defaultValue: "" });
  const [location] = useQueryState("location", { defaultValue: "" });
  const [dateFilter] = useQueryState("dateFilter", { defaultValue: "" });

  const { data, isPending, error } = useQuery({
    queryKey: ["events", search, category, date, location, dateFilter],
    queryFn: async (): Promise<EventAndCategory[]> =>
      fetch(
        `/api/events?search=${search}&category=${category}&date=${date}&location=${location}`,
      ).then((res) => res.json()),
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[260px] bg-gris4/30 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-black mb-2">
          Une erreur est survenue
        </h3>
        <p className="text-gris2 mb-6">Essayez de nouveau plus tard</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-black mb-2">
          Aucun événement trouvé
        </h3>
        <p className="text-gris2 mb-6">
          Essayez de modifier vos critères de recherche
        </p>
        <Link href="/events">
          <Button
            variant="outline"
            className="rounded-2xl border-green text-green hover:bg-green hover:text-white"
          >
            Voir tous les événements
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gris2 mb-5">
        {data.length} événement{data.length > 1 ? "s" : ""} trouvé
        {data.length > 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((event) => {
          const minPrice =
            event.ticketTypes && event.ticketTypes.length
              ? Math.min(...event.ticketTypes.map((t: any) => t.price))
              : undefined;

          return (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              imageUrl={event.imageUrl}
              date={String(event.date)}
              location={event.location}
              city={event.city}
              categoryName={event.category?.name}
              minPrice={minPrice}
            />
          );
        })}
      </div>
    </div>
  );
}

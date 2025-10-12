"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { Event, EventCategory } from "@prisma/client";
import moment from "moment";
import { EventAndCategory } from "@/types";

export function EventList() {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "",
  });
  const [date, setDate] = useQueryState("date", {
    defaultValue: "",
  });
  const [location, setLocation] = useQueryState("location", {
    defaultValue: "",
  });
  const [dateFilter, setDateFilter] = useQueryState("dateFilter", {
    defaultValue: "",
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["events", search, category, date, location, dateFilter],
    queryFn: async (): Promise<EventAndCategory[]> =>
      fetch(
        `/api/admin/events?search=${search}&category=${category}&date=${date}&location=${location}&dateFilter=${dateFilter}`
      ).then((res) => res.json()),
  });

  if (isPending) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">
          Chargement des événements...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Une erreur est survenue</h3>
        <p className="text-gray-500 mb-6">Essayez de nouveau plus tard</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Aucun événement trouvé</h3>
        <p className="text-gray-500 mb-6">
          Essayez de modifier vos critères de recherche
        </p>
        <Link href="/events">
          <Button variant="outline">Voir tous les événements</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-500">{data.length} événements trouvés</p>

      {data.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3 h-48 md:h-auto">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-fanzone-orange">
                {event.category.name.charAt(0).toUpperCase() +
                  event.category.name.slice(1)}
              </Badge>
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {event.date && moment(event.date).isValid()
                          ? moment(event.date).format("DD MMM YYYY")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.status}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-fanzone-orange text-lg">
                    {event.status}
                  </span>
                  <Link href={`/events/${event.id}`}>
                    <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
                      Voir les détails
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}

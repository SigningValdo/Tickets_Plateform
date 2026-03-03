"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketSelection from "@/components/ticket-selection";
import EventMap from "@/components/event-map";
import { CountdownTimer } from "@/components/countdown-timer";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { EventAndCategory } from "@/types";
import { use } from "react";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: async (): Promise<EventAndCategory | null> =>
      fetch(`/api/events/${id}`).then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 -mx-4">
        <div className="h-80 md:h-[500px] bg-gray-200 animate-pulse" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-full lg:w-1/3">
              <div className="h-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
        <p className="mb-6">
          L&apos;événement que vous recherchez n&apos;existe pas ou a été
          supprimé.
        </p>
        <Link href="/events">
          <Button>Retour aux événements</Button>
        </Link>
      </div>
    );
  }

  const isUpcoming = event?.date && new Date(event.date).getTime() > Date.now();
  const minPrice =
    event?.ticketTypes && event.ticketTypes.length
      ? Math.min(...event.ticketTypes.map((t: { price: number }) => t.price))
      : null;

  return (
    <div className="min-h-screen bg-gray-50 -mx-4">
      {/* Hero section */}
      <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden w-full">
        <Image
          src={event?.imageUrl || "/placeholder.svg"}
          alt={event?.title || ""}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 text-white/60 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Accueil
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href="/events"
                className="hover:text-white transition-colors"
              >
                Événements
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/90 line-clamp-1">{event?.title}</span>
            </div>

            <Badge className="mb-3 bg-fanzone-orange text-sm px-3 py-1">
              {event?.category?.name}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 fanzone-heading">
              {event?.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {event?.date && moment(event.date).isValid()
                    ? moment(event.date).format("dddd DD MMMM YYYY")
                    : "-"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event?.status}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event?.location}</span>
              </div>
            </div>

            {/* Countdown for upcoming events */}
            {isUpcoming && (
              <div className="mt-2">
                <CountdownTimer targetDate={event!.date} />
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="location">Lieu</TabsTrigger>
                <TabsTrigger value="organizer">Organisateur</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      À propos de cet événement
                    </h2>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: event?.description || "",
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Informations pratiques
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-orange-50 rounded-lg mr-3">
                          <Calendar className="h-5 w-5 text-fanzone-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium">Date et heure</h3>
                          <p className="text-gray-600">
                            {event?.date && moment(event.date).isValid()
                              ? moment(event.date).format("dddd DD MMMM YYYY")
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 bg-orange-50 rounded-lg mr-3">
                          <MapPin className="h-5 w-5 text-fanzone-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium">Lieu</h3>
                          <p className="text-gray-600">
                            {event?.location || "-"}
                          </p>
                          <p className="text-gray-600">
                            {event?.address || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 bg-orange-50 rounded-lg mr-3">
                          <Users className="h-5 w-5 text-fanzone-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium">Organisateur</h3>
                          <p className="text-gray-600">
                            {event?.organizer || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      Lieu de l&apos;événement
                    </h2>
                    <p className="mb-4">{event?.location || "-"}</p>
                    <p className="mb-6 text-gray-600">
                      {event?.address || "-"}
                    </p>
                    <div className="h-80 w-full rounded-xl overflow-hidden">
                      <EventMap location={event?.location || "-"} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organizer">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      À propos de l&apos;organisateur
                    </h2>
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 bg-orange-100 rounded-full mr-4 flex items-center justify-center">
                        <Users className="h-8 w-8 text-fanzone-orange" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {event?.organizer || "-"}
                        </h3>
                        <p className="text-gray-600">
                          Organisateur d&apos;événements culturels
                        </p>
                      </div>
                    </div>
                    <p className="mb-4 text-gray-600">
                      Organisateur passionné dédié à la promotion de la culture
                      et des arts. Découvrez nos événements culturels de qualité
                      mettant en valeur les talents locaux et internationaux.
                    </p>
                    <Button variant="outline" className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Contacter l&apos;organisateur
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28">
              <Card className="overflow-hidden shadow-xl border-fanzone-orange/20">
                {/* Orange accent header */}
                <div className="h-1.5 fanzone-gradient" />
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2">
                    Réserver vos billets
                  </h2>
                  {minPrice !== null && (
                    <p className="text-fanzone-orange font-bold text-2xl mb-6">
                      À partir de {minPrice.toLocaleString("fr-FR")} FCFA
                    </p>
                  )}

                  <TicketSelection
                    tickets={event?.ticketTypes || []}
                    eventId={event?.id || ""}
                  />

                  <div className="mt-6 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                    <p>
                      Les billets sont envoyés par email et disponibles dans
                      votre espace personnel.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

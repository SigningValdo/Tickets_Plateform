"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  ChevronRight,
  Ticket,
  Info,
} from "lucide-react";
import TicketSelection from "@/components/ticket-selection";
import EventMap from "@/components/event-map";
import { CountdownTimer } from "@/components/countdown-timer";
import { useQuery } from "@tanstack/react-query";
import { EventAndCategory } from "@/types";
import { use } from "react";
import { getCategoryStyle } from "@/lib/constants/categories";
import { sanitizeRichText } from "@/lib/sanitize";

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
      <div className="min-h-screen bg-bg">
        <div className="h-80 md:h-[520px] bg-navy animate-pulse" />
        <div className="container py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 space-y-5">
              <div className="h-8 bg-gris4/30 rounded-2xl w-1/3 animate-pulse" />
              <div className="h-64 bg-gris4/30 rounded-2xl animate-pulse" />
            </div>
            <div className="w-full lg:w-1/3">
              <div className="h-96 bg-gris4/30 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-3">
            Événement non trouvé
          </h1>
          <p className="text-gris2 mb-8">
            L&apos;événement que vous recherchez n&apos;existe pas ou a été
            supprimé.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors"
          >
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  const isUpcoming = event.date && new Date(event.date).getTime() > Date.now();
  const minPrice =
    event.ticketTypes && event.ticketTypes.length
      ? Math.min(...event.ticketTypes.map((t: { price: number }) => t.price))
      : null;

  const categoryName = event.category?.name || "";
  const catStyle = getCategoryStyle(categoryName);

  const formattedDate = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative h-80 md:h-[520px] w-full overflow-hidden">
        <Image
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#051A3699]" />

        <div className="absolute inset-0 flex flex-col justify-end container pb-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-white/50 text-sm mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/events" className="hover:text-white transition-colors">
              Événements
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80 line-clamp-1">{event.title}</span>
          </div>

          {/* Category badge */}
          {categoryName && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text} backdrop-blur-sm w-fit mb-4`}
            >
              <Image
                src={`/icons/${catStyle.icon}.svg`}
                alt={categoryName}
                width={19}
                height={19}
              />
              {categoryName}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-5 text-white/90 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>
                {event.location}
                {event.city ? `, ${event.city}` : ""}
              </span>
            </div>
          </div>

          {/* Countdown */}
          {isUpcoming && <CountdownTimer targetDate={event.date} />}
        </div>
      </section>

      {/* Content */}
      <main className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green/10 flex items-center justify-center">
                  <Info className="h-4 w-4 text-green" />
                </div>
                À propos de cet événement
              </h2>
              <div
                className="prose prose-sm max-w-none text-gris2 prose-headings:text-black"
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichText(event.description || ""),
                }}
              />
            </div>

            {/* Practical info */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-xl font-bold text-black mb-6">
                Informations pratiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gris2 mb-0.5">Date</p>
                    <p className="text-sm font-medium text-black">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gris2 mb-0.5">Lieu</p>
                    <p className="text-sm font-medium text-black">
                      {event.location}
                    </p>
                    {/* <p className="text-xs text-gris2">{event.address}</p> */}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gris2 mb-0.5">Organisateur</p>
                    <p className="text-sm font-medium text-black">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green" />
                </div>
                Lieu de l&apos;événement
              </h2>
              <p className="text-sm text-gris2 mb-4">
                {event.location}
                {event.address ? ` — ${event.address}` : ""}
              </p>
              <div className="h-64 w-full rounded-xl overflow-hidden">
                <EventMap location={event.location} />
              </div>
            </div>
          </div>

          {/* Right column — Booking sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Green accent */}
                <div className="h-1.5 bg-green" />
                <div className="p-6">
                  <h2 className="text-lg font-bold text-black mb-1 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-green" />
                    Réserver vos billets
                  </h2>
                  {minPrice !== null && (
                    <p className="text-green font-bold text-2xl mb-6">
                      {minPrice === 0
                        ? "Gratuit"
                        : `${minPrice.toLocaleString("fr-FR")} FCFA`}
                    </p>
                  )}

                  <TicketSelection
                    tickets={event.ticketTypes || []}
                    eventId={event.id}
                  />

                  <div className="mt-6 text-xs text-gris2 bg-bg rounded-xl p-3.5">
                    Les billets sont envoyés par email et disponibles dans votre
                    espace personnel.
                  </div>
                </div>
              </div>

              {/* Share */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl text-sm font-medium text-gris2 hover:text-green hover:bg-green/5 transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <Share2 className="h-4 w-4" />
                Partager cet événement
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

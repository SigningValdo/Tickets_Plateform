"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";

type FeaturedEvent = {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  city: string;
  status?: "UPCOMING" | "ACTIVE" | "PAST";
  category?: { name: string } | null;
  ticketTypes?: { price: number }[];
};

const fetchEvents = async (): Promise<FeaturedEvent[]> => {
  const res = await fetch("/api/admin/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data, isLoading } = useQuery<FeaturedEvent[]>({
    queryKey: ["events", "hero"],
    queryFn: fetchEvents,
  });

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const featured = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "ACTIVE")
    .slice(0, 5);

  if (!featured.length && !isLoading) {
    return <StaticHero />;
  }

  if (isLoading) {
    return (
      <section className="relative -mx-4">
        <div className="h-[400px] md:h-[550px] bg-gray-900 animate-pulse flex items-end pb-20">
          <div className="container mx-auto px-4">
            <div className="h-6 w-32 bg-gray-700 rounded mb-4" />
            <div className="h-12 w-2/3 bg-gray-700 rounded mb-4" />
            <div className="h-5 w-1/3 bg-gray-700 rounded mb-6" />
            <div className="h-12 w-48 bg-gray-700 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative -mx-4">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent>
          {featured.map((event, index) => {
            const minPrice =
              event.ticketTypes && event.ticketTypes.length
                ? Math.min(...event.ticketTypes.map((t) => t.price))
                : null;

            return (
              <CarouselItem key={event.id}>
                <div className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden w-full">
                  <Image
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-24">
                    <div className="container mx-auto px-4">
                      <Badge className="bg-fanzone-orange mb-4 text-sm px-3 py-1">
                        {event.category?.name ?? "En vedette"}
                      </Badge>
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 fanzone-heading max-w-3xl">
                        {event.title}
                      </h1>
                      <div className="flex flex-wrap gap-4 text-white/90 mb-6">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>
                            {new Date(event.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>
                            {event.location}
                            {event.city ? `, ${event.city}` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Link href={`/events/${event.id}`}>
                          <Button
                            size="lg"
                            className="bg-fanzone-orange hover:bg-fanzone-orange/90 text-white px-8 py-6 text-lg"
                          >
                            Acheter des billets
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        {minPrice !== null && (
                          <span className="text-white text-lg font-medium">
                            À partir de {minPrice.toLocaleString("fr-FR")} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {count > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-fanzone-orange"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => api?.scrollTo(i)}
              />
            ))}
          </div>
        )}
      </Carousel>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        <SearchBar />
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <section className="relative -mx-4 overflow-hidden">
      <div className="relative py-20 md:py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 fanzone-pattern opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white fanzone-heading">
            Découvrez et réservez vos événements préférés
          </h1>
          <p className="text-xl text-white/70 mb-6 max-w-3xl mx-auto fanzone-body">
            Achetez des billets en toute simplicité pour des concerts,
            festivals, conférences et plus encore.
          </p>
          <p className="text-fanzone-orange font-medium italic text-lg mb-8 fanzone-body">
            &quot;Agility vos émotions, un ticket à la fois&quot;
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}

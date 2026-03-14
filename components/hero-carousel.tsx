"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { getCategoryStyle } from "@/lib/constants/categories";

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
  const res = await fetch("/api/events");
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
      <section className="relative w-full">
        <div className="h-[400px] md:h-[520px] bg-navy animate-pulse flex items-end pb-20">
          <div className="container">
            <div className="h-6 w-32 bg-white/10 rounded mb-4" />
            <div className="h-12 w-2/3 bg-white/10 rounded mb-4" />
            <div className="h-5 w-1/3 bg-white/10 rounded mb-6" />
            <div className="h-12 w-48 bg-white/10 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
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
            const categoryName = event.category?.name ?? "En vedette";
            const catStyle = getCategoryStyle(categoryName);

            return (
              <CarouselItem key={event.id}>
                <div className="relative h-[480px] md:h-[520px] w-full">
                  <Image
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-[#051A3699]" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center container">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text} backdrop-blur-sm`}
                    >
                      <Image
                        src={`/icons/${catStyle.icon}.svg`}
                        alt="En vedette"
                        width={19}
                        height={19}
                      />
                      {categoryName}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 mb-8 text-white">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-6 w-6" />
                        <span>
                          {new Date(event.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-6 w-6" />
                        <span>
                          {event.location}
                          {event.city ? `, ${event.city}` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap justify-center mb-12">
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-2 py-[14px] px-6 bg-yellow hover:bg-yellow/90 font-medium rounded-2xl transition-colors"
                      >
                        Afficher des billets
                        <ArrowRight className="h-6 w-6" />
                      </Link>
                      {minPrice !== null && (
                        <span className="text-white text-sm font-medium">
                          {minPrice.toLocaleString("fr-FR")} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* {count > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => api?.scrollTo(i)}
              />
            ))}
          </div>
        )} */}
      </Carousel>
      <div className="absolute bottom-4 md:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
        <SearchBar />
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative py-20 md:py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Découvrez et réservez vos événements préférés
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto">
            Achetez des billets en toute simplicité pour des concerts,
            festivals, conférences et plus encore.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}

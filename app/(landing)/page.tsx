import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import FeaturedEvents from "@/components/featured-events";
import UpcomingEvents from "@/components/upcoming-events";
import EventCategories from "@/components/event-categories";
import { SectionHeader } from "@/components/section-header";
import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      {/* Hero Carousel - full width */}
      <HeroCarousel />

      {/* Content sections - contained */}
      <div className="container">
        {/* Categories */}
        <section className="py-12">
          <SectionHeader
            title="Catégories"
            subtitle="Explorez par type d'événement"
            href="/events"
          />
          <EventCategories />
        </section>

        {/* Featured Events */}
        <section className="py-12">
          <SectionHeader
            title="Événements en vedette"
            subtitle="Les événements à ne pas manquer"
            href="/events"
          />
          <FeaturedEvents />
        </section>

        {/* Upcoming Events */}
        <section className="py-12">
          <SectionHeader
            title="Prochains événements"
            subtitle="Réservez avant qu'il ne soit trop tard"
            href="/events"
          />
          <UpcomingEvents />
        </section>
      </div>

      {/* CTA Section - full width */}
      <section className="relative bg-green h-[276px] text-white text-center">
        <Image
          src={"/filigrame.png"}
          alt="filigrame"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 max-w-3xl flex flex-col justify-center items-center text-center container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vous organisez un événement ?
          </h2>
          <p className=" text-lg mb-8">
            Créez et gérez vos événements, vendez des billets en toute
            simplicité avec FANZONE TICKETS.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-12 px-8 bg-white text-green font-medium rounded-2xl hover:bg-white/90 transition-colors"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import FeaturedEvents from "@/components/featured-events";
import UpcomingEvents from "@/components/upcoming-events";
import EventCategories from "@/components/event-categories";
import { StatsSection } from "@/components/stats-section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Spacer for search bar overlay */}
      <div className="h-12" />

      {/* Categories */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
              Catégories
            </h2>
            <p className="text-gray-500 mt-1">
              Explorez par type d&apos;événement
            </p>
          </div>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <EventCategories />
      </section>

      {/* Featured Events */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
              Événements en vedette
            </h2>
            <p className="text-gray-500 mt-1">
              Les événements à ne pas manquer
            </p>
          </div>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <FeaturedEvents />
      </section>

      {/* Stats / Social Proof */}
      {/* <StatsSection /> */}

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
              Prochains événements
            </h2>
            <p className="text-gray-500 mt-1">
              Réservez avant qu&apos;il ne soit trop tard
            </p>
          </div>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <UpcomingEvents />
      </section>

      {/* CTA Section */}
      <section className="py-16 -mx-4 px-4 fanzone-gradient text-white text-center rounded-none">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 fanzone-heading">
            Vous organisez un événement ?
          </h2>
          <p className="text-white/90 text-lg mb-8 fanzone-body">
            Créez et gérez vos événements, vendez des billets en toute
            simplicité avec FANZONE TICKETS.
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="outline"
              className=" text-fanzone-orange text-lg px-8"
            >
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

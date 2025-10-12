import Link from "next/link";
import FeaturedEvents from "@/components/featured-events";
import UpcomingEvents from "@/components/upcoming-events";
import { SearchBar } from "@/components/search-bar";
import EventCategories from "@/components/event-categories";

export default function HomePage() {
  return (
    <div>
      <section className="py-16 text-center fanzone-pattern">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-fanzone-gray fanzone-heading">
            Découvrez et réservez vos événements préférés
          </h1>
          <p className="text-xl text-fanzone-gray/70 mb-6 max-w-3xl mx-auto fanzone-body">
            Achetez des billets en toute simplicité pour des concerts,
            festivals, conférences et plus encore.
          </p>
          <p className="text-fanzone-orange font-medium italic text-lg mb-8 fanzone-body">
            "Agility vos émotions, un ticket à la fois"
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mb-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
            Catégories
          </h2>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <EventCategories />
      </section>

      <section className="mb-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
            Événements en vedette
          </h2>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <FeaturedEvents />
      </section>

      <section className="mb-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-fanzone-gray fanzone-heading">
            Prochains événements
          </h2>
          <Link
            href="/events"
            className="text-fanzone-orange hover:underline transition-colors fanzone-body font-medium"
          >
            Voir tout
          </Link>
        </div>
        <UpcomingEvents />
      </section>
    </div>
  );
}

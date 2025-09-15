import Link from "next/link";
import FeaturedEvents from "@/components/featured-events";
import UpcomingEvents from "@/components/upcoming-events";
import { SearchBar } from "@/components/search-bar";
import EventCategories from "@/components/event-categories";

export default function HomePage() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Découvrez et réservez vos événements préférés
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Achetez des billets en toute simplicité pour des concerts, festivals,
          conférences et plus encore.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Catégories</h2>
          <Link href="/events" className="text-purple-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <EventCategories />
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Événements en vedette</h2>
          <Link href="/events" className="text-purple-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <FeaturedEvents />
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Prochains événements</h2>
          <Link href="/events" className="text-purple-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <UpcomingEvents />
      </section>
    </div>
  );
}

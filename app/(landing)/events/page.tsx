import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { EventList } from "@/components/event-list";
import { EventFilters } from "@/components/event-filters";
import { CategoryTabs } from "@/components/category-tabs";
import { SectionHeader } from "@/components/section-header";
import Image from "next/image";

export default function EventsPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* Hero banner */}
      <section className="relative w-full bg-navy overflow-hidden h-[400px] md:h-[520px] flex items-center">
        <Image
          src="/filigrame.png"
          alt="filigrame"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />
        <div className="relative container py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Découvrez tous les événements
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Trouvez et réservez vos prochains événements en toute simplicité
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Category tabs + Filters + Event list */}
      <div className="container py-16">
        <SectionHeader
          title="Tous les événements"
          subtitle="Parcourez notre sélection complète"
        />
        <div className="mb-8">
          <CategoryTabs />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 sticky top-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-bold text-lg text-black mb-5">Filtres</h2>
              <EventFilters />
            </div>
          </aside>

          {/* Event grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[260px] bg-gris4/30 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <EventList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

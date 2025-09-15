import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { EventList } from "@/components/event-list";
import { EventFilters } from "@/components/event-filters";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            Découvrez tous les événements
          </h1>
          <div className="max-w-3xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <Card className="p-4 sticky top-4">
              <h2 className="font-bold text-lg mb-4">Filtres</h2>
              <EventFilters />
            </Card>
          </div>
          <div className="w-full md:w-3/4">
            <Suspense fallback={<div>Chargement des événements...</div>}>
              <EventList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

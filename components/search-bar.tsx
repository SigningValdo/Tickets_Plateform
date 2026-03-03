"use client";

import type React from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full shadow-lg rounded-xl overflow-hidden bg-white/95 backdrop-blur-sm"
    >
      <div className="relative flex-grow">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fanzone-gray/60"
          size={20}
        />
        <Input
          type="text"
          placeholder="Rechercher des événements, lieux, artistes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 rounded-l-xl w-full border-0 bg-transparent fanzone-body focus:ring-0 focus-visible:ring-0"
        />
      </div>
      <Button
        type="submit"
        className="bg-fanzone-orange hover:bg-fanzone-orange/90 h-[50px] rounded-l-none rounded-r-xl px-8 fanzone-body font-medium"
      >
        Rechercher
      </Button>
    </form>
  );
}

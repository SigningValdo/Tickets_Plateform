"use client";

import type React from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
      className="flex w-full rounded-2xl overflow-hidden bg-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative flex-grow">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white "
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher des événements, lieux, artistes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-[14px] pl-12 pr-4 bg-transparent text-white placeholder:text-white/40 focus:outline-none border-none"
        />
      </div>
      <button
        type="submit"
        className="py-[14px] px-12 bg-green hover:bg-green/90 rounded-2xl text-white font-medium transition-colors flex-shrink-0"
      >
        Rechercher
      </button>
    </form>
  );
}

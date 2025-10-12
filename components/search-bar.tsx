"use client";

import type React from "react";
import { useQueryState } from "nuqs";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full shadow-lg"
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
          className="pl-10 py-6 rounded-l-md w-full border-r-0 fanzone-body border-fanzone-gray/20 focus:border-fanzone-orange focus:ring-fanzone-orange"
        />
      </div>
      <Button
        type="submit"
        className="bg-fanzone-orange hover:bg-fanzone-orange/90 h-[50px] rounded-l-none px-8 fanzone-body font-medium"
      >
        Rechercher
      </Button>
    </form>
  );
}

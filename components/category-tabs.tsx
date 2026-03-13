"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

interface EventCategory {
  id: string;
  name: string;
}

const fetchCategories = async (): Promise<EventCategory[]> => {
  const res = await fetch("/api/event-categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export function CategoryTabs() {
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "",
  });

  const { data: categories, isLoading } = useQuery<EventCategory[]>({
    queryKey: ["event-categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gris4/30 rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  const allCategories = [{ id: "", name: "Tous" }, ...(categories || [])];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allCategories.map((cat) => {
        const isActive = category === cat.id || (!category && cat.id === "");
        return (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isActive
                ? "bg-green text-white"
                : "bg-white text-black hover:bg-green/10 hover:text-green"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface EventCategory {
  id: string;
  name: string;
  description?: string;
}

function gifFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("concert") || n.includes("music")) return "/gifs/concert.gif";
  if (n.includes("cinéma") || n.includes("cinema") || n.includes("film"))
    return "/gifs/cinema.gif";
  if (n.includes("conf") || n.includes("business") || n.includes("pro"))
    return "/gifs/conference.gif";
  if (n.includes("gastr") || n.includes("food") || n.includes("resto"))
    return "/gifs/gastronomie.gif";
  if (n.includes("spectacle") || n.includes("show") || n.includes("stand"))
    return "/gifs/spectacle.gif";
  if (
    n.includes("atelier") ||
    n.includes("workshop") ||
    n.includes("formation")
  )
    return "/gifs/atelier.gif";
  if (n.includes("festival")) return "/gifs/festival.gif";
  if (n.includes("exposition") || n.includes("expo"))
    return "/gifs/exposition.gif";
  return "/gifs/festival.gif";
}

const fetchCategories = async (): Promise<EventCategory[]> => {
  const res = await fetch("/api/event-categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export default function EventCategories() {
  const { data: categories, isLoading } = useQuery<EventCategory[]>({
    queryKey: ["event-categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 flex-shrink-0"
          >
            <div className="w-16 h-16 bg-gris4/30 rounded-full animate-pulse" />
            <div className="h-3 w-14 bg-gris4/30 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories?.slice(0, 8).map((category) => {
        const gif = gifFor(category.name);
        const slug = encodeURIComponent(category.name);
        return (
          <Link
            key={category.id}
            href={`/events?category=${slug}`}
            className="flex flex-col items-center gap-3 bg-white rounded-2xl px-8 pt-2 pb-4 flex-shrink-0 group hover:border hover:border-green"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#E9F3FF]">
              <Image
                src={gif}
                alt={category.name}
                width={45}
                height={45}
                unoptimized
              />
            </div>
            <span className="text-xs font-medium text-black group-hover:text-green transition-colors">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

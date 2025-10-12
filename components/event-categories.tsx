"use client";
import Link from "next/link";
import {
  Music,
  Theater,
  Briefcase,
  Utensils,
  Mic,
  Film,
  Users,
  Ticket,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EventCategory {
  id: string;
  name: string;
  description?: string;
}

function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("concert") || n.includes("music"))
    return <Music className="h-6 w-6" />;
  if (n.includes("théâtre") || n.includes("theatre") || n.includes("theatre"))
    return <Theater className="h-6 w-6" />;
  if (n.includes("conf") || n.includes("business") || n.includes("pro"))
    return <Briefcase className="h-6 w-6" />;
  if (n.includes("gastr") || n.includes("food") || n.includes("resto"))
    return <Utensils className="h-6 w-6" />;
  if (n.includes("spectacle") || n.includes("show") || n.includes("stand"))
    return <Mic className="h-6 w-6" />;
  if (n.includes("cinéma") || n.includes("cinema") || n.includes("film"))
    return <Film className="h-6 w-6" />;
  if (
    n.includes("atelier") ||
    n.includes("workshop") ||
    n.includes("formation")
  )
    return <Users className="h-6 w-6" />;
  if (n.includes("festival")) return <Ticket className="h-6 w-6" />;
  return <Ticket className="h-6 w-6" />;
}

const fetchCategories = async (): Promise<EventCategory[]> => {
  const res = await fetch("/api/admin/event-categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export default function EventCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<EventCategory[]>({
    queryKey: ["event-categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm animate-pulse"
          >
            <div className="bg-gray-200 p-3 rounded-full mb-3 h-12 w-12" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
      {categories?.slice(0, 8).map((category) => {
        const icon = iconFor(category.name);
        const slug = encodeURIComponent(category.name);
        return (
          <Link
            key={category.id}
            href={`/events?category=${slug}`}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3 text-fanzone-orange">
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

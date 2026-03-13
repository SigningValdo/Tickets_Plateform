"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { getCategoryStyle } from "@/lib/constants/categories";

interface EventCardProps {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  city?: string;
  categoryName?: string;
  categoryColor?: string;
  minPrice?: number;
  featured?: boolean;
  size?: "default" | "large";
}

export function EventCard({
  id,
  title,
  imageUrl,
  date,
  location,
  city,
  categoryName,
  minPrice,
  featured = false,
  size = "default",
}: EventCardProps) {
  const catStyle = getCategoryStyle(categoryName || "");
  const isLarge = size === "large";

  return (
    <Link
      href={`/events/${id}`}
      className={`group block ${isLarge ? "h-full" : ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl ${
          isLarge ? "h-full min-h-[300px]" : "h-[260px]"
        }`}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 event-card-gradient" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {categoryName ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text} backdrop-blur-sm`}
            >
              <Image
                src={`/icons/${catStyle.icon}.svg`}
                alt="En vedette"
                width={19}
                height={19}
              />
              {categoryName}
            </span>
          ) : (
            <span />
          )}
          {featured && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-yellow text-black backdrop-blur-sm">
              <Image
                src="/icons/star.svg"
                alt="En vedette"
                width={19}
                height={19}
              />
              En vedette
            </span>
          )}
        </div>
        {/* Info below image */}
        <div className="absolute bottom-5 left-3 text-white pt-3 space-y-1.5">
          <h3
            className={`font-semibold line-clamp-1 ${
              isLarge ? "text-lg" : "text-sm"
            }`}
          >
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-bg text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-bg text-xs">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {location}
              {city ? `, ${city}` : ""}
            </span>
          </div>
          {minPrice !== undefined && (
            <p className="text-red font-semibold text-sm">
              {minPrice === 0
                ? "Gratuit"
                : `${minPrice.toLocaleString("fr-FR")} FCFA`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"

type ApiEvent = {
  id: string
  title: string
  imageUrl: string
  date: string
  location: string
  status?: "UPCOMING" | "ACTIVE" | "PAST"
  category?: { name: string } | null
  ticketTypes?: { price: number }[]
}

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/admin/events")
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}

export default function UpcomingEvents() {
  const { data, isLoading, error } = useQuery<ApiEvent[]>({
    queryKey: ["events", "upcoming"],
    queryFn: fetchEvents,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200" />
            <CardContent className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 w-3/4 rounded" />
              <div className="h-3 bg-gray-200 w-1/2 rounded" />
              <div className="h-3 bg-gray-200 w-2/3 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-600">Impossible de charger les événements.</div>
  }

  const upcoming = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "UPCOMING")
    .slice(0, 4)

  if (upcoming.length === 0) {
    return <div className="text-sm text-gray-500">Aucun événement à venir pour le moment.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {upcoming.map((event) => {
        const minPrice = event.ticketTypes && event.ticketTypes.length
          ? Math.min(...event.ticketTypes.map((t) => t.price))
          : undefined
        return (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40">
                <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-purple-600">{event.category?.name ?? "À venir"}</Badge>
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-base mb-2 line-clamp-1">{event.title}</h3>
                <div className="flex items-center text-gray-500 mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="text-xs">{new Date(event.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="text-xs line-clamp-1">{event.location}</span>
                </div>
                <div className="font-bold text-purple-600 text-sm">
                  {minPrice !== undefined ? `${minPrice.toLocaleString("fr-FR")} FCFA` : ""}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}


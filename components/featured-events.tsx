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
}

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const res = await fetch("/api/admin/events")
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}

export default function FeaturedEvents() {
  const { data, isLoading, error } = useQuery<ApiEvent[]>({
    queryKey: ["events", "featured"],
    queryFn: fetchEvents,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardContent className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 w-3/4 rounded" />
              <div className="h-4 bg-gray-200 w-1/2 rounded" />
              <div className="h-4 bg-gray-200 w-2/3 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-600">Impossible de charger les événements.</div>
  }

  const featured = (data || [])
    .filter((e) => (e.status || "").toUpperCase() === "ACTIVE")
    .slice(0, 3)

  if (featured.length === 0) {
    return <div className="text-sm text-gray-500">Aucun événement en vedette pour le moment.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featured.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-purple-600">{event.category?.name ?? "En vedette"}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm line-clamp-1">{event.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">&nbsp;</span>
                <Badge variant="outline" className="border-purple-200 text-purple-600">
                  En vedette
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}


import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Données simulées pour les prochains événements
const upcomingEvents = [
  {
    id: "4",
    title: "Concert de Musique Classique",
    image: "/placeholder.svg?height=400&width=600",
    date: "5 Août 2024",
    location: "Opéra National, Rabat",
    category: "Concerts",
    price: "10000 FCFA",
  },
  {
    id: "5",
    title: "Tournoi de Football Caritatif",
    image: "/placeholder.svg?height=400&width=600",
    date: "12 Août 2024",
    location: "Stade Municipal, Douala",
    category: "Sports",
    price: "3000 FCFA",
  },
  {
    id: "6",
    title: "Salon du Livre Africain",
    image: "/placeholder.svg?height=400&width=600",
    date: "20 Août 2024",
    location: "Centre Culturel, Bamako",
    category: "Expositions",
    price: "Gratuit",
  },
  {
    id: "7",
    title: "Festival de Cinéma",
    image: "/placeholder.svg?height=400&width=600",
    date: "1 Septembre 2024",
    location: "Cinémathèque, Tunis",
    category: "Cinéma",
    price: "5000 FCFA",
  },
]

export default function UpcomingEvents() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {upcomingEvents.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-purple-600">{event.category}</Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-base mb-2 line-clamp-1">{event.title}</h3>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="text-xs">{event.date}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs line-clamp-1">{event.location}</span>
              </div>
              <div className="font-bold text-purple-600 text-sm">{event.price}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

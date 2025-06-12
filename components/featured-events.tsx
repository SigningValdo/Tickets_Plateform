import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Données simulées pour les événements en vedette
const featuredEvents = [
  {
    id: "1",
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    location: "Palais de la Culture, Abidjan",
    category: "Concerts",
    price: "15000 FCFA",
  },
  {
    id: "2",
    title: "Conférence Tech Innovation",
    image: "/placeholder.svg?height=400&width=600",
    date: "22 Juin 2024",
    location: "Centre de Conférences, Dakar",
    category: "Conférences",
    price: "5000 FCFA",
  },
  {
    id: "3",
    title: "Exposition d'Art Contemporain",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 Juillet 2024",
    location: "Galerie Nationale, Lomé",
    category: "Expositions",
    price: "2000 FCFA",
  },
]

export default function FeaturedEvents() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredEvents.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-purple-600">{event.category}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm line-clamp-1">{event.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">{event.price}</span>
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

import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Données simulées pour la liste des événements
const allEvents = [
  {
    id: "1",
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    time: "19:00",
    location: "Palais de la Culture, Abidjan",
    category: "concerts",
    city: "abidjan",
    price: "15000 FCFA",
    description: "Profitez d'une soirée exceptionnelle avec les meilleurs artistes de jazz internationaux et locaux.",
  },
  {
    id: "2",
    title: "Conférence Tech Innovation",
    image: "/placeholder.svg?height=400&width=600",
    date: "22 Juin 2024",
    time: "09:00",
    location: "Centre de Conférences, Dakar",
    category: "conferences",
    city: "dakar",
    price: "5000 FCFA",
    description: "Découvrez les dernières innovations technologiques et rencontrez des experts du domaine.",
  },
  {
    id: "3",
    title: "Exposition d'Art Contemporain",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 Juillet 2024",
    time: "10:00",
    location: "Galerie Nationale, Lomé",
    category: "shows",
    city: "lome",
    price: "2000 FCFA",
    description:
      "Une exposition unique présentant les œuvres des artistes contemporains les plus prometteurs d'Afrique.",
  },
  {
    id: "4",
    title: "Concert de Musique Classique",
    image: "/placeholder.svg?height=400&width=600",
    date: "5 Août 2024",
    time: "20:00",
    location: "Opéra National, Rabat",
    category: "concerts",
    city: "rabat",
    price: "10000 FCFA",
    description: "Un concert exceptionnel avec l'Orchestre Philharmonique interprétant les plus grands classiques.",
  },
  {
    id: "5",
    title: "Tournoi de Football Caritatif",
    image: "/placeholder.svg?height=400&width=600",
    date: "12 Août 2024",
    time: "15:00",
    location: "Stade Municipal, Douala",
    category: "festivals",
    city: "douala",
    price: "3000 FCFA",
    description: "Un tournoi de football dont les bénéfices seront reversés à des associations caritatives locales.",
  },
  {
    id: "6",
    title: "Salon du Livre Africain",
    image: "/placeholder.svg?height=400&width=600",
    date: "20 Août 2024",
    time: "09:00",
    location: "Centre Culturel, Bamako",
    category: "conferences",
    city: "bamako",
    price: "Gratuit",
    description: "Rencontrez vos auteurs préférés et découvrez les dernières publications de la littérature africaine.",
  },
  {
    id: "7",
    title: "Festival de Cinéma",
    image: "/placeholder.svg?height=400&width=600",
    date: "1 Septembre 2024",
    time: "18:00",
    location: "Cinémathèque, Tunis",
    category: "cinema",
    city: "tunis",
    price: "5000 FCFA",
    description: "Projection de films primés et rencontres avec des réalisateurs de renom du cinéma africain.",
  },
  {
    id: "8",
    title: "Atelier de Cuisine Traditionnelle",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 Septembre 2024",
    time: "14:00",
    location: "École de Cuisine, Abidjan",
    category: "workshops",
    city: "abidjan",
    price: "8000 FCFA",
    description: "Apprenez à préparer des plats traditionnels avec des chefs renommés.",
  },
]

interface EventListProps {
  search?: string
  category?: string
  date?: string
  location?: string
}

export function EventList({ search = "", category = "", date = "", location = "" }: EventListProps) {
  // Filtrer les événements en fonction des critères
  const filteredEvents = allEvents.filter((event) => {
    // Filtre par recherche
    if (
      search &&
      !event.title.toLowerCase().includes(search.toLowerCase()) &&
      !event.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }

    // Filtre par catégorie
    if (category && category !== "all" && event.category !== category) {
      return false
    }

    // Filtre par lieu
    if (location && location !== "all" && event.city !== location) {
      return false
    }

    // Filtre par date (simplifié pour l'exemple)
    if (date) {
      // Dans un cas réel, nous ferions une comparaison de dates plus précise
      const eventDate = new Date(event.date.split(" ").reverse().join("-"))
      const filterDate = new Date(date)

      if (eventDate.toDateString() !== filterDate.toDateString()) {
        return false
      }
    }

    return true
  })

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Aucun événement trouvé</h3>
        <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche</p>
        <Link href="/events">
          <Button variant="outline">Voir tous les événements</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-500">{filteredEvents.length} événements trouvés</p>

      {filteredEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3 h-48 md:h-auto">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge className="absolute top-2 right-2 bg-purple-600">
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </Badge>
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-purple-600 text-lg">{event.price}</span>
                  <Link href={`/events/${event.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">Voir les détails</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}

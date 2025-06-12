import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Données simulées pour les événements
const allEvents = [
  {
    id: "1",
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    location: "Palais de la Culture, Abidjan",
    category: "Concerts",
    status: "active",
    sales: 120,
    revenue: 1800000,
  },
  {
    id: "2",
    title: "Conférence Tech Innovation",
    image: "/placeholder.svg?height=400&width=600",
    date: "22 Juin 2024",
    location: "Centre de Conférences, Dakar",
    category: "Conférences",
    status: "upcoming",
    sales: 45,
    revenue: 225000,
  },
  {
    id: "3",
    title: "Exposition d'Art Contemporain",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 Juillet 2024",
    location: "Galerie Nationale, Lomé",
    category: "Expositions",
    status: "upcoming",
    sales: 30,
    revenue: 60000,
  },
  {
    id: "4",
    title: "Concert de Musique Classique",
    image: "/placeholder.svg?height=400&width=600",
    date: "5 Août 2024",
    location: "Opéra National, Rabat",
    category: "Concerts",
    status: "upcoming",
    sales: 0,
    revenue: 0,
  },
  {
    id: "5",
    title: "Festival de Cinéma 2023",
    image: "/placeholder.svg?height=400&width=600",
    date: "1 Septembre 2023",
    location: "Cinémathèque, Tunis",
    category: "Cinéma",
    status: "past",
    sales: 250,
    revenue: 1250000,
  },
]

interface AdminEventListProps {
  filter: "all" | "active" | "upcoming" | "past"
}

export function AdminEventList({ filter }: AdminEventListProps) {
  // Filtrer les événements en fonction du filtre
  const filteredEvents = allEvents.filter((event) => {
    if (filter === "all") return true
    return event.status === filter
  })

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-md shadow">
        <h3 className="text-lg font-medium mb-2">Aucun événement trouvé</h3>
        <p className="text-gray-500 mb-6">Aucun événement ne correspond à ce filtre</p>
        <Link href="/admin/events/create">
          <Button>Créer un événement</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="truncate max-w-[200px]">
                      <div className="font-medium text-gray-900">{event.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{event.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-[150px]">{event.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{event.category}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{event.sales} billets</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.revenue.toLocaleString()} FCFA</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    className={
                      event.status === "active"
                        ? "bg-green-100 text-green-800"
                        : event.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {event.status === "active" ? "Actif" : event.status === "upcoming" ? "À venir" : "Passé"}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/events/${event.id}`} className="flex items-center w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/events/${event.id}/edit`} className="flex items-center w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

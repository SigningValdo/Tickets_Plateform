import Link from "next/link"
import Image from "next/image"
import { MoreVertical, Calendar, MapPin, Tag, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Event, TicketType, EventStatus } from "@/lib/generated/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export type EventWithTicketTypes = Event & {
  ticketTypes: TicketType[]
  category?: { id: string; name: string }
}

interface AdminEventListProps {
  filter: "all" | "active" | "upcoming" | "past"
  events?: EventWithTicketTypes[]
  isLoading: boolean
  error: Error | null
}

import { useRouter } from "next/navigation"
import axios from "axios"

export function AdminEventList({ filter, events, isLoading, error }: AdminEventListProps) {
  const router = useRouter();

  async function handleDeleteEvent(eventId: string) {
    if (!confirm("Supprimer cet événement ?")) return;
    await axios.delete(`/api/admin/events/${eventId}`)
    router.refresh();
  }

  if (isLoading) {
    return <div className="text-center p-10">Loading events...</div>
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error.message}</div>
  }

  const getEventStatus = (eventDate: Date): EventStatus => {
    const now = new Date()
    const date = new Date(eventDate)
    if (date < now) return "PAST"
    return "UPCOMING"
  }

  const filteredEvents = (events || []).filter(event => {
    if (filter === "all") return true
    const status = getEventStatus(event.date)
    if (filter === "active") {
      return status === "UPCOMING"
    }
    return status.toLowerCase() === filter
  })

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Aucun événement trouvé</h3>
        <p className="text-gray-500 mb-6">Aucun événement ne correspond à ce filtre</p>
        <Link href="/admin/events/create">
          <Button>Créer un événement</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Mobile View */}
      <div className="md:hidden">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
            <div className="flex items-start">
              <Image
                src={event.imageUrl || "/placeholder.svg?height=100&width=100"}
                alt={event.title}
                width={80}
                height={80}
                className="rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold truncate">{event.title}</h3>
                <p className="text-sm text-gray-500">{format(new Date(event.date), "d MMMM yyyy", { locale: fr })}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild><Link href={`/admin/events/${event.id}`}>Voir</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href={`/admin/events/${event.id}/edit`}>Modifier</Link></DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="mr-2 h-4 w-4" /> {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="mr-2 h-4 w-4" /> {event.category?.name || event.categoryId}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Ticket className="mr-2 h-4 w-4" /> {event.ticketTypes.reduce((acc, tt) => acc + tt.quantity, 0)} tickets
              </div>
              <div className="flex items-center pt-2">
                {(() => {
                  const status = getEventStatus(event.date)
                  const statusText = status === "UPCOMING" ? "À venir" : "Passé"
                  const statusColor = status === "UPCOMING" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                      {statusText}
                    </span>
                  )
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Événement</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <Image
                        src={event.imageUrl || "/placeholder.svg"}
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
                    <span>{format(new Date(event.date), "d MMM yyyy", { locale: fr })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-[150px]">{event.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{event.category?.name || event.categoryId}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const status = getEventStatus(event.date)
                    const statusText = status === "UPCOMING" ? "À venir" : "Passé"
                    const statusColor = status === "UPCOMING" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    return (
                      <Badge className={`${statusColor} hover:${statusColor}`}>{statusText}</Badge>
                    )
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild><Link href={`/admin/events/${event.id}`}>Voir</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/admin/events/${event.id}/edit`}>Modifier</Link></DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
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

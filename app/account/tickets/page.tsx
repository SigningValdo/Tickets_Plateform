"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Search, Ticket, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TicketData {
  id: string
  qrCode: string
  status: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  orderId: string
  orderDate: string
  orderTotal: number
  event: {
    id: string
    title: string
    date: string
    location: string
    address: string
    city: string
    imageUrl: string
  }
  ticketType: {
    id: string
    name: string
    price: number
  }
}

export default function AccountTicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user/tickets")
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des billets")
      }
      const data = await res.json()
      setTickets(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const getStatusBadge = (ticket: TicketData) => {
    if (ticket.status === "CANCELLED") {
      return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
    }
    if (ticket.status === "USED") {
      return <Badge className="bg-gray-100 text-gray-800">Utilisé</Badge>
    }
    if (!isUpcoming(ticket.event.date)) {
      return <Badge className="bg-gray-100 text-gray-800">Expiré</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Valide</Badge>
  }

  const filteredTickets = tickets.filter((ticket) =>
    ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const upcomingTickets = filteredTickets.filter(
    (t) => isUpcoming(t.event.date) && t.status === "VALID"
  )
  const pastTickets = filteredTickets.filter(
    (t) => !isUpcoming(t.event.date) || t.status !== "VALID"
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos billets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTickets} className="bg-fanzone-orange hover:bg-fanzone-orange/90">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes billets</h1>
          <p className="text-gray-500">Consultez et gérez tous vos billets</p>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un billet..."
              className="pl-9 w-full sm:w-64 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {tickets.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun billet</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore acheté de billets. Découvrez nos événements !
            </p>
            <Link href="/events">
              <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
                Voir les événements
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              À venir ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Passés ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingTickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Aucun billet à venir</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {upcomingTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto min-h-[200px]">
                        <Image
                          src={ticket.event.imageUrl || "/placeholder.svg"}
                          alt={ticket.event.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-fanzone-orange">
                          {ticket.ticketType.name}
                        </Badge>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{ticket.event.title}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-sm">{formatDate(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{formatTime(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {ticket.event.location}, {ticket.event.city}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="mr-2">
                                Billet #{ticket.id.slice(-8)}
                              </Badge>
                              {getStatusBadge(ticket)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <span className="font-bold text-fanzone-orange text-lg">
                              {formatPrice(ticket.ticketType.price)}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                className="bg-fanzone-orange hover:bg-fanzone-orange/90"
                                onClick={() => router.push(`/account/tickets/${ticket.id}`)}
                              >
                                Voir le billet
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastTickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Aucun billet passé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pastTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto min-h-[200px]">
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                          <Badge className="bg-gray-600">
                            {ticket.status === "CANCELLED" ? "Annulé" : "Événement passé"}
                          </Badge>
                        </div>
                        <Image
                          src={ticket.event.imageUrl || "/placeholder.svg"}
                          alt={ticket.event.title}
                          fill
                          className="object-cover filter grayscale"
                        />
                        <Badge className="absolute top-2 right-2 bg-fanzone-orange z-20">
                          {ticket.ticketType.name}
                        </Badge>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{ticket.event.title}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-sm">{formatDate(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{formatTime(ticket.event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {ticket.event.location}, {ticket.event.city}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="mr-2">
                                Billet #{ticket.id.slice(-8)}
                              </Badge>
                              {getStatusBadge(ticket)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <span className="font-bold text-gray-600 text-lg">
                              {formatPrice(ticket.ticketType.price)}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                onClick={() => router.push(`/account/tickets/${ticket.id}`)}
                              >
                                Voir le billet
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

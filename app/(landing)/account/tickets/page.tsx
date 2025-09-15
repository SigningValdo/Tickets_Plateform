"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Download, Share2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AccountTicketsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Données simulées pour les billets
  const tickets = [
    {
      id: "TIX-123456",
      eventName: "Festival de Jazz",
      eventImage: "/placeholder.svg?height=400&width=600",
      date: "15 Juin 2024",
      time: "19:00",
      location: "Palais de la Culture, Abidjan",
      ticketType: "VIP",
      price: "30000 FCFA",
      status: "upcoming",
      qrCode: "TIX-123456-REF789012",
    },
    {
      id: "TIX-123457",
      eventName: "Conférence Tech Innovation",
      eventImage: "/placeholder.svg?height=400&width=600",
      date: "22 Juin 2024",
      time: "09:00",
      location: "Centre de Conférences, Dakar",
      ticketType: "Standard",
      price: "5000 FCFA",
      status: "upcoming",
      qrCode: "TIX-123457-REF789013",
    },
    {
      id: "TIX-123458",
      eventName: "Exposition d'Art Contemporain",
      eventImage: "/placeholder.svg?height=400&width=600",
      date: "10 Juillet 2024",
      time: "10:00",
      location: "Galerie Nationale, Lomé",
      ticketType: "Standard",
      price: "2000 FCFA",
      status: "upcoming",
      qrCode: "TIX-123458-REF789014",
    },
    {
      id: "TIX-123459",
      eventName: "Festival de Cinéma 2023",
      eventImage: "/placeholder.svg?height=400&width=600",
      date: "1 Septembre 2023",
      time: "18:00",
      location: "Cinémathèque, Tunis",
      ticketType: "Standard",
      price: "5000 FCFA",
      status: "past",
      qrCode: "TIX-123459-REF789015",
    },
    {
      id: "TIX-123460",
      eventName: "Concert de Musique Classique",
      eventImage: "/placeholder.svg?height=400&width=600",
      date: "5 Mars 2023",
      time: "20:00",
      location: "Opéra National, Rabat",
      ticketType: "Premium",
      price: "10000 FCFA",
      status: "past",
      qrCode: "TIX-123460-REF789016",
    },
  ]

  const handleViewTicket = (ticketId: string) => {
    router.push(`/account/tickets/${ticketId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">E-Tickets</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-gray-600 hover:text-purple-600">
              Événements
            </Link>
            <Link href="/account/tickets" className="text-purple-600 font-medium">
              Mes billets
            </Link>
            <Link href="/account/profile" className="text-gray-600 hover:text-purple-600">
              Mon profil
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                JD
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">Jean Dupont</span>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mes billets</h1>
            <p className="text-gray-500">Consultez et gérez tous vos billets</p>
          </div>
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un billet..."
                className="pl-9 w-64 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par événement</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les événements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les événements</SelectItem>
                    <SelectItem value="jazz">Festival de Jazz</SelectItem>
                    <SelectItem value="tech">Conférence Tech Innovation</SelectItem>
                    <SelectItem value="art">Exposition d'Art Contemporain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par date</label>
                <Input type="date" className="w-full" />
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-6">
              {tickets
                .filter((ticket) => ticket.status === "upcoming")
                .map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto">
                        <Image
                          src={ticket.eventImage || "/placeholder.svg"}
                          alt={ticket.eventName}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-purple-600">{ticket.ticketType}</Badge>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{ticket.eventName}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.date}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.time}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="mr-2">
                                Billet #{ticket.id}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800">Valide</Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <span className="font-bold text-purple-600 text-lg">{ticket.price}</span>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                              </Button>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleViewTicket(ticket.id)}
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
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 gap-6">
              {tickets
                .filter((ticket) => ticket.status === "past")
                .map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto">
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Badge className="bg-gray-600">Événement passé</Badge>
                        </div>
                        <Image
                          src={ticket.eventImage || "/placeholder.svg"}
                          alt={ticket.eventName}
                          fill
                          className="object-cover filter grayscale"
                        />
                        <Badge className="absolute top-2 right-2 bg-purple-600">{ticket.ticketType}</Badge>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="font-bold text-xl mb-2">{ticket.eventName}</h3>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.date}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.time}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{ticket.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="mr-2">
                                Billet #{ticket.id}
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-800">Expiré</Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <span className="font-bold text-gray-600 text-lg">{ticket.price}</span>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button variant="outline" onClick={() => handleViewTicket(ticket.id)}>
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
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} E-Tickets. Tous droits réservés.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms" className="hover:text-gray-700">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

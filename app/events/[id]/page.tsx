"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TicketSelection from "@/components/ticket-selection"
import EventMap from "@/components/event-map"
import { useQuery } from "@tanstack/react-query"
import moment from "moment"
import { EventAndCategory } from "@/types"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { data: event } = useQuery({
    queryKey: ["event", params.id],
    queryFn: async (): Promise<EventAndCategory | null> => fetch(`/api/admin/events/${params.id}`).then(res => res.json()),
  })

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
        <p className="mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/events">
          <Button>Retour aux événements</Button>
        </Link>
      </div>
    )
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
            <Link href="/about" className="text-gray-600 hover:text-purple-600">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600">
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" className="hidden sm:inline-flex">
                Connexion
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-purple-600 hover:bg-purple-700">S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative h-64 md:h-96 w-full">
        <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-6">
            <Badge className="mb-2 bg-purple-600">{event.category?.name}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{event.date && moment(event.date).isValid() ? moment(event.date).format("DD MMM YYYY") : "-"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.status}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="location">Lieu</TabsTrigger>
                <TabsTrigger value="organizer">Organisateur</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">À propos de cet événement</h2>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Informations pratiques</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Date et heure</h3>
                          <p className="text-gray-600">
                            {event.date && moment(event.date).isValid() ? moment(event.date).format("DD MMM YYYY") : "-"}, {event.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Lieu</h3>
                          <p className="text-gray-600">{event.location}</p>
                          <p className="text-gray-600">{event.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Organisateur</h3>
                          <p className="text-gray-600">{event.organizer}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Lieu de l'événement</h2>
                    <p className="mb-4">{event.location}</p>
                    <p className="mb-6 text-gray-600">{event.address}</p>
                    <div className="h-80 w-full rounded-md overflow-hidden">
                      <EventMap location={event.location} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organizer">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">À propos de l'organisateur</h2>
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full mr-4"></div>
                      <div>
                        <h3 className="font-bold text-lg">{event.organizer}</h3>
                        <p className="text-gray-600">Organisateur d'événements culturels</p>
                      </div>
                    </div>
                    <p className="mb-4">
                      L'Association Culturelle d'Abidjan est dédiée à la promotion de la culture et des arts en Côte
                      d'Ivoire. Depuis plus de 15 ans, nous organisons des événements culturels de qualité pour mettre
                      en valeur les talents locaux et internationaux.
                    </p>
                    <Button variant="outline" className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Contacter l'organisateur
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Réserver vos billets</h2>
                  <p className="text-purple-600 font-bold text-lg mb-6">{event.status}</p>

                  <TicketSelection tickets={event.ticketTypes} eventId={event.id} />

                  <div className="mt-6 text-sm text-gray-500">
                    <p>Les billets sont envoyés par email et disponibles dans votre espace personnel.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 flex items-center justify-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">E-Tickets</h3>
              <p className="text-gray-400">Votre plateforme de billetterie en ligne sécurisée et fiable.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-white">
                    Événements
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-gray-400 hover:text-white">
                    Politique de remboursement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Nous contacter</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: contact@e-tickets.com</li>
                <li className="text-gray-400">Téléphone: +123 456 789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} E-Tickets. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

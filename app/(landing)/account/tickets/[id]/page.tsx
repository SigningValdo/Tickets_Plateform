"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Download, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import QRCode from "@/components/qr-code"

export default function TicketDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<any>(null)

  useEffect(() => {
    // Simuler le chargement des données du billet
    setTimeout(() => {
      // Données simulées pour le billet
      const ticketData = {
        id: params.id,
        eventName: "Festival de Jazz",
        eventImage: "/placeholder.svg?height=600&width=1200",
        date: "15 Juin 2024",
        time: "19:00 - 23:00",
        location: "Palais de la Culture, Abidjan",
        address: "Boulevard de la République, Abidjan, Côte d'Ivoire",
        ticketType: "VIP",
        price: "30000 FCFA",
        status: "upcoming",
        qrCode: `${params.id}-REF789012`,
        purchaseDate: "15/05/2024",
        seatInfo: "Zone VIP - Accès libre",
        additionalInfo: "Inclut un accès au cocktail d'après-concert et une rencontre avec les artistes.",
      }

      setTicket(ticketData)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-fanzone-orange" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Billet non trouvé</h1>
        <p className="mb-6">Le billet que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/account/tickets">
          <Button>Retour à mes billets</Button>
        </Link>
      </div>
    )
  }

  const handleDownloadTicket = () => {
    // Dans une implémentation réelle, nous générerions un PDF et le téléchargerions
    alert("Téléchargement du billet en PDF...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-fanzone-orange">E-Tickets</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-gray-600 hover:text-fanzone-orange">
              Événements
            </Link>
            <Link href="/account/tickets" className="text-fanzone-orange font-medium">
              Mes billets
            </Link>
            <Link href="/account/profile" className="text-gray-600 hover:text-fanzone-orange">
              Mon profil
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-fanzone-orange font-medium">
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
        <div className="mb-6">
          <Link href="/account/tickets" className="flex items-center text-fanzone-orange hover:text-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à mes billets
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Votre billet électronique</h1>
            <p className="text-gray-600">Présentez ce billet à l'entrée de l'événement pour y accéder</p>
          </div>

          <Card className="overflow-hidden mb-6 border-2 border-purple-200">
            <div className="bg-fanzone-orange text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">Billet électronique</h2>
                  <p className="text-sm text-purple-200">Référence: {ticket.qrCode}</p>
                </div>
                <Badge className="bg-white text-fanzone-orange">{ticket.status === "upcoming" ? "Valide" : "Expiré"}</Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-1">{ticket.eventName}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{ticket.date}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{ticket.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <div>
                        <div>{ticket.location}</div>
                        <div className="text-sm">{ticket.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type de billet</span>
                      <span className="font-medium">{ticket.ticketType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Numéro de billet</span>
                      <span className="font-medium">{ticket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'achat</span>
                      <span className="font-medium">{ticket.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-medium">{ticket.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Placement</span>
                      <span className="font-medium">{ticket.seatInfo}</span>
                    </div>
                  </div>

                  {ticket.additionalInfo && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Informations complémentaires</h4>
                      <p className="text-sm text-gray-600">{ticket.additionalInfo}</p>
                    </div>
                  )}

                  <div className="relative h-32 w-full rounded-md overflow-hidden mb-4">
                    <Image
                      src={ticket.eventImage || "/placeholder.svg"}
                      alt={ticket.eventName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-2 border rounded-md mb-2">
                    <QRCode value={ticket.qrCode} size={180} />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Présentez ce QR code à l'entrée</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button onClick={handleDownloadTicket} className="flex-1 bg-fanzone-orange hover:bg-fanzone-orange/90">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le billet
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Partager le billet
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h4 className="font-medium mb-2">Informations importantes</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Veuillez présenter ce billet à l'entrée de l'événement.</li>
              <li>• Une pièce d'identité pourra vous être demandée.</li>
              <li>• Arrivez au moins 30 minutes avant le début de l'événement.</li>
              <li>• Ce billet est personnel et ne peut être revendu.</li>
            </ul>
          </div>
        </div>
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

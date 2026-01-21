"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Download, Share2, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import QRCode from "@/components/qr-code"

// Données simulées pour les événements
const events = [
  {
    id: "1",
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    time: "19:00 - 23:00",
    location: "Palais de la Culture, Abidjan",
    ticketTypes: [
      { id: "standard", name: "Standard", price: 15000 },
      { id: "vip", name: "VIP", price: 30000 },
      { id: "premium", name: "Premium", price: 50000 },
    ],
  },
  // Autres événements...
]

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [reference, setReference] = useState("")
  const [ticketId, setTicketId] = useState("")

  useEffect(() => {
    const orderId = searchParams.get("orderId")

    // If we have a real orderId from Orange redirect, fetch its tickets and redirect to the first ticket page
    if (orderId) {
      (async () => {
        try {
          const res = await fetch(`/api/orders/${orderId}/tickets`)
          if (res.ok) {
            const tickets = await res.json()
            if (Array.isArray(tickets) && tickets.length > 0) {
              const first = tickets[0]
              router.replace(`/tickets/${first.id}`)
              return
            }
          }
        } catch (e) {
          console.error(e)
        }
        // fallback to events list if nothing found
        router.replace("/events")
      })()
      return
    }

    // Legacy simulated flow using eventId/reference
    const eventId = searchParams.get("eventId")
    const ref = searchParams.get("reference")

    if (!eventId || !ref) {
      router.push("/events")
      return
    }

    setReference(ref)
    setTicketId(`TIX-${Math.floor(Math.random() * 1000000)}`)
    const foundEvent = events.find((e) => e.id === eventId)
    if (!foundEvent) {
      router.push("/events")
      return
    }
    setEvent(foundEvent)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [searchParams, router])

  const handleDownloadTicket = () => {
    // Dans une implémentation réelle, nous générerions un PDF et le téléchargerions
    alert("Téléchargement du billet en PDF...")
  }

  if (isLoading || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange mb-4" />
        <p className="text-gray-600">Génération de votre billet...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-fanzone-orange">E-Tickets</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Paiement confirmé !</h1>
            <p className="text-gray-600">
              Votre billet a été généré avec succès. Vous recevrez également une copie par email.
            </p>
          </div>

          <Card className="overflow-hidden mb-6 border-2 border-purple-200">
            <div className="bg-fanzone-orange text-white p-4">
              <h2 className="font-bold text-lg">Billet électronique</h2>
              <p className="text-sm text-purple-200">Référence: {reference}</p>
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                    <p className="text-gray-600">
                      {event.date}, {event.time}
                    </p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billet</span>
                      <span className="font-medium">Standard</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Numéro de billet</span>
                      <span className="font-medium">{ticketId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'achat</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="relative h-32 w-full rounded-md overflow-hidden mb-4">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white p-2 border rounded-md mb-2">
                    <QRCode value={`${ticketId}-${reference}`} size={150} />
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

          <div className="text-center">
            <Link href="/account/tickets">
              <Button variant="link" className="text-fanzone-orange">
                Voir tous mes billets
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
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

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}

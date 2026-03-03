"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, Download, Share2, ArrowLeft, Loader2, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import QRCode from "@/components/qr-code"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TicketData {
  id: string
  qrCode: string
  status: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  event: {
    id: string
    title: string
    description: string
    date: string
    location: string
    address: string
    city: string
    country: string
    organizer: string
    imageUrl: string
  }
  ticketType: {
    id: string
    name: string
    price: number
  }
  order: {
    id: string
    totalAmount: number
    status: string
    createdAt: string
  }
}

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/user/tickets/${id}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la récupération du billet")
      }
      const data = await res.json()
      setTicket(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelTicket = async () => {
    try {
      setCancelling(true)
      const res = await fetch(`/api/user/tickets/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'annulation du billet")
      }
      // Refresh ticket data
      await fetchTicket()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
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

  const getStatusBadge = () => {
    if (!ticket) return null
    if (ticket.status === "CANCELLED") {
      return <Badge className="bg-red-500 text-white">Annulé</Badge>
    }
    if (ticket.status === "USED") {
      return <Badge className="bg-gray-500 text-white">Utilisé</Badge>
    }
    if (!isUpcoming(ticket.event.date)) {
      return <Badge className="bg-gray-500 text-white">Expiré</Badge>
    }
    return <Badge className="bg-green-500 text-white">Valide</Badge>
  }

  const canCancel = () => {
    if (!ticket) return false
    return (
      ticket.status === "VALID" &&
      isUpcoming(ticket.event.date)
    )
  }

  const handleDownloadTicket = () => {
    // TODO: Implement PDF generation
    alert("La fonctionnalité de téléchargement PDF sera bientôt disponible.")
  }

  const handleShare = async () => {
    if (navigator.share && ticket) {
      try {
        await navigator.share({
          title: `Mon billet pour ${ticket.event.title}`,
          text: `J'ai un billet pour ${ticket.event.title} le ${formatDate(ticket.event.date)}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papier !")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange mx-auto mb-4" />
          <p className="text-gray-600">Chargement du billet...</p>
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
            <Link href="/account/tickets">
              <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
                Retour à mes billets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Billet non trouvé</h1>
        <p className="mb-6">Le billet que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/account/tickets">
          <Button>Retour à mes billets</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
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
                <p className="text-sm text-purple-200">Référence: {ticket.id.slice(-8).toUpperCase()}</p>
              </div>
              {getStatusBadge()}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{ticket.event.title}</h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatDate(ticket.event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatTime(ticket.event.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                    <div>
                      <div>{ticket.event.location}</div>
                      <div className="text-sm">{ticket.event.address}, {ticket.event.city}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type de billet</span>
                    <span className="font-medium">{ticket.ticketType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro de billet</span>
                    <span className="font-medium">{ticket.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Titulaire</span>
                    <span className="font-medium">{ticket.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'achat</span>
                    <span className="font-medium">{formatDate(ticket.order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix</span>
                    <span className="font-medium">{formatPrice(ticket.ticketType.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organisateur</span>
                    <span className="font-medium">{ticket.event.organizer}</span>
                  </div>
                </div>

                <div className="relative h-32 w-full rounded-md overflow-hidden mb-4">
                  <Image
                    src={ticket.event.imageUrl || "/placeholder.svg"}
                    alt={ticket.event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 border-2 border-gray-200 rounded-lg mb-2">
                  <QRCode value={ticket.qrCode} size={180} />
                </div>
                <p className="text-sm text-gray-500 text-center">Présentez ce QR code à l'entrée</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleDownloadTicket}
            className="flex-1 bg-fanzone-orange hover:bg-fanzone-orange/90"
            disabled={ticket.status === "CANCELLED"}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger le billet
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager le billet
          </Button>
          {canCancel() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Annuler le billet
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Annuler ce billet ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le billet sera annulé et ne pourra plus être utilisé pour accéder à l'événement.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Non, garder le billet</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelTicket}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Annulation...
                      </>
                    ) : (
                      "Oui, annuler le billet"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h4 className="font-medium mb-2">Informations importantes</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>Veuillez présenter ce billet à l'entrée de l'événement.</li>
            <li>Une pièce d'identité pourra vous être demandée.</li>
            <li>Arrivez au moins 30 minutes avant le début de l'événement.</li>
            <li>Ce billet est personnel et ne peut être revendu.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

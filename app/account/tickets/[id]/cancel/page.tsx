"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { AlertTriangle, XCircle, ArrowLeft, Loader2, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface TicketInfo {
  id: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketType: string
  price: number
  purchaseDate: string
  canCancel: boolean
  refundAmount: number
  refundPolicy: string
}

export default function CancelTicketPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        // Dans une implémentation réelle, nous appellerions une API pour récupérer les infos du billet
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Données simulées
        const mockTicket: TicketInfo = {
          id: params.id as string,
          eventTitle: "Concert de Jazz - Miles Davis Tribute",
          eventDate: "2024-02-15T20:00:00Z",
          eventLocation: "Palais des Congrès, Yaoundé",
          ticketType: "VIP",
          price: 25000,
          purchaseDate: "2024-01-10T14:30:00Z",
          canCancel: true,
          refundAmount: 22500, // 90% de remboursement
          refundPolicy: "Remboursement à 90% jusqu'à 48h avant l'événement"
        }
        
        setTicketInfo(mockTicket)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du billet",
          variant: "destructive",
        })
        router.push('/account/tickets')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTicketInfo()
    }
  }, [params.id, router, toast])

  const handleCancel = async () => {
    if (!ticketInfo || confirmText !== 'ANNULER') {
      toast({
        title: "Erreur",
        description: "Veuillez taper 'ANNULER' pour confirmer",
        variant: "destructive",
      })
      return
    }

    setIsCancelling(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour annuler le billet
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Billet annulé",
        description: `Votre billet a été annulé. Remboursement de ${ticketInfo.refundAmount.toLocaleString()} FCFA en cours.`,
      })

      // Rediriger vers la liste des billets
      router.push('/account/tickets')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleGoBack = () => {
    router.push(`/account/tickets/${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des informations du billet...</p>
        </div>
      </div>
    )
  }

  if (!ticketInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Billet introuvable</CardTitle>
            <CardDescription>Le billet demandé n'existe pas ou n'est plus accessible.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/account/tickets" className="w-full">
              <Button className="w-full">Retour aux billets</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!ticketInfo.canCancel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Annulation impossible</CardTitle>
            <CardDescription>Ce billet ne peut plus être annulé selon notre politique de remboursement.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/account/tickets/${params.id}`} className="w-full">
              <Button className="w-full">Retour au billet</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const eventDate = new Date(ticketInfo.eventDate)
  const purchaseDate = new Date(ticketInfo.purchaseDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-fanzone-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
          
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Annuler le billet
          </CardTitle>
          
          <CardDescription className="text-gray-600">
            Vous êtes sur le point d'annuler votre billet. Cette action est irréversible.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Détails du billet</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-900">{ticketInfo.eventTitle}</h5>
                <Badge variant="outline" className="mt-1">{ticketInfo.ticketType}</Badge>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {eventDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {eventDate.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {ticketInfo.eventLocation}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Informations de remboursement</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Prix payé :</span>
                <span className="font-medium text-blue-900">{ticketInfo.price.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Montant remboursé :</span>
                <span className="font-medium text-blue-900">{ticketInfo.refundAmount.toLocaleString()} FCFA</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">{ticketInfo.refundPolicy}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Attention : Action irréversible</h4>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  <li>• Votre billet sera définitivement annulé</li>
                  <li>• Vous ne pourrez plus accéder à l'événement</li>
                  <li>• Le remboursement prendra 3-5 jours ouvrables</li>
                  <li>• Cette action ne peut pas être annulée</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Pour confirmer, tapez <span className="font-bold text-red-600">ANNULER</span> ci-dessous :
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Tapez ANNULER"
              disabled={isCancelling}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleCancel}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isCancelling || confirmText !== 'ANNULER'}
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Annulation en cours...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Annuler définitivement le billet
              </>
            )}
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
            disabled={isCancelling}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au billet
          </Button>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Questions sur l'annulation ?{" "}
            <Link href="/contact" className="text-fanzone-orange hover:text-purple-500">
              Contactez notre support
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
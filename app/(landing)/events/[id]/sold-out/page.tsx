"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { AlertCircle, Calendar, MapPin, Clock, Users, Bell, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface EventInfo {
  id: string
  title: string
  date: string
  location: string
  description: string
  image: string
  originalPrice: number
  soldOutDate: string
  totalTickets: number
  category: string
}

export default function SoldOutEventPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [isNotifying, setIsNotifying] = useState(false)
  const [isNotified, setIsNotified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        // Dans une implémentation réelle, nous appellerions une API pour récupérer les infos de l'événement
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Données simulées
        const mockEvent: EventInfo = {
          id: params.id as string,
          title: "Concert de Jazz - Miles Davis Tribute",
          date: "2024-02-15T20:00:00Z",
          location: "Palais des Congrès, Yaoundé",
          description: "Une soirée exceptionnelle dédiée au légendaire Miles Davis avec les meilleurs musiciens de jazz du Cameroun.",
          image: "/api/placeholder/600/400",
          originalPrice: 15000,
          soldOutDate: "2024-01-20T10:30:00Z",
          totalTickets: 500,
          category: "Musique"
        }
        
        setEventInfo(mockEvent)
        
        // Vérifier si l'utilisateur est déjà notifié
        const notificationStatus = localStorage.getItem(`notification_${mockEvent.id}`)
        setIsNotified(notificationStatus === 'true')
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l'événement",
          variant: "destructive",
        })
        router.push('/events')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEventInfo()
    }
  }, [params.id, router, toast])

  const handleNotifyMe = async () => {
    if (!eventInfo) return

    setIsNotifying(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour s'inscrire aux notifications
      await new Promise((resolve) => setTimeout(resolve, 1500))

      localStorage.setItem(`notification_${eventInfo.id}`, 'true')
      setIsNotified(true)

      toast({
        title: "Notification activée",
        description: "Vous serez notifié si des billets se libèrent ou pour des événements similaires",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      })
    } finally {
      setIsNotifying(false)
    }
  }

  const handleShare = async () => {
    if (!eventInfo) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: eventInfo.title,
          text: `Découvrez cet événement : ${eventInfo.title}`,
          url: window.location.href,
        })
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Lien copié",
          description: "Le lien de l'événement a été copié dans le presse-papiers",
        })
      }
    } catch (error) {
      // Ignore l'erreur si l'utilisateur annule le partage
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Chargement des informations de l'événement...</p>
        </div>
      </div>
    )
  }

  if (!eventInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Événement introuvable</CardTitle>
            <CardDescription>L'événement demandé n'existe pas ou n'est plus accessible.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/events" className="w-full">
              <Button className="w-full">Voir tous les événements</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const eventDate = new Date(eventInfo.date)
  const soldOutDate = new Date(eventInfo.soldOutDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
          
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image et statut */}
          <div className="lg:col-span-2">
            <Card>
              <div className="relative">
                <img
                  src={eventInfo.image}
                  alt={eventInfo.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-600 text-white">
                    COMPLET
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {eventInfo.title}
                    </CardTitle>
                    <Badge variant="outline" className="mb-4">
                      {eventInfo.category}
                    </Badge>
                  </div>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>
                      {eventDate.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>
                      {eventDate.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span>{eventInfo.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <span>{eventInfo.totalTickets} places (toutes vendues)</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{eventInfo.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statut complet */}
            <Card>
              <CardHeader className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <CardTitle className="text-xl text-red-600">Événement complet</CardTitle>
                <CardDescription>
                  Tous les billets ont été vendus le{" "}
                  {soldOutDate.toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Informations importantes</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Aucun billet disponible</li>
                    <li>• Prix original : {eventInfo.originalPrice.toLocaleString()} FCFA</li>
                    <li>• {eventInfo.totalTickets} places vendues</li>
                  </ul>
                </div>
                
                {!isNotified ? (
                  <Button
                    onClick={handleNotifyMe}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isNotifying}
                  >
                    {isNotifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Activation...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Me notifier
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <Bell className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">Notifications activées</p>
                    <p className="text-xs text-green-600 mt-1">
                      Vous serez notifié pour des événements similaires
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions alternatives */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Que faire maintenant ?</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <Link href="/events" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Voir d'autres événements
                  </Button>
                </Link>
                
                <Link href={`/events?category=${eventInfo.category}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Événements similaires
                  </Button>
                </Link>
                
                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Contacter l'organisateur
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
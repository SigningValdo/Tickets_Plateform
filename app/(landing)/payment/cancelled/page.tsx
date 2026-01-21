"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft, ShoppingCart, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function PaymentCancelledContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventId, setEventId] = useState<string | null>(null)
  const [eventTitle, setEventTitle] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const evtId = searchParams.get('event_id')
    const evtTitle = searchParams.get('event_title')
    const sessId = searchParams.get('session_id')
    
    setEventId(evtId)
    setEventTitle(evtTitle)
    setSessionId(sessId)
  }, [searchParams])

  const handleReturnToCheckout = () => {
    if (eventId) {
      router.push(`/checkout?event_id=${eventId}`)
    } else {
      router.push('/events')
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
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
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Paiement annulé
          </CardTitle>
          
          <CardDescription className="text-gray-600">
            Vous avez annulé le processus de paiement. Aucun montant n'a été débité de votre compte.
          </CardDescription>

          {sessionId && (
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                Session: {sessionId}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {eventTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Événement sélectionné</h4>
              <p className="text-blue-700 font-medium">{eventTitle}</p>
              <p className="text-xs text-blue-600 mt-1">Vos billets sont toujours disponibles</p>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800">Que se passe-t-il maintenant ?</h4>
                <ul className="text-sm text-orange-700 mt-1 space-y-1">
                  <li>• Aucun paiement n'a été effectué</li>
                  <li>• Vos billets ne sont pas réservés</li>
                  <li>• Vous pouvez reprendre votre achat</li>
                  <li>• Les prix peuvent changer</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ShoppingCart className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Conseils pour votre prochain achat</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Vérifiez vos informations de paiement</li>
                  <li>• Assurez-vous d'avoir une connexion stable</li>
                  <li>• Préparez vos informations à l'avance</li>
                  <li>• Contactez-nous en cas de problème</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleReturnToCheckout}
            className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Reprendre l'achat
          </Button>
          
          <div className="flex space-x-3 w-full">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            <Link href="/events" className="flex-1">
              <Button variant="outline" className="w-full">
                Voir les événements
              </Button>
            </Link>
          </div>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Questions sur le paiement ?{" "}
            <Link href="/contact" className="text-fanzone-orange hover:text-purple-500">
              Contactez notre support
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-16 w-16 text-gray-400 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Chargement...
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCancelledContent />
    </Suspense>
  )
}
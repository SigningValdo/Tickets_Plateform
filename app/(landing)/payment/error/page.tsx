"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft, RefreshCw, CreditCard, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type PaymentErrorType = 'declined' | 'insufficient_funds' | 'expired_card' | 'network_error' | 'timeout' | 'unknown'

interface PaymentErrorInfo {
  type: PaymentErrorType
  title: string
  description: string
  canRetry: boolean
  icon: React.ReactNode
}

const errorTypes: Record<PaymentErrorType, PaymentErrorInfo> = {
  declined: {
    type: 'declined',
    title: 'Paiement refusé',
    description: 'Votre carte bancaire a été refusée. Vérifiez vos informations ou utilisez une autre carte.',
    canRetry: true,
    icon: <XCircle className="h-16 w-16 text-red-500" />
  },
  insufficient_funds: {
    type: 'insufficient_funds',
    title: 'Fonds insuffisants',
    description: 'Le solde de votre compte est insuffisant pour effectuer cette transaction.',
    canRetry: true,
    icon: <CreditCard className="h-16 w-16 text-orange-500" />
  },
  expired_card: {
    type: 'expired_card',
    title: 'Carte expirée',
    description: 'Votre carte bancaire a expiré. Veuillez utiliser une carte valide.',
    canRetry: true,
    icon: <XCircle className="h-16 w-16 text-red-500" />
  },
  network_error: {
    type: 'network_error',
    title: 'Erreur de connexion',
    description: 'Problème de connexion avec le service de paiement. Veuillez réessayer.',
    canRetry: true,
    icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />
  },
  timeout: {
    type: 'timeout',
    title: 'Délai dépassé',
    description: 'La transaction a pris trop de temps. Veuillez réessayer.',
    canRetry: true,
    icon: <AlertTriangle className="h-16 w-16 text-orange-500" />
  },
  unknown: {
    type: 'unknown',
    title: 'Erreur de paiement',
    description: 'Une erreur inattendue s\'est produite lors du paiement.',
    canRetry: true,
    icon: <XCircle className="h-16 w-16 text-red-500" />
  }
}

function PaymentErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorInfo, setErrorInfo] = useState<PaymentErrorInfo>(errorTypes.unknown)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    const errorType = searchParams.get('type') as PaymentErrorType
    const txId = searchParams.get('transaction_id')
    const evtId = searchParams.get('event_id')
    
    setTransactionId(txId)
    setEventId(evtId)
    
    if (errorType && errorTypes[errorType]) {
      setErrorInfo(errorTypes[errorType])
    }
  }, [searchParams])

  const handleRetryPayment = () => {
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
            {errorInfo.icon}
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600">
            {errorInfo.description}
          </CardDescription>

          {transactionId && (
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                Transaction: {transactionId}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Que s'est-il passé ?</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errorInfo.type === 'declined' && (
                <>
                  <li>• Vérifiez le numéro de carte</li>
                  <li>• Vérifiez la date d'expiration</li>
                  <li>• Vérifiez le code CVV</li>
                  <li>• Contactez votre banque si nécessaire</li>
                </>
              )}
              {errorInfo.type === 'insufficient_funds' && (
                <>
                  <li>• Vérifiez le solde de votre compte</li>
                  <li>• Utilisez une autre carte</li>
                  <li>• Contactez votre banque</li>
                </>
              )}
              {errorInfo.type === 'expired_card' && (
                <>
                  <li>• Utilisez une carte valide</li>
                  <li>• Vérifiez la date d'expiration</li>
                </>
              )}
              {(errorInfo.type === 'network_error' || errorInfo.type === 'timeout') && (
                <>
                  <li>• Vérifiez votre connexion internet</li>
                  <li>• Réessayez dans quelques minutes</li>
                  <li>• Contactez le support si le problème persiste</li>
                </>
              )}
              {errorInfo.type === 'unknown' && (
                <>
                  <li>• Réessayez le paiement</li>
                  <li>• Vérifiez vos informations</li>
                  <li>• Contactez le support</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Moyens de paiement acceptés</h4>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <span>• Cartes bancaires</span>
              <span>• Orange Money</span>
              <span>• Mobile Money</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          {errorInfo.canRetry && (
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer le paiement
            </Button>
          )}
          
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
            Besoin d'aide ?{" "}
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
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

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentErrorContent />
    </Suspense>
  )
}
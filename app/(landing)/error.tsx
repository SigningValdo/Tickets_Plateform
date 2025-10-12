"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur pour le monitoring
    console.error('Application error:', error)
  }, [error])

  const handleRefresh = () => {
    // Recharger la page
    window.location.reload()
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
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Erreur serveur
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            Une erreur inattendue s'est produite. Nos équipes ont été notifiées et travaillent à résoudre le problème.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Détails de l'erreur (développement)</h4>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-800 mb-2">Que pouvez-vous faire ?</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Actualisez la page</li>
              <li>• Vérifiez votre connexion internet</li>
              <li>• Réessayez dans quelques minutes</li>
              <li>• Contactez le support si le problème persiste</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <RefreshCw className="h-8 w-8 text-blue-600 mb-2" />
              <h5 className="font-medium text-gray-900">Actualiser</h5>
              <p className="text-sm text-gray-600">Recharger la page</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Mail className="h-8 w-8 text-green-600 mb-2" />
              <h5 className="font-medium text-gray-900">Support</h5>
              <p className="text-sm text-gray-600">Obtenir de l'aide</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <div className="flex space-x-3 w-full">
            <Button
              onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
            
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex-1"
            >
              Actualiser
            </Button>
          </div>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Problème persistant ?{" "}
            <Link href="/contact" className="text-fanzone-orange hover:text-purple-500">
              Contactez notre support technique
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
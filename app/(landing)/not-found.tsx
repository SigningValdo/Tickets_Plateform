"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Search, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
          
          <div className="text-8xl font-bold text-purple-600 mb-4">404</div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Page introuvable
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-800 mb-2">Que pouvez-vous faire ?</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Vérifiez l'URL dans la barre d'adresse</li>
              <li>• Retournez à la page précédente</li>
              <li>• Visitez notre page d'accueil</li>
              <li>• Recherchez des événements</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/events" className="block">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <Ticket className="h-8 w-8 text-purple-600 mb-2" />
                <h5 className="font-medium text-gray-900">Événements</h5>
                <p className="text-sm text-gray-600">Découvrir tous les événements</p>
              </div>
            </Link>
            
            <Link href="/about" className="block">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <Search className="h-8 w-8 text-purple-600 mb-2" />
                <h5 className="font-medium text-gray-900">À propos</h5>
                <p className="text-sm text-gray-600">En savoir plus sur nous</p>
              </div>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Link href="/" className="w-full">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{" "}
            <Link href="/contact" className="text-purple-600 hover:text-purple-500">
              Contactez notre support
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
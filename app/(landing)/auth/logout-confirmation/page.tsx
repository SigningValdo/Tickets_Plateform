"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LogoutConfirmationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour déconnecter l'utilisateur
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Supprimer les tokens/données de session du localStorage/cookies
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })

      // Rediriger vers la page d'accueil
      router.push("/")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-fanzone-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
          <div className="flex justify-center mb-4">
            <LogOut className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Confirmer la déconnexion</CardTitle>
          <CardDescription className="text-gray-600">
            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <LogOut className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800">Après déconnexion</h4>
                <ul className="text-sm text-orange-700 mt-1 space-y-1">
                  <li>• Vous perdrez l'accès à votre compte</li>
                  <li>• Vos billets ne seront plus accessibles</li>
                  <li>• Vous devrez vous reconnecter</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Déconnexion...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Oui, me déconnecter
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full"
            disabled={isLoggingOut}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Annuler
          </Button>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{" "}
            <Link href="/contact" className="text-fanzone-orange hover:text-purple-500">
              Contactez-nous
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired'

export default function EmailVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [isResending, setIsResending] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    setToken(tokenParam)
    setEmail(emailParam)

    if (tokenParam) {
      verifyEmail(tokenParam)
    } else {
      setStatus('error')
    }
  }, [searchParams])

  const verifyEmail = async (verificationToken: string) => {
    try {
      // Dans une implémentation réelle, nous appellerions une API pour vérifier l'email
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simuler différents scénarios
      const random = Math.random()
      if (random > 0.8) {
        setStatus('expired')
      } else if (random > 0.1) {
        setStatus('success')
        toast({
          title: "Email vérifié",
          description: "Votre adresse email a été vérifiée avec succès",
        })
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const resendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Erreur",
        description: "Adresse email non trouvée",
        variant: "destructive",
      })
      return
    }

    setIsResending(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour renvoyer l'email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email envoyé",
        description: "Un nouvel email de vérification a été envoyé",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de vérification",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Vérification en cours</CardTitle>
              <CardDescription className="text-gray-600">
                Nous vérifions votre adresse email, veuillez patienter...
              </CardDescription>
            </CardHeader>
          </>
        )

      case 'success':
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Email vérifié</CardTitle>
              <CardDescription className="text-gray-600">
                Votre adresse email a été vérifiée avec succès. Vous allez être redirigé vers la page de connexion.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/auth/login">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Se connecter maintenant
                </Button>
              </Link>
            </CardFooter>
          </>
        )

      case 'expired':
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-orange-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Lien expiré</CardTitle>
              <CardDescription className="text-gray-600">
                Le lien de vérification a expiré. Vous pouvez demander un nouveau lien de vérification.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={resendVerificationEmail}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Renvoyer l'email de vérification
                  </>
                )}
              </Button>
              <Link href="/auth/login" className="text-purple-600 hover:text-purple-500">
                Retour à la connexion
              </Link>
            </CardFooter>
          </>
        )

      case 'error':
      default:
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Erreur de vérification</CardTitle>
              <CardDescription className="text-gray-600">
                Le lien de vérification est invalide ou une erreur est survenue. Veuillez réessayer.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              {email && (
                <Button
                  onClick={resendVerificationEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Renvoyer l'email de vérification
                    </>
                  )}
                </Button>
              )}
              <Link href="/auth/register" className="w-full">
                <Button variant="outline" className="w-full">
                  Créer un nouveau compte
                </Button>
              </Link>
              <Link href="/auth/login" className="text-purple-600 hover:text-purple-500">
                Retour à la connexion
              </Link>
            </CardFooter>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center pt-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
        </div>
        {renderContent()}
      </Card>
    </div>
  )
}
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour envoyer un email de réinitialisation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simuler une réponse réussie
      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600">E-Tickets</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Mot de passe oublié</h2>
          <p className="mt-2 text-gray-600">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>

        <Card>
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle>Réinitialisation du mot de passe</CardTitle>
                <CardDescription>
                  Nous vous enverrons un email avec un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Email envoyé</CardTitle>
                <CardDescription>Vérifiez votre boîte de réception</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                  <p>
                    Si un compte existe avec l'adresse email <strong>{email}</strong>, vous recevrez un email contenant
                    un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Si vous ne recevez pas d'email dans les prochaines minutes, vérifiez votre dossier de spam ou essayez
                  à nouveau avec une autre adresse email.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                  Essayer avec une autre adresse
                </Button>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Retour à la connexion</Button>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

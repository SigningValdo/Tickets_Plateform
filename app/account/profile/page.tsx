"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { User, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    createdAt: "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false,
  })

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        createdAt: "",
      })
      setIsLoading(false)
    }
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
        }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la mise à jour")
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      })
      form.reset()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value,
    })

    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences de notification ont été mises à jour.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const userInitials = userData.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-fanzone-orange" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-fanzone-orange text-2xl font-bold mb-4">
                  {userInitials}
                </div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-fanzone-orange bg-purple-50">
                  <User className="h-4 w-4 mr-2" />
                  Informations personnelles
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/account/tickets">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Mes billets
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-3/4">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">L'email ne peut pas être modifié.</p>
                    </div>

                    <Button type="submit" className="bg-fanzone-orange hover:bg-fanzone-orange/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Mise à jour en cours...
                        </>
                      ) : (
                        "Mettre à jour le profil"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input id="currentPassword" name="currentPassword" type="password" required />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" name="newPassword" type="password" required />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </div>
                    <Button type="submit" className="bg-fanzone-orange hover:bg-fanzone-orange/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Mise à jour en cours...
                        </>
                      ) : (
                        "Changer le mot de passe"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des notifications par email concernant vos billets et événements.
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">Notifications par SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des notifications par SMS concernant vos billets et événements.
                        </p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="eventReminders">Rappels d'événements</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des rappels avant les événements auxquels vous participez.
                        </p>
                      </div>
                      <Switch
                        id="eventReminders"
                        checked={notifications.eventReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate("eventReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Emails marketing</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevez des offres spéciales et des recommandations d'événements.
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationUpdate("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

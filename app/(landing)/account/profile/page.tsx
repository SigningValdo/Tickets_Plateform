"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Données simulées de l'utilisateur
  const [userData, setUserData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+225 01 23 45 67 89",
    address: "123 Rue Principale",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    bio: "Amateur de musique et d'événements culturels. J'aime découvrir de nouveaux artistes et participer à des festivals.",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false,
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler une mise à jour du profil
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    }, 1500)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler une mise à jour du mot de passe
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      })
    }, 1500)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-fanzone-orange">E-Tickets</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-gray-600 hover:text-fanzone-orange">
              Événements
            </Link>
            <Link href="/account/tickets" className="text-gray-600 hover:text-fanzone-orange">
              Mes billets
            </Link>
            <Link href="/account/profile" className="text-fanzone-orange font-medium">
              Mon profil
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-fanzone-orange font-medium">
                JD
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">
                {userData.firstName} {userData.lastName}
              </span>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                    {userData.firstName.charAt(0)}
                    {userData.lastName.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-gray-500">{userData.email}</p>
                  <p className="text-sm text-gray-400 mt-2">Membre depuis Mai 2023</p>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/profile">
                      <User className="h-4 w-4 mr-2" />
                      Informations personnelles
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/account/tickets">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Mes billets
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-200">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nom</Label>
                          <Input id="lastName" name="lastName" value={userData.lastName} onChange={handleInputChange} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" name="phone" value={userData.phone} onChange={handleInputChange} />
                      </div>

                      <div>
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" name="address" value={userData.address} onChange={handleInputChange} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Ville</Label>
                          <Input id="city" name="city" value={userData.city} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="country">Pays</Label>
                          <Input id="country" name="country" value={userData.country} onChange={handleInputChange} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={userData.bio} onChange={handleInputChange} rows={4} />
                      </div>

                      <Button type="submit" className="bg-fanzone-orange hover:bg-fanzone-orange/90" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
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
                        <Input id="currentPassword" type="password" required />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input id="newPassword" type="password" required />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input id="confirmPassword" type="password" required />
                      </div>
                      <Button type="submit" className="bg-fanzone-orange hover:bg-fanzone-orange/90" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
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
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} E-Tickets. Tous droits réservés.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms" className="hover:text-gray-700">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

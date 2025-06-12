"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Home, Settings, LogOut, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler une sauvegarde
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès.",
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-purple-600">E-Tickets Admin</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Événements</span>
            </Link>
            <Link
              href="/admin/tickets"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Billets</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Utilisateurs</span>
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Rapports</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </Link>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t">
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200">
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <span className="text-xl font-bold text-purple-600">E-Tickets Admin</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Home className="h-5 w-5" />
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Événements</span>
            </Link>
            <Link
              href="/admin/tickets"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Billets</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Utilisateurs</span>
            </Link>
            <Link
              href="/admin/reports"
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Rapports</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200">
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-500" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                  AD
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-gray-500">Configurez les paramètres de votre plateforme</p>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <form onSubmit={handleSaveSettings}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Informations de la plateforme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="platformName">Nom de la plateforme</Label>
                      <Input id="platformName" defaultValue="E-Tickets" />
                    </div>
                    <div>
                      <Label htmlFor="platformDescription">Description</Label>
                      <Textarea
                        id="platformDescription"
                        defaultValue="Plateforme de billetterie en ligne pour tous vos événements"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email de contact</Label>
                      <Input id="contactEmail" type="email" defaultValue="contact@e-tickets.com" />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Téléphone de contact</Label>
                      <Input id="contactPhone" defaultValue="+123 456 789" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Paramètres régionaux</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger id="defaultLanguage">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                          <SelectItem value="es">Espagnol</SelectItem>
                          <SelectItem value="ar">Arabe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                      <Select defaultValue="xof">
                        <SelectTrigger id="defaultCurrency">
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xof">Franc CFA (FCFA)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="usd">Dollar américain ($)</SelectItem>
                          <SelectItem value="mad">Dirham marocain (MAD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select defaultValue="africa_abidjan">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Sélectionner un fuseau horaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa_abidjan">Afrique/Abidjan (GMT+0)</SelectItem>
                          <SelectItem value="africa_casablanca">Afrique/Casablanca (GMT+1)</SelectItem>
                          <SelectItem value="africa_dakar">Afrique/Dakar (GMT+0)</SelectItem>
                          <SelectItem value="africa_tunis">Afrique/Tunis (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Réseaux sociaux</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="facebookUrl">Facebook</Label>
                      <Input id="facebookUrl" defaultValue="https://facebook.com/etickets" />
                    </div>
                    <div>
                      <Label htmlFor="twitterUrl">Twitter</Label>
                      <Input id="twitterUrl" defaultValue="https://twitter.com/etickets" />
                    </div>
                    <div>
                      <Label htmlFor="instagramUrl">Instagram</Label>
                      <Input id="instagramUrl" defaultValue="https://instagram.com/etickets" />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="payment">
              <form onSubmit={handleSaveSettings}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Méthodes de paiement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableCreditCard">Cartes bancaires</Label>
                        <p className="text-sm text-muted-foreground">
                          Accepter les paiements par carte bancaire (Visa, Mastercard)
                        </p>
                      </div>
                      <Switch id="enableCreditCard" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableOrangeMoney">Orange Money</Label>
                        <p className="text-sm text-muted-foreground">Accepter les paiements via Orange Money</p>
                      </div>
                      <Switch id="enableOrangeMoney" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableMtnMoney">MTN Mobile Money</Label>
                        <p className="text-sm text-muted-foreground">Accepter les paiements via MTN Mobile Money</p>
                      </div>
                      <Switch id="enableMtnMoney" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enablePayPal">PayPal</Label>
                        <p className="text-sm text-muted-foreground">Accepter les paiements via PayPal</p>
                      </div>
                      <Switch id="enablePayPal" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Frais de service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="serviceFeeType">Type de frais</Label>
                      <Select defaultValue="percentage">
                        <SelectTrigger id="serviceFeeType">
                          <SelectValue placeholder="Sélectionner un type de frais" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage</SelectItem>
                          <SelectItem value="fixed">Montant fixe</SelectItem>
                          <SelectItem value="mixed">Mixte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="serviceFeePercentage">Pourcentage (%)</Label>
                      <Input id="serviceFeePercentage" type="number" defaultValue="5" />
                    </div>
                    <div>
                      <Label htmlFor="serviceFeeFixed">Montant fixe (FCFA)</Label>
                      <Input id="serviceFeeFixed" type="number" defaultValue="500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showServiceFee">Afficher les frais de service</Label>
                        <p className="text-sm text-muted-foreground">
                          Afficher les frais de service séparément lors du paiement
                        </p>
                      </div>
                      <Switch id="showServiceFee" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleSaveSettings}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Configuration des emails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                      <Input id="senderName" defaultValue="E-Tickets" />
                    </div>
                    <div>
                      <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
                      <Input id="senderEmail" type="email" defaultValue="noreply@e-tickets.com" />
                    </div>
                    <div>
                      <Label htmlFor="emailProvider">Fournisseur d'email</Label>
                      <Select defaultValue="smtp">
                        <SelectTrigger id="emailProvider">
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailchimp">Mailchimp</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="smtpHost">Hôte SMTP</Label>
                      <Input id="smtpHost" defaultValue="smtp.example.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">Port SMTP</Label>
                      <Input id="smtpPort" defaultValue="587" />
                    </div>
                    <div>
                      <Label htmlFor="smtpUsername">Nom d'utilisateur SMTP</Label>
                      <Input id="smtpUsername" defaultValue="user@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                      <Input id="smtpPassword" type="password" defaultValue="••••••••" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableSsl">Activer SSL/TLS</Label>
                        <p className="text-sm text-muted-foreground">
                          Utiliser une connexion sécurisée pour l'envoi d'emails
                        </p>
                      </div>
                      <Switch id="enableSsl" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Modèles d'emails</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email de confirmation d'achat</Label>
                        <p className="text-sm text-muted-foreground">Envoyé après l'achat d'un billet</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email de rappel d'événement</Label>
                        <p className="text-sm text-muted-foreground">Envoyé avant un événement</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email de bienvenue</Label>
                        <p className="text-sm text-muted-foreground">Envoyé lors de la création d'un compte</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email de réinitialisation de mot de passe</Label>
                        <p className="text-sm text-muted-foreground">
                          Envoyé lors d'une demande de réinitialisation de mot de passe
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <form onSubmit={handleSaveSettings}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Paramètres de sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable2fa">Authentification à deux facteurs</Label>
                        <p className="text-sm text-muted-foreground">
                          Exiger l'authentification à deux facteurs pour les administrateurs
                        </p>
                      </div>
                      <Switch id="enable2fa" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableCaptcha">Protection CAPTCHA</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer la protection CAPTCHA pour les formulaires
                        </p>
                      </div>
                      <Switch id="enableCaptcha" defaultChecked />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                      <Input id="sessionTimeout" type="number" defaultValue="30" />
                    </div>
                    <div>
                      <Label htmlFor="passwordPolicy">Politique de mot de passe</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger id="passwordPolicy">
                          <SelectValue placeholder="Sélectionner une politique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basique (min. 8 caractères)</SelectItem>
                          <SelectItem value="medium">Moyenne (min. 8 caractères, lettres et chiffres)</SelectItem>
                          <SelectItem value="strong">
                            Forte (min. 10 caractères, lettres, chiffres et symboles)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxLoginAttempts">Nombre maximal de tentatives de connexion</Label>
                      <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableIpBlocking">Blocage d'IP</Label>
                        <p className="text-sm text-muted-foreground">
                          Bloquer les adresses IP après plusieurs tentatives de connexion échouées
                        </p>
                      </div>
                      <Switch id="enableIpBlocking" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Journaux d'audit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableAuditLogs">Activer les journaux d'audit</Label>
                        <p className="text-sm text-muted-foreground">
                          Enregistrer toutes les actions des administrateurs
                        </p>
                      </div>
                      <Switch id="enableAuditLogs" defaultChecked />
                    </div>
                    <div>
                      <Label htmlFor="logRetentionPeriod">Période de conservation des journaux (jours)</Label>
                      <Input id="logRetentionPeriod" type="number" defaultValue="90" />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Voir les journaux
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

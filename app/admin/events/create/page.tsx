"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Menu, X, Home, Settings, LogOut, ArrowLeft, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketTypes, setTicketTypes] = useState([{ id: 1, name: "", price: "", quantity: "" }])

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { id: Date.now(), name: "", price: "", quantity: "" }])
  }

  const removeTicketType = (id: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== id))
    }
  }

  const updateTicketType = (id: number, field: string, value: string) => {
    setTicketTypes(ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler une requête API
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Événement créé",
        description: "Votre événement a été créé avec succès",
      })
      router.push("/admin/events")
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
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
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
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
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
            <Link href="/admin/events" className="flex items-center text-purple-600 hover:text-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux événements
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Créer un nouvel événement</h1>
            <p className="text-gray-500">Remplissez les informations ci-dessous pour créer un nouvel événement</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre de l'événement *
                      </label>
                      <Input id="title" placeholder="Ex: Festival de Jazz" required />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez votre événement en détail..."
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie *
                        </label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concerts">Concerts</SelectItem>
                            <SelectItem value="conferences">Conférences</SelectItem>
                            <SelectItem value="expositions">Expositions</SelectItem>
                            <SelectItem value="festivals">Festivals</SelectItem>
                            <SelectItem value="theatre">Théâtre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                          Organisateur *
                        </label>
                        <Input id="organizer" placeholder="Nom de l'organisateur" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Date et lieu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <Input id="date" type="date" required />
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Heure *
                        </label>
                        <Input id="time" type="time" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Lieu *
                      </label>
                      <Input id="location" placeholder="Ex: Palais de la Culture" required />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse complète *
                      </label>
                      <Input id="address" placeholder="Adresse complète du lieu" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          Ville *
                        </label>
                        <Input id="city" placeholder="Ex: Abidjan" required />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Pays *
                        </label>
                        <Input id="country" placeholder="Ex: Côte d'Ivoire" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Types de billets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <div key={ticket.id} className="p-4 border rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Type de billet #{index + 1}</h4>
                          {ticketTypes.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTicketType(ticket.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                            <Input
                              placeholder="Ex: Standard"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(ticket.id, "name", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                            <Input
                              type="number"
                              placeholder="Ex: 15000"
                              value={ticket.price}
                              onChange={(e) => updateTicketType(ticket.id, "price", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantité disponible *
                            </label>
                            <Input
                              type="number"
                              placeholder="Ex: 100"
                              value={ticket.quantity}
                              onChange={(e) => updateTicketType(ticket.id, "quantity", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTicketType}
                      className="w-full flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un type de billet
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image de l'événement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <div className="mb-4 bg-gray-100 p-2 rounded-full">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 text-center mb-2">
                        Glissez-déposez une image ici ou cliquez pour parcourir
                      </p>
                      <p className="text-xs text-gray-400 text-center">PNG, JPG ou JPEG (max. 2MB)</p>
                      <input type="file" className="hidden" accept="image/*" />
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Parcourir
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statut et visibilité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut de l'événement</label>
                      <Select defaultValue="draft">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                          <SelectItem value="upcoming">À venir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                      <Select defaultValue="public">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une visibilité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Privé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Votre événement sera visible par tous les utilisateurs une fois publié.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Création en cours..." : "Créer l'événement"}
                      </Button>
                      <Button type="button" variant="outline" className="w-full">
                        Enregistrer comme brouillon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Home, Settings, LogOut, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function AdminTicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Données simulées pour les billets
  const tickets = [
    {
      id: "TIX-123456",
      eventName: "Festival de Jazz",
      customerName: "Jean Dupont",
      customerEmail: "jean.dupont@example.com",
      purchaseDate: "15/05/2024",
      ticketType: "VIP",
      price: "30000 FCFA",
      status: "used",
    },
    {
      id: "TIX-123457",
      eventName: "Festival de Jazz",
      customerName: "Marie Martin",
      customerEmail: "marie.martin@example.com",
      purchaseDate: "16/05/2024",
      ticketType: "Standard",
      price: "15000 FCFA",
      status: "valid",
    },
    {
      id: "TIX-123458",
      eventName: "Conférence Tech Innovation",
      customerName: "Pierre Dubois",
      customerEmail: "pierre.dubois@example.com",
      purchaseDate: "10/05/2024",
      ticketType: "Standard",
      price: "5000 FCFA",
      status: "valid",
    },
    {
      id: "TIX-123459",
      eventName: "Exposition d'Art Contemporain",
      customerName: "Sophie Lefebvre",
      customerEmail: "sophie.lefebvre@example.com",
      purchaseDate: "12/05/2024",
      ticketType: "Standard",
      price: "2000 FCFA",
      status: "valid",
    },
    {
      id: "TIX-123460",
      eventName: "Festival de Jazz",
      customerName: "Thomas Bernard",
      customerEmail: "thomas.bernard@example.com",
      purchaseDate: "14/05/2024",
      ticketType: "Premium",
      price: "50000 FCFA",
      status: "cancelled",
    },
  ]

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
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Événements</span>
            </Link>
            <Link
              href="/admin/tickets"
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un billet..."
                  className="pl-9 w-64 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestion des billets</h1>
              <p className="text-gray-500">Consultez et gérez tous les billets vendus</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter les données
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par événement</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les événements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les événements</SelectItem>
                      <SelectItem value="jazz">Festival de Jazz</SelectItem>
                      <SelectItem value="tech">Conférence Tech Innovation</SelectItem>
                      <SelectItem value="art">Exposition d'Art Contemporain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par statut</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="valid">Valide</SelectItem>
                      <SelectItem value="used">Utilisé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3 flex justify-end">
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Appliquer les filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="valid">Valides</TabsTrigger>
              <TabsTrigger value="used">Utilisés</TabsTrigger>
              <TabsTrigger value="cancelled">Annulés</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Billet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'achat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.eventName}</td>
                          <td className="px-6 py-4">
                            <div>{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.purchaseDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.ticketType}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{ticket.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                ticket.status === "valid"
                                  ? "bg-green-100 text-green-800"
                                  : ticket.status === "used"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {ticket.status === "valid" ? "Valide" : ticket.status === "used" ? "Utilisé" : "Annulé"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm" className="text-purple-600">
                              Détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="valid">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Billet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'achat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets
                        .filter((ticket) => ticket.status === "valid")
                        .map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.eventName}</td>
                            <td className="px-6 py-4">
                              <div>{ticket.customerName}</div>
                              <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.purchaseDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.ticketType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-green-100 text-green-800">Valide</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm" className="text-purple-600">
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="used">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Billet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'achat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets
                        .filter((ticket) => ticket.status === "used")
                        .map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.eventName}</td>
                            <td className="px-6 py-4">
                              <div>{ticket.customerName}</div>
                              <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.purchaseDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.ticketType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-blue-100 text-blue-800">Utilisé</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm" className="text-purple-600">
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cancelled">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Billet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'achat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tickets
                        .filter((ticket) => ticket.status === "cancelled")
                        .map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.eventName}</td>
                            <td className="px-6 py-4">
                              <div>{ticket.customerName}</div>
                              <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.purchaseDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.ticketType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ticket.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-red-100 text-red-800">Annulé</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button variant="ghost" size="sm" className="text-purple-600">
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">Affichage de 5 billets sur 5</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

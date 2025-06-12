"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Home, Settings, LogOut, PlusCircle, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminEventList } from "@/components/admin-event-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un événement..."
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
              <h1 className="text-2xl font-bold">Gestion des événements</h1>
              <p className="text-gray-500">Créez, modifiez et gérez tous vos événements</p>
            </div>
            <Link href="/admin/events/create">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un événement
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par catégorie</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="concerts">Concerts</SelectItem>
                      <SelectItem value="conferences">Conférences</SelectItem>
                      <SelectItem value="expositions">Expositions</SelectItem>
                      <SelectItem value="festivals">Festivals</SelectItem>
                      <SelectItem value="theatre">Théâtre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par date</label>
                  <Input type="date" className="w-full" />
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
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="past">Passés</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AdminEventList filter="all" />
            </TabsContent>
            <TabsContent value="active">
              <AdminEventList filter="active" />
            </TabsContent>
            <TabsContent value="upcoming">
              <AdminEventList filter="upcoming" />
            </TabsContent>
            <TabsContent value="past">
              <AdminEventList filter="past" />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">Affichage de 5 événements sur 5</div>
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

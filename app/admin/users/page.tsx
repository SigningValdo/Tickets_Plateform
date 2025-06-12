"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Home, Settings, LogOut, Search, Filter, Download, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Données simulées pour les utilisateurs
  const users = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      role: "user",
      status: "active",
      registrationDate: "10/01/2024",
      lastLogin: "17/05/2024",
      ticketsPurchased: 5,
    },
    {
      id: "2",
      name: "Marie Martin",
      email: "marie.martin@example.com",
      role: "user",
      status: "active",
      registrationDate: "15/02/2024",
      lastLogin: "16/05/2024",
      ticketsPurchased: 3,
    },
    {
      id: "3",
      name: "Pierre Dubois",
      email: "pierre.dubois@example.com",
      role: "admin",
      status: "active",
      registrationDate: "05/12/2023",
      lastLogin: "17/05/2024",
      ticketsPurchased: 0,
    },
    {
      id: "4",
      name: "Sophie Lefebvre",
      email: "sophie.lefebvre@example.com",
      role: "user",
      status: "inactive",
      registrationDate: "20/03/2024",
      lastLogin: "10/04/2024",
      ticketsPurchased: 1,
    },
    {
      id: "5",
      name: "Thomas Bernard",
      email: "thomas.bernard@example.com",
      role: "user",
      status: "blocked",
      registrationDate: "05/01/2024",
      lastLogin: "15/03/2024",
      ticketsPurchased: 2,
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
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Billets</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <Calendar className="h-5 w-5" />
              <span>Billets</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-md"
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
                  placeholder="Rechercher un utilisateur..."
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
              <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
              <p className="text-gray-500">Consultez et gérez tous les utilisateurs de la plateforme</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par rôle</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
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
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="blocked">Bloqué</SelectItem>
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
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="blocked">Bloqués</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernière connexion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billets achetés
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
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-purple-600">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={user.role === "admin" ? "border-purple-200 text-purple-600" : ""}
                            >
                              {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.registrationDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.ticketsPurchased}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "inactive"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {user.status === "active" ? "Actif" : user.status === "inactive" ? "Inactif" : "Bloqué"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                {user.status === "active" ? (
                                  <DropdownMenuItem className="text-yellow-600">Désactiver</DropdownMenuItem>
                                ) : user.status === "inactive" ? (
                                  <DropdownMenuItem className="text-green-600">Activer</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">Débloquer</DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernière connexion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billets achetés
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
                      {users
                        .filter((user) => user.status === "active")
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-purple-600">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={user.role === "admin" ? "border-purple-200 text-purple-600" : ""}
                              >
                                {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.registrationDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.ticketsPurchased}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-green-100 text-green-800">Actif</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem className="text-yellow-600">Désactiver</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inactive">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernière connexion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billets achetés
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
                      {users
                        .filter((user) => user.status === "inactive")
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-purple-600">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.registrationDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.ticketsPurchased}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-yellow-100 text-yellow-800">Inactif</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem className="text-green-600">Activer</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blocked">
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernière connexion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billets achetés
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
                      {users
                        .filter((user) => user.status === "blocked")
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-purple-600">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.registrationDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.ticketsPurchased}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-red-100 text-red-800">Bloqué</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem className="text-green-600">Débloquer</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
            <div className="text-sm text-gray-500">Affichage de 5 utilisateurs sur 5</div>
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

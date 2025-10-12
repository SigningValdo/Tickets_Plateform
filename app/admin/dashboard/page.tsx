"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  Home,
  Calendar,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Search,
  TrendingUp,
  DollarSign,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSalesChart } from "@/components/admin-sales-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminEventList } from "@/components/admin-event-list";

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">
          Bienvenue dans votre espace administrateur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ventes totales</p>
                <h3 className="text-2xl font-bold">1,250,000 FCFA</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% ce mois
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-fanzone-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Billets vendus</p>
                <h3 className="text-2xl font-bold">458</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% ce mois
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Événements actifs</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2 ce mois
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Utilisateurs</p>
                <h3 className="text-2xl font-bold">1,245</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.3% ce mois
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Ventes des 30 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSalesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ventes par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Concerts</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-fanzone-orange h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Conférences</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Festivals</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Théâtre</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Autres</span>
                  <span className="text-sm font-medium">5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-600 h-2 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Événements récents</h2>
        <Link href="/admin/events/create">
          <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un événement
          </Button>
        </Link>
      </div> */}

      {/* <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AdminEventList
            filter="all"
            isLoading={false}
            error={null}
            events={[]}
          />
        </TabsContent>
        <TabsContent value="active">
          <AdminEventList
            filter="active"
            isLoading={false}
            error={null}
            events={[]}
          />
        </TabsContent>
        <TabsContent value="upcoming">
          <AdminEventList
            filter="upcoming"
            isLoading={false}
            error={null}
            events={[]}
          />
        </TabsContent>
        <TabsContent value="past">
          <AdminEventList
            filter="past"
            isLoading={false}
            error={null}
            events={[]}
          />
        </TabsContent>
      </Tabs> */}
    </main>
  );
}

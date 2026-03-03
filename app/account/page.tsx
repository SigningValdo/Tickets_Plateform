"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface TicketData {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    city: string;
    imageUrl: string;
  };
  ticketType: {
    name: string;
    price: number;
  };
}

interface DashboardStats {
  totalTickets: number;
  upcomingEvents: number;
  totalSpent: number;
  validTickets: number;
}

export default function AccountDashboardPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    upcomingEvents: 0,
    totalSpent: 0,
    validTickets: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);

        // Calculate stats
        const now = new Date();
        const upcomingTickets = data.filter(
          (t: TicketData) =>
            new Date(t.event.date) > now && t.status === "VALID"
        );
        const totalSpent = data.reduce(
          (acc: number, t: TicketData) => acc + t.ticketType.price,
          0
        );
        const validTickets = data.filter(
          (t: TicketData) => t.status === "VALID"
        );

        setStats({
          totalTickets: data.length,
          upcomingEvents: upcomingTickets.length,
          totalSpent: totalSpent,
          validTickets: validTickets.length,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  // Get upcoming tickets (max 3)
  const upcomingTickets = tickets
    .filter((t) => isUpcoming(t.event.date) && t.status === "VALID")
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-fanzone-orange" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">
          Bienvenue, {session?.user?.name || "Utilisateur"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total billets</p>
                <h3 className="text-2xl font-bold">{stats.totalTickets}</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.validTickets} valides
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Ticket className="h-6 w-6 text-fanzone-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Événements à venir</p>
                <h3 className="text-2xl font-bold">{stats.upcomingEvents}</h3>
                <p className="text-blue-600 text-sm flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Prochainement
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total dépensé</p>
                <h3 className="text-2xl font-bold">
                  {formatPrice(stats.totalSpent)}
                </h3>
                <p className="text-gray-500 text-sm flex items-center mt-1">
                  Sur tous vos billets
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 font-bold text-lg">F</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Billets valides</p>
                <h3 className="text-2xl font-bold">{stats.validTickets}</h3>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Prêts à utiliser
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Ticket className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Prochains événements</h2>
        <Link href="/account/tickets">
          <Button variant="outline" className="text-fanzone-orange">
            Voir tous mes billets
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>

      {upcomingTickets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun événement à venir
            </h3>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas de billets pour des événements à venir.
            </p>
            <Link href="/events">
              <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90">
                Découvrir les événements
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image
                  src={ticket.event.imageUrl || "/placeholder.svg"}
                  alt={ticket.event.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-fanzone-orange">
                  {ticket.ticketType.name}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">
                  {ticket.event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(ticket.event.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(ticket.event.date)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {ticket.event.location}, {ticket.event.city}
                  </div>
                </div>
                <Link href={`/account/tickets/${ticket.id}`}>
                  <Button className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90">
                    Voir le billet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/events">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-fanzone-orange" />
                </div>
                <div>
                  <h3 className="font-semibold">Découvrir les événements</h3>
                  <p className="text-sm text-gray-500">
                    Parcourir les événements disponibles
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/tickets">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Ticket className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Mes billets</h3>
                  <p className="text-sm text-gray-500">
                    Gérer tous vos billets
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/account/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-green-600 font-bold text-lg">P</span>
                </div>
                <div>
                  <h3 className="font-semibold">Mon profil</h3>
                  <p className="text-sm text-gray-500">
                    Modifier vos informations
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

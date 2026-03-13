"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Ticket,
  Loader2,
  AlertCircle,
  Eye,
  ArrowRight,
  Filter,
} from "lucide-react";

interface TicketData {
  id: string;
  qrCode: string;
  status: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  orderId: string;
  orderDate: string;
  orderTotal: number;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    address: string;
    city: string;
    imageUrl: string;
  };
  ticketType: {
    id: string;
    name: string;
    price: number;
  };
}

export default function AccountTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "valid" | "upcoming" | "past"
  >("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/tickets");
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des billets");
      }
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const isUpcoming = (dateString: string) => new Date(dateString) > new Date();

  const getStatusInfo = (ticket: TicketData) => {
    if (ticket.status === "CANCELLED")
      return {
        label: "Annulé",
        bg: "bg-red/10",
        text: "text-red",
        dot: "bg-red",
      };
    if (ticket.status === "USED")
      return {
        label: "Utilisé",
        bg: "bg-gris4/30",
        text: "text-gris2",
        dot: "bg-gris2",
      };
    if (!isUpcoming(ticket.event.date))
      return {
        label: "Expiré",
        bg: "bg-gris4/30",
        text: "text-gris2",
        dot: "bg-gris2",
      };
    return {
      label: "Valide",
      bg: "bg-green/10",
      text: "text-green",
      dot: "bg-green",
    };
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const validTickets = filteredTickets.filter(
    (t) => t.status === "VALID" && isUpcoming(t.event.date),
  );
  const upcomingTickets = filteredTickets.filter((t) =>
    isUpcoming(t.event.date),
  );
  const pastTickets = filteredTickets.filter(
    (t) => !isUpcoming(t.event.date) || t.status !== "VALID",
  );

  const displayedTickets =
    activeTab === "all"
      ? filteredTickets
      : activeTab === "valid"
        ? validTickets
        : activeTab === "upcoming"
          ? upcomingTickets
          : pastTickets;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-green" />
          </div>
          <p className="text-gris2 text-sm">Chargement de vos billets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red" />
          </div>
          <h2 className="text-lg font-bold text-black mb-2">
            Une erreur est survenue
          </h2>
          <p className="text-sm text-gris2 mb-6">{error}</p>
          <button
            onClick={fetchTickets}
            className="h-11 px-8 rounded-xl bg-green text-white text-sm font-medium hover:bg-green/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Mes billets</h1>
          <p className="text-gris2 text-sm mt-1">
            {tickets.length} billet{tickets.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris2 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un billet..."
              className="w-full sm:w-72 h-11 pl-11 pr-4 rounded-xl border border-gris4 bg-white text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center">
              <Ticket className="h-4.5 w-4.5 text-green" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black">{tickets.length}</p>
          <p className="text-xs text-gris2 mt-0.5">Total billets</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center">
              <Calendar className="h-4.5 w-4.5 text-green" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black">
            {upcomingTickets.length}
          </p>
          <p className="text-xs text-gris2 mt-0.5">À venir</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gris4/30 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 text-gris2" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black">{pastTickets.length}</p>
          <p className="text-xs text-gris2 mt-0.5">Passés</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-yellow/10 flex items-center justify-center">
              <Filter className="h-4.5 w-4.5 text-yellow" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black">
            {tickets.filter((t) => t.status === "VALID").length}
          </p>
          <p className="text-xs text-gris2 mt-0.5">Valides</p>
        </div>
      </div>

      {tickets.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-14 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <Ticket className="h-10 w-10 text-green" />
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Aucun billet</h2>
          <p className="text-sm text-gris2 mb-8 max-w-xs mx-auto">
            Vous n&apos;avez pas encore acheté de billets. Découvrez nos
            événements et réservez dès maintenant !
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-green text-white text-sm font-medium hover:bg-green/90 transition-colors"
          >
            Voir les événements
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white rounded-xl w-fit mb-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            {(
              [
                { key: "all", label: "Tous", count: filteredTickets.length },
                { key: "valid", label: "Valides", count: validTickets.length },
                {
                  key: "upcoming",
                  label: "À venir",
                  count: upcomingTickets.length,
                },
                { key: "past", label: "Passés", count: pastTickets.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-green text-white shadow-sm"
                    : "text-gris2 hover:text-black"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {displayedTickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gris4/20 flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-7 w-7 text-gris2" />
              </div>
              <p className="text-sm text-gris2">
                {activeTab === "all"
                  ? "Aucun billet trouvé"
                  : activeTab === "valid"
                    ? "Aucun billet valide"
                    : activeTab === "upcoming"
                      ? "Aucun billet à venir"
                      : "Aucun billet passé"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedTickets.map((ticket) => {
                const status = getStatusInfo(ticket);
                const isPast =
                  !isUpcoming(ticket.event.date) || ticket.status !== "VALID";

                const borderColor =
                  status.label === "Valide"
                    ? "border-t-green"
                    : status.label === "Annulé"
                      ? "border-t-red"
                      : "border-t-gris4";

                return (
                  <div
                    key={ticket.id}
                    onClick={() => router.push(`/account/tickets/${ticket.id}`)}
                    className={`bg-white rounded-2xl overflow-hidden cursor-pointer  group`}
                  >
                    {/* Image */}
                    <div className="relative w-full h-52 overflow-hidden">
                      {isPast && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <span className="px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                            {ticket.status === "CANCELLED"
                              ? "Annulé"
                              : "Événement passé"}
                          </span>
                        </div>
                      )}
                      <Image
                        src={ticket.event.imageUrl || "/placeholder.svg"}
                        alt={ticket.event.title}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? "grayscale" : ""}`}
                      />
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
                        <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-black text-xs font-semibold">
                          {ticket.ticketType.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium backdrop-blur-sm ${status.bg} ${status.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-semibold text-base text-black line-clamp-1 group-hover:text-green transition-colors mb-3">
                          {ticket.event.title}
                        </h3>

                        <div className="space-y-2.5 grid grid-cols-2 mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-4 w-4 text-green" />
                            </div>
                            <div>
                              <p className="text-[11px] text-gris2 uppercase tracking-wider">
                                Date
                              </p>
                              <p className="text-sm text-black font-medium">
                                {formatDate(ticket.event.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-green" />
                            </div>
                            <div>
                              <p className="text-[11px] text-gris2 uppercase tracking-wider">
                                Heure
                              </p>
                              <p className="text-sm text-black font-medium">
                                {formatTime(ticket.event.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-4 w-4 text-green" />
                            </div>
                            <div>
                              <p className="text-[11px] text-gris2 uppercase tracking-wider">
                                Lieu
                              </p>
                              <p className="text-sm text-black font-medium line-clamp-1">
                                {ticket.event.location}, {ticket.event.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-bg text-xs text-gris2 font-mono">
                          #{ticket.id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gris4/30">
                        <span
                          className={`font-bold text-lg ${
                            isPast ? "text-gris2" : "text-green"
                          }`}
                        >
                          {formatPrice(ticket.ticketType.price)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                            isPast ? "text-gris2" : "text-green"
                          }`}
                        >
                          <Eye className="h-4 w-4" />
                          Voir
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

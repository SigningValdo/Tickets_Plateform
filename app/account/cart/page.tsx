"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Loader2,
  AlertCircle,
  Trash2,
  CreditCard,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface OrderData {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  tickets: {
    id: string;
    name: string;
    email: string | null;
    ticketType: {
      id: string;
      name: string;
      price: number;
    };
    event: {
      id: string;
      title: string;
      date: string;
      location: string;
      city: string;
      imageUrl: string;
    };
  }[];
}

export default function CartPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/user/orders");
      if (!res.ok) throw new Error("Erreur lors de la récupération");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      const res = await fetch("/api/user/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'annulation");
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Commande annulée avec succès");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handleRetryPayment = async (orderId: string) => {
    setPayingId(orderId);
    try {
      const res = await fetch("/api/user/orders/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.orderId) {
        window.location.href = `/confirmation?orderId=${data.orderId}`;
      }
    } catch (err: any) {
      toast.error(err.message);
      setPayingId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
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

  const getTimeSince = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `il y a ${days}j`;
    if (hours > 0) return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes}min`;
    return "à l'instant";
  };

  // Group tickets by event within an order
  const getOrderSummary = (order: OrderData) => {
    const grouped: Record<
      string,
      {
        event: OrderData["tickets"][0]["event"];
        items: { typeName: string; price: number; count: number }[];
      }
    > = {};

    for (const ticket of order.tickets) {
      const eventId = ticket.event.id;
      if (!grouped[eventId]) {
        grouped[eventId] = { event: ticket.event, items: [] };
      }
      const existing = grouped[eventId].items.find(
        (i) => i.typeName === ticket.ticketType.name
      );
      if (existing) {
        existing.count++;
      } else {
        grouped[eventId].items.push({
          typeName: ticket.ticketType.name,
          price: ticket.ticketType.price,
          count: 1,
        });
      }
    }

    return Object.values(grouped);
  };

  const totalPending = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2">Chargement de votre panier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Erreur</h2>
          <p className="text-gris2 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="h-12 px-8 rounded-2xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mon panier</h1>
          <p className="text-gris2 text-sm mt-1">
            Vos commandes en attente de paiement
          </p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={fetchOrders}
            className="hidden sm:flex items-center gap-2 px-4 h-10 rounded-2xl border border-gris4 text-gris2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-12 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-green" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gris2 mb-8">
            Vous n&apos;avez aucune commande en attente de paiement.
            Découvrez nos événements !
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition-colors"
          >
            <Ticket className="h-4 w-4" />
            Voir les événements
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Orders list */}
          <div className="flex-1 space-y-4">
            {orders.map((order) => {
              const summary = getOrderSummary(order);
              const isProcessing =
                payingId === order.id || cancellingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gris4/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">
                          Commande #{order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-gris2">
                          {getTimeSince(order.createdAt)} · En attente de
                          paiement
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  {/* Events in order */}
                  {summary.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-6 border-b border-gris4/30 last:border-0"
                    >
                      <div className="flex gap-4">
                        {/* Event image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={group.event.imageUrl || "/placeholder.svg"}
                            alt={group.event.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Event info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/events/${group.event.id}`}
                            className="text-sm font-bold text-navy hover:text-green transition-colors line-clamp-1"
                          >
                            {group.event.title}
                          </Link>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-gris2">
                              <Calendar className="h-3 w-3" />
                              {formatDate(group.event.date)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gris2">
                              <Clock className="h-3 w-3" />
                              {formatTime(group.event.date)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gris2">
                              <MapPin className="h-3 w-3" />
                              {group.event.location}, {group.event.city}
                            </span>
                          </div>

                          {/* Ticket types */}
                          <div className="mt-3 space-y-1">
                            {group.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gris2">
                                  {item.count}x {item.typeName}
                                </span>
                                <span className="font-medium text-navy">
                                  {formatPrice(item.price * item.count)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 px-6 py-4 bg-bg/50">
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 h-10 px-5 rounded-2xl border border-red/30 text-red text-sm font-medium hover:bg-red/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {cancellingId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Annuler
                    </button>
                    <button
                      onClick={() => handleRetryPayment(order.id)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {payingId === order.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirection...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Payer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-navy mb-4">Résumé</h3>
              <div className="space-y-3 mb-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gris2 truncate mr-2">
                      #{order.id.slice(-8)} ({order.tickets.length}{" "}
                      billet{order.tickets.length > 1 ? "s" : ""})
                    </span>
                    <span className="font-medium text-navy whitespace-nowrap">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gris4/30 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gris2">
                    Total en attente
                  </span>
                  <span className="text-lg font-bold text-navy">
                    {formatPrice(totalPending)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-yellow/5 border border-yellow/20 p-3.5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gris2">
                  Ces commandes sont en attente de paiement. Cliquez sur
                  &quot;Payer&quot; pour finaliser votre achat.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

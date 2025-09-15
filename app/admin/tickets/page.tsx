"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, Download, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

export default function AdminTicketsPage() {
  const [showEdit, setShowEdit] = useState(false);
  const [editTicket, setEditTicket] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Données réelles via API
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filtreStatus, setFiltreStatus] = useState<string>("all");
  const [filtreEvent, setFiltreEvent] = useState<string>("all");
  const [filtreType, setFiltreType] = useState<string>("all");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const { toast } = useToast();

  // Pour les filtres dynamiques
  const [events, setEvents] = useState<
    { id: string; title: string; ticketTypes: { id: string; name: string }[] }[]
  >([]);
  const [ticketTypes, setTicketTypes] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/events")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setEvents(
          data.map((e: any) => ({
            id: e.id,
            title: e.title,
            ticketTypes: e.ticketTypes || [],
          }))
        );
        // Fusionne tous les ticketTypes uniques de tous les events
        const allTypes = data.flatMap((e: any) => e.ticketTypes || []);
        const uniqueTypes = Array.from(
          new Map(allTypes.map((tt: any) => [tt.id, tt])).values()
        );
        setTicketTypes(uniqueTypes as { id: string; name: string }[]);
      })
      .catch(() => {
        setEvents([]);
        setTicketTypes([]);
      });
  }, []);

  // Reset filtre si option disparue
  useEffect(() => {
    if (filtreEvent !== "all" && !events.some((e) => e.id === filtreEvent))
      setFiltreEvent("all");
    if (filtreType !== "all" && !ticketTypes.some((tt) => tt.id === filtreType))
      setFiltreType("all");
  }, [events, ticketTypes]);

  // Debounce pour la recherche QR code
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const params = [
      `page=${page}`,
      `limit=${limit}`,
      filtreStatus !== "all" ? `status=${filtreStatus}` : null,
      filtreEvent !== "all" ? `eventId=${filtreEvent}` : null,
      filtreType !== "all" ? `ticketTypeId=${filtreType}` : null,
      debouncedQuery ? `q=${encodeURIComponent(debouncedQuery)}` : null,
    ]
      .filter(Boolean)
      .join("&");
    fetch(`/api/admin/tickets?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setTickets(data.tickets);
        setTotal(data.total);
        setLimit(data.limit);
        setError(null);
      })
      .catch((err) => {
        setError(
          "Erreur lors du chargement des billets : " + (err.message || err)
        );
      })
      .finally(() => setLoading(false));
  }, [page, limit, filtreStatus, filtreEvent, filtreType, debouncedQuery]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      const res = await fetch(`/api/admin/tickets/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setTickets(prev => prev.filter(t => t.id !== toDelete.id));
      toast({ title: "Billet supprimé" });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur est survenue";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Chargement des billets...
      </div>
    );
  }

  return (
    <div>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion des billets</h1>
            <p className="text-gray-500">
              Consultez et gérez tous les billets vendus
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter les données
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par événement
            </label>
            <Select value={filtreEvent} onValueChange={setFiltreEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les événements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les événements</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par type de billet
            </label>
            <Select value={filtreType} onValueChange={setFiltreType}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {ticketTypes.map((tt) => (
                  <SelectItem key={tt.id} value={tt.id}>
                    {tt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut
            </label>
            <Select value={filtreStatus} onValueChange={setFiltreStatus}>
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
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.event?.title || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.order?.userId || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.ticketType?.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.ticketType?.price
                            ? ticket.ticketType.price + " FCFA"
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className={
                              "rounded px-2 py-1 border text-xs " +
                              (ticket.status === "VALID"
                                ? "bg-green-100 text-green-800"
                                : ticket.status === "USED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800")
                            }
                            value={ticket.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                const res = await fetch(
                                  `/api/admin/tickets/${ticket.id}`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      ...ticket,
                                      status: newStatus,
                                    }),
                                  }
                                );
                                if (!res.ok) throw new Error(await res.text());
                                setTickets((prev) =>
                                  prev.map((t) =>
                                    t.id === ticket.id
                                      ? { ...t, status: newStatus }
                                      : t
                                  )
                                );
                                alert("Statut mis à jour");
                              } catch (e: any) {
                                alert(
                                  "Erreur lors du changement de statut : " +
                                    (e.message || e)
                                );
                              }
                            }}
                          >
                            <option value="VALID">Valide</option>
                            <option value="USED">Utilisé</option>
                            <option value="INVALID">Invalide</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Link href={`/admin/tickets/${ticket.id}`}>
                                  Détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/admin/events/${ticket.eventId}/edit`}
                                >
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => { setToDelete(ticket); setDeleteOpen(true) }}
                              >
                                Supprimer
                              </DropdownMenuItem>
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
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.eventName}
                          </td>
                          <td className="px-6 py-4">
                            <div>{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {ticket.customerEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.purchaseDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.ticketType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800">
                              Valide
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600"
                            >
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
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.eventName}
                          </td>
                          <td className="px-6 py-4">
                            <div>{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {ticket.customerEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.purchaseDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.ticketType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-blue-100 text-blue-800">
                              Utilisé
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600"
                            >
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
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.eventName}
                          </td>
                          <td className="px-6 py-4">
                            <div>{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">
                              {ticket.customerEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.purchaseDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.ticketType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-red-100 text-red-800">
                              Annulé
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600"
                            >
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
          <div className="text-sm text-gray-500">
            Affichage de 5 événements sur 5
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Supprimer le billet"
          description={`Voulez-vous supprimer le billet "${toDelete?.id ?? ""}" ? Cette action est irréversible.`}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  );
}

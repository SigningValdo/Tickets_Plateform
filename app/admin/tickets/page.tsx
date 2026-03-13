"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, Download, MoreVertical, Loader2, Ticket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useToast } from "@/hooks/use-toast";

function TicketRow({
  ticket,
  onStatusChange,
  onDelete,
}: {
  ticket: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (ticket: any) => void;
}) {
  return (
    <tr className="border-b border-gris4/30 last:border-0 hover:bg-bg/50 transition-colors">
      <td className="px-4 py-3 text-sm text-navy font-medium whitespace-nowrap">
        {ticket.id.slice(0, 8)}...
      </td>
      <td className="px-4 py-3 text-sm text-navy whitespace-nowrap">
        {ticket.event?.title || "—"}
      </td>
      <td className="px-4 py-3 text-sm text-gris2 whitespace-nowrap">
        {ticket.order?.userId || "—"}
      </td>
      <td className="px-4 py-3 text-sm text-gris2 whitespace-nowrap">
        {ticket.createdAt
          ? new Date(ticket.createdAt).toLocaleDateString("fr-FR")
          : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-navy whitespace-nowrap">
        {ticket.ticketType?.name || "—"}
      </td>
      <td className="px-4 py-3 text-sm text-navy whitespace-nowrap">
        {ticket.ticketType?.price
          ? ticket.ticketType.price + " FCFA"
          : "—"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Select
          value={ticket.status}
          onValueChange={(val) => onStatusChange(ticket.id, val)}
        >
          <SelectTrigger className="h-8 w-[120px] rounded-lg border-gris4 bg-bg text-xs focus:border-green focus:ring-1 focus:ring-green/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VALID">Valide</SelectItem>
            <SelectItem value="USED">Utilisé</SelectItem>
            <SelectItem value="INVALID">Invalide</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg hover:bg-bg transition-colors">
              <MoreVertical className="h-4 w-4 text-gris2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-gris4">
            <DropdownMenuItem asChild>
              <Link href={`/admin/tickets/${ticket.id}`}>Détails</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/events/${ticket.eventId}/edit`}>
                Modifier l&apos;événement
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red"
              onClick={() => onDelete(ticket)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function TicketTable({
  tickets,
  onStatusChange,
  onDelete,
}: {
  tickets: any[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (ticket: any) => void;
}) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="h-10 w-10 text-gris3 mx-auto mb-3" />
        <p className="text-sm text-gris2">Aucun billet trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gris4/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                ID Billet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Date d&apos;achat
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gris2 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminTicketsPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<any>(null);

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filtreStatus, setFiltreStatus] = useState<string>("all");
  const [filtreEvent, setFiltreEvent] = useState<string>("all");
  const [filtreType, setFiltreType] = useState<string>("all");
  const { toast } = useToast();

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

  useEffect(() => {
    if (filtreEvent !== "all" && !events.some((e) => e.id === filtreEvent))
      setFiltreEvent("all");
    if (filtreType !== "all" && !ticketTypes.some((tt) => tt.id === filtreType))
      setFiltreType("all");
  }, [events, ticketTypes]);

  useEffect(() => {
    setLoading(true);
    const params = [
      `page=${page}`,
      `limit=${limit}`,
      filtreStatus !== "all" ? `status=${filtreStatus}` : null,
      filtreEvent !== "all" ? `eventId=${filtreEvent}` : null,
      filtreType !== "all" ? `ticketTypeId=${filtreType}` : null,
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
  }, [page, limit, filtreStatus, filtreEvent, filtreType]);

  async function handleStatusChange(ticketId: string, newStatus: string) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ticket, status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        )
      );
      toast({ title: "Statut mis à jour" });
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de statut : " + (e.message || e),
        variant: "destructive",
      });
    }
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      const res = await fetch(`/api/admin/tickets/${toDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setTickets((prev) => prev.filter((t) => t.id !== toDelete.id));
      toast({ title: "Billet supprimé" });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  }

  const filteredTickets = (status?: string) => {
    if (!status || status === "all") return tickets;
    return tickets.filter(
      (t) => t.status?.toLowerCase() === status.toLowerCase()
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">Chargement des billets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Gestion des billets
          </h1>
          <p className="text-gris2 text-sm mt-1">
            Consultez et gérez tous les billets vendus
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors">
          <Download className="h-4 w-4" />
          Exporter les données
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par événement
            </label>
            <Select value={filtreEvent} onValueChange={setFiltreEvent}>
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
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
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par type de billet
            </label>
            <Select value={filtreType} onValueChange={setFiltreType}>
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
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
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par statut
            </label>
            <Select value={filtreStatus} onValueChange={setFiltreStatus}>
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
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
          <div className="w-full md:w-1/4 flex justify-end">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + Ticket list */}
      <Tabs defaultValue="all">
        <TabsList className="bg-white rounded-xl p-1 border border-gris4">
          <TabsTrigger
            value="all"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Tous
          </TabsTrigger>
          <TabsTrigger
            value="valid"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Valides
          </TabsTrigger>
          <TabsTrigger
            value="used"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Utilisés
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Annulés
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="all">
            <TicketTable
              tickets={filteredTickets("all")}
              onStatusChange={handleStatusChange}
              onDelete={(t) => { setToDelete(t); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="valid">
            <TicketTable
              tickets={filteredTickets("valid")}
              onStatusChange={handleStatusChange}
              onDelete={(t) => { setToDelete(t); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="used">
            <TicketTable
              tickets={filteredTickets("used")}
              onStatusChange={handleStatusChange}
              onDelete={(t) => { setToDelete(t); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="cancelled">
            <TicketTable
              tickets={filteredTickets("cancelled")}
              onStatusChange={handleStatusChange}
              onDelete={(t) => { setToDelete(t); setDeleteOpen(true); }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4">
        <span className="text-sm text-gris2">
          Affichage de {tickets.length} billets sur {total}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Précédent
          </button>
          <button
            className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer le billet"
        description={`Voulez-vous supprimer le billet "${toDelete?.id ?? ""}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Calendar, MapPin, Tag, Ticket, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event, TicketType, EventStatus } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

export type EventWithTicketTypes = Event & {
  ticketTypes: TicketType[];
  category?: { id: string; name: string };
};

interface AdminEventListProps {
  filter: "all" | "active" | "upcoming" | "past";
  events?: EventWithTicketTypes[];
  isLoading: boolean;
  error: Error | null;
  onDeleted?: () => void;
}

export function AdminEventList({
  filter,
  events,
  isLoading,
  error,
  onDeleted,
}: AdminEventListProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<EventWithTicketTypes | null>(null);
  const { toast } = useToast();

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      await axios.delete(`/api/admin/events/${toDelete.id}`);
      toast({ title: "Événement supprimé" });
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.error ||
        (e instanceof Error ? e.message : "Une erreur est survenue");
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green mx-auto mb-3" />
          <p className="text-gris2 text-sm">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red text-sm">Erreur : {error.message}</p>
      </div>
    );
  }

  const getEventStatus = (eventDate: Date): EventStatus => {
    const now = new Date();
    const date = new Date(eventDate);
    if (date < now) return "PAST";
    return "UPCOMING";
  };

  const filteredEvents = (events || []).filter((event) => {
    if (filter === "all") return true;
    const status = getEventStatus(event.date);
    if (filter === "active") {
      return status === "UPCOMING";
    }
    return status.toLowerCase() === filter;
  });

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl">
        <Ticket className="h-12 w-12 text-gris3 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-navy mb-2">
          Aucun événement trouvé
        </h3>
        <p className="text-gris2 text-sm mb-6">
          Aucun événement ne correspond à ce filtre
        </p>
        <Link href="/admin/events/create">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors">
            Créer un événement
          </button>
        </Link>
      </div>
    );
  }

  const StatusBadge = ({ date }: { date: Date }) => {
    const status = getEventStatus(date);
    const isUpcoming = status === "UPCOMING";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
          isUpcoming
            ? "bg-green/10 text-green"
            : "bg-gris4/50 text-gris2"
        }`}
      >
        {isUpcoming ? "À venir" : "Passé"}
      </span>
    );
  };

  return (
    <div>
      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={event.imageUrl || "/placeholder.svg?height=100&width=100"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-navy truncate">
                  {event.title}
                </h3>
                <p className="text-xs text-gris2 mt-0.5">
                  {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-lg hover:bg-gray-50">
                    <MoreVertical className="h-4 w-4 text-gris2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/events/${event.id}`}>Voir</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/events/${event.id}/edit`}>Modifier</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red"
                    onClick={() => {
                      setToDelete(event);
                      setDeleteOpen(true);
                    }}
                  >
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-3 pt-3 border-t border-gris4/50 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs text-gris2">
                <MapPin className="h-3.5 w-3.5" /> {event.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gris2">
                <Tag className="h-3.5 w-3.5" /> {event.category?.name || event.categoryId}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gris2">
                <Ticket className="h-3.5 w-3.5" /> {event.ticketTypes.reduce((acc, tt) => acc + tt.quantity, 0)} tickets
              </span>
              <StatusBadge date={event.date} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gris4/50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Lieu
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gris2 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr
                key={event.id}
                className={index < filteredEvents.length - 1 ? "border-b border-gris4/30" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-navy text-sm truncate max-w-[200px]">
                      {event.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gris2">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(event.date), "d MMM yyyy", { locale: fr })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gris2 truncate max-w-[150px]">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border border-gris4 text-navy">
                    {event.category?.name || event.categoryId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge date={event.date} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-gray-50">
                        <MoreVertical className="h-4 w-4 text-gris2" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${event.id}`}>Voir</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>Modifier</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red"
                        onClick={() => {
                          setToDelete(event);
                          setDeleteOpen(true);
                        }}
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

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'événement"
        description={`Voulez-vous supprimer "${toDelete?.title ?? ""}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

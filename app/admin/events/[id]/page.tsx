import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Calendar, MapPin, Tag, Ticket, ArrowLeft, Pencil, Globe, Building2, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      category: true,
    },
  });
}

export default async function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return notFound();

  const totalTickets = event.ticketTypes.reduce((acc, t) => acc + t.quantity, 0);
  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="text-2xl font-bold text-navy">Détails de l&apos;événement</h1>
        </div>
        <Link href={`/admin/events/${event.id}/edit`}>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors">
            <Pencil className="h-4 w-4" /> Modifier
          </button>
        </Link>
      </div>

      {/* Event overview card */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-xl font-bold text-navy">{event.title}</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="inline-flex items-center gap-1.5 text-sm text-gris2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gris2">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gris2">
                  <Tag className="h-4 w-4" />
                  {event.category?.name || event.categoryId}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gris2">
                  <Ticket className="h-4 w-4" />
                  {totalTickets} tickets
                </span>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                isUpcoming
                  ? "bg-green/10 text-green"
                  : "bg-gris4/50 text-gris2"
              }`}
            >
              {isUpcoming ? "À venir" : "Passé"}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-navy mb-3">Description</h3>
        <p className="text-sm text-gris2 whitespace-pre-line leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Informations */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-navy mb-4">Informations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
            <MapPin className="h-4 w-4 text-gris3 flex-shrink-0" />
            <div>
              <p className="text-xs text-gris3">Adresse</p>
              <p className="text-sm text-navy">{event.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
            <Building2 className="h-4 w-4 text-gris3 flex-shrink-0" />
            <div>
              <p className="text-xs text-gris3">Ville</p>
              <p className="text-sm text-navy">{event.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
            <Globe className="h-4 w-4 text-gris3 flex-shrink-0" />
            <div>
              <p className="text-xs text-gris3">Pays</p>
              <p className="text-sm text-navy">{event.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
            <User className="h-4 w-4 text-gris3 flex-shrink-0" />
            <div>
              <p className="text-xs text-gris3">Organisateur</p>
              <p className="text-sm text-navy">{event.organizer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket types */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-navy mb-4">Types de billets</h3>
        {event.ticketTypes.length === 0 ? (
          <div className="text-center py-8">
            <Ticket className="h-10 w-10 text-gris3 mx-auto mb-3" />
            <p className="text-sm text-gris2">Aucun type de billet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gris4/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                    Quantité
                  </th>
                </tr>
              </thead>
              <tbody>
                {event.ticketTypes.map((tt, index) => (
                  <tr
                    key={tt.id}
                    className={index < event.ticketTypes.length - 1 ? "border-b border-gris4/30" : ""}
                  >
                    <td className="px-4 py-3 text-sm text-navy font-medium">{tt.name}</td>
                    <td className="px-4 py-3 text-sm text-gris2">{tt.price} FCFA</td>
                    <td className="px-4 py-3 text-sm text-gris2">{tt.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

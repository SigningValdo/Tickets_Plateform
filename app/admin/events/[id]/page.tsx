import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Calendar, MapPin, Tag, Ticket, ArrowLeft, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default async function AdminEventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) return notFound();

  const totalTickets = event.ticketTypes.reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/events">
            <Button variant="outline" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Détails de l'événement</h1>
        </div>
        <Link href={`/admin/events/${event.id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" /> Modifier
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative w-40 h-28 rounded-md overflow-hidden">
            <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <div className="flex flex-wrap gap-3 text-gray-600">
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}</span>
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {event.location}</span>
              <span className="flex items-center"><Tag className="h-4 w-4 mr-1" /> {event.category?.name || event.categoryId}</span>
              <span className="flex items-center"><Ticket className="h-4 w-4 mr-1" /> {totalTickets} tickets</span>
            </div>
            <div>
              {new Date(event.date) < new Date() ? (
                <Badge variant="secondary">Passé</Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">À venir</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span className="text-gray-500">Adresse: </span>{event.address}</div>
              <div><span className="text-gray-500">Ville: </span>{event.city}</div>
              <div><span className="text-gray-500">Pays: </span>{event.country}</div>
              <div><span className="text-gray-500">Organisateur: </span>{event.organizer}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Types de billets</h3>
            {event.ticketTypes.length === 0 ? (
              <div className="text-gray-500">Aucun type de billet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {event.ticketTypes.map((tt) => (
                      <tr key={tt.id}>
                        <td className="px-4 py-2">{tt.name}</td>
                        <td className="px-4 py-2">{tt.price} FCFA</td>
                        <td className="px-4 py-2">{tt.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

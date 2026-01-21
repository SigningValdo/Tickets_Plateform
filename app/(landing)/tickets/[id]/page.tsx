"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Loader2 } from "lucide-react";

interface TicketDetails {
  id: string;
  qrCode: string;
  status: "VALID" | "USED" | "INVALID" | "CANCELLED";
  event: { id: string; title: string; imageUrl?: string };
  ticketType: { id: string; name: string };
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  buyerName?: string;
  totalTickets?: number;
}

export default function UserTicketPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const pdfRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tickets/${params.id}`);
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as TicketDetails;
        if (active) setTicket(data);
      } catch (e: any) {
        if (active)
          setError(e?.message || "Erreur lors du chargement du billet");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (params.id) load();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Chargement du
        billet...
      </div>
    );

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "Billet introuvable"}</p>
        <Button variant="outline" onClick={() => router.push("/events")}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Votre billet</h1>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Button
              onClick={async () => {
                try {
                  const [{ default: html2canvas }, { jsPDF }] =
                    await Promise.all([
                      import("html2canvas"),
                      import("jspdf").then((m) => ({ jsPDF: m.jsPDF })),
                    ]);
                  if (!pdfRef.current) return;
                  const canvas = await html2canvas(pdfRef.current, {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: "#ffffff",
                  });
                  const imgData = canvas.toDataURL("image/png");
                  const pdf = new jsPDF("p", "mm", "a4");
                  const pageWidth = pdf.internal.pageSize.getWidth();
                  const pageHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = pageWidth - 20;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  const y = Math.max(10, (pageHeight - imgHeight) / 2);
                  pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
                  pdf.save(`billet_${ticket.id}.pdf`);
                } catch (e) {
                  console.error(e);
                  alert(
                    "Modules PDF manquants. Installez jspdf et html2canvas."
                  );
                }
              }}
            >
              Télécharger le billet (PDF)
            </Button>
            <div className="text-sm text-muted-foreground">ID: {ticket.id}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>
                Présentez ce code lors du contrôle
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-md">
                <QRCode value={ticket.qrCode} size={192} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <code className="px-2 py-1 bg-muted rounded">
                  {ticket.qrCode}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(ticket.qrCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Événement</span>
                <span className="font-medium">
                  {ticket.event?.title || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type de billet</span>
                <span className="font-medium">
                  {ticket.ticketType?.name || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acheteur</span>
                <span className="font-medium">
                  {ticket.buyerName || ticket.name || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre de billets</span>
                <span className="font-medium">{ticket.totalTickets ?? 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium">{ticket.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{ticket.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone</span>
                <span className="font-medium">{ticket.phone || "—"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu du billet pour le PDF */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Billet</CardTitle>
            <CardDescription>
              Aperçu du billet (utilisé pour la génération du PDF)
            </CardDescription>
          </CardHeader>
          <CardContent ref={pdfRef} className="border p-5 rounded-lg">
            <h2 className="text-xl text-center mb-5 uppercase font-semibold">
              {ticket.event.title}
            </h2>
            <div className="flex flex-col md:flex-row items-stretch gap-6">
              <div className="md:w-1/2 w-full">
                {ticket.event?.imageUrl ? (
                  <div className="relative w-full h-56 overflow-hidden rounded-md border">
                    <Image
                      src={ticket.event.imageUrl}
                      alt={ticket.event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-muted rounded-md border text-muted-foreground">
                    Image indisponible
                  </div>
                )}
              </div>
              <div className="md:w-1/2 w-full flex items-center md:items-end gap-3">
                <div className="bg-white p-4 rounded-md border">
                  <QRCode value={ticket.qrCode} size={144} />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">
                    Type de billet: {ticket.ticketType.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Acheteur: {ticket.buyerName || ticket.name || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nombre de billets: {ticket.totalTickets ?? 1}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs mt-5 text-center text-muted-foreground">
              {ticket.qrCode}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

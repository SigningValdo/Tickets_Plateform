"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface TicketDetails {
  id: string;
  qrCode: string;
  status: "VALID" | "USED" | "INVALID" | "CANCELLED";
  // Include imageUrl from event to show on the page and in the PDF
  event: { id: string; title: string; imageUrl?: string };
  ticketType: { id: string; name: string };
  order: { id: string } | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
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
        const res = await fetch(`/api/admin/tickets/${params.id}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Erreur lors du chargement du ticket");
        }
        const data = (await res.json()) as TicketDetails;
        if (active) setTicket(data);
      } catch (e: any) {
        const msg = e?.message || "Erreur lors du chargement du ticket";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    }
    if (params.id) load();
    return () => {
      active = false;
    };
  }, [params.id]);

  function formatDate(date: string) {
    try {
      return new Date(date).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  }

  function statusBadge(status: TicketDetails["status"]) {
    const map: Record<string, string> = {
      VALID: "bg-green-100 text-green-800 border-green-200",
      USED: "bg-blue-100 text-blue-800 border-blue-200",
      INVALID: "bg-red-100 text-red-800 border-red-200",
      CANCELLED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      <Badge variant="outline" className={map[status] || ""}>
        {status}
      </Badge>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Chargement du
        ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "Ticket introuvable"}</p>
        <Button variant="outline" onClick={() => router.push("/admin/tickets")}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" onClick={() => router.push("/admin/tickets")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button> */}
            <h1 className="text-2xl font-bold">Détail du billet</h1>
          </div>
          <div className="flex items-center gap-3">
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
                  const imgWidth = pageWidth - 20; // 10mm margins
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  const y = Math.max(10, (pageHeight - imgHeight) / 2);
                  pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
                  pdf.save(`billet_${ticket.id}.pdf`);
                  toast({ title: "PDF téléchargé" });
                } catch (e) {
                  console.error(e);
                  toast({
                    title: "Modules PDF manquants",
                    description:
                      "Veuillez installer jspdf et html2canvas: pnpm add jspdf html2canvas",
                    variant: "destructive",
                  });
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
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(ticket.qrCode);
                      toast({ title: "Copié" });
                    } catch {
                      toast({
                        title: "Copie impossible",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div>{statusBadge(ticket.status)}</div>
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
                <span className="text-muted-foreground">Commande</span>
                <span className="font-medium">{ticket.order?.id || "—"}</span>
              </div>
              <Separator />
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresse</span>
                <span className="font-medium">{ticket.address || "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Créé le</span>
                <span className="font-medium">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mis à jour le</span>
                <span className="font-medium">
                  {formatDate(ticket.updatedAt)}
                </span>
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
            <div className="flex items-center gap-4">
              <div className="w-full max-w-md ">
                {ticket.event?.imageUrl ? (
                  <div className="relative w-full max-w-md h-56 overflow-hidden rounded-md border">
                    <Image
                      src={ticket.event.imageUrl}
                      alt={ticket.event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-md h-56 flex items-center justify-center bg-muted rounded-md border text-muted-foreground">
                    Image indisponible
                  </div>
                )}
              </div>
              <div>
                <div className="">
                  <h2 className="text-xl font-semibold">
                    {ticket.event.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Type de billet: {ticket.ticketType.name}
                  </p>
                </div>
                {/* QR Code intégré dans le PDF */}
                <div className="bg-white p-4 rounded-md">
                  <QRCode value={ticket.qrCode} size={144} />
                </div>
              </div>
            </div>
            <div className="text-xs text-center mt-5 text-muted-foreground">
              {ticket.qrCode}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

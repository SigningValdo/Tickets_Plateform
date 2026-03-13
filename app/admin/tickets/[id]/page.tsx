"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { ArrowLeft, Copy, Loader2, Ticket, Calendar, User, Tag, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { CameroonFlag } from "@/components/cameroon-flag";
import { FecafootBadge } from "@/components/fecafoot-badge";

interface TicketDetails {
  id: string;
  qrCode: string;
  status: "VALID" | "USED" | "INVALID" | "CANCELLED";
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    VALID: "bg-green/10 text-green",
    USED: "bg-blue-100 text-blue-700",
    INVALID: "bg-red/10 text-red",
    CANCELLED: "bg-yellow/10 text-yellow",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${map[status] || "bg-gris4/50 text-gris2"}`}>
      {status}
    </span>
  );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">Chargement du billet...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red text-sm">{error || "Ticket introuvable"}</p>
        <button
          onClick={() => router.push("/admin/tickets")}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tickets"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="text-2xl font-bold text-navy">Détail du billet</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors"
          >
            Télécharger le billet (PDF)
          </button>
          <span className="text-xs text-gris2">ID: {ticket.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-navy mb-1">QR Code</h3>
          <p className="text-xs text-gris2 mb-4">Présentez ce code lors du contrôle</p>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-bg p-5 rounded-xl">
              <QRCode value={ticket.qrCode} size={192} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <code className="px-2 py-1 bg-bg rounded-lg text-xs text-navy">
                {ticket.qrCode}
              </code>
              <button
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
                className="p-1.5 rounded-lg hover:bg-bg transition-colors"
              >
                <Copy className="h-4 w-4 text-gris2" />
              </button>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        {/* Informations */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-navy mb-4">Informations</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <Ticket className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Événement</p>
                <p className="text-sm text-navy">{ticket.event?.title || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <Tag className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Type de billet</p>
                <p className="text-sm text-navy">{ticket.ticketType?.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <Calendar className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Commande</p>
                <p className="text-sm text-navy">{ticket.order?.id || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <User className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Nom</p>
                <p className="text-sm text-navy">{ticket.name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <Mail className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Email</p>
                <p className="text-sm text-navy">{ticket.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <Phone className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Téléphone</p>
                <p className="text-sm text-navy">{ticket.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bg rounded-xl">
              <MapPin className="h-4 w-4 text-gris3 flex-shrink-0" />
              <div>
                <p className="text-xs text-gris3">Adresse</p>
                <p className="text-sm text-navy">{ticket.address || "—"}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gris4/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gris2">Créé le</span>
              <span className="text-navy font-medium">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gris2">Mis à jour le</span>
              <span className="text-navy font-medium">{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu du billet pour le PDF */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-navy mb-1">Billet</h3>
        <p className="text-xs text-gris2 mb-4">Aperçu du billet (utilisé pour la génération du PDF)</p>
        <div ref={pdfRef} className="border border-gris4 p-5 rounded-xl">
          {/* En-tête avec drapeaux */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CameroonFlag width={36} height={24} />
              <FecafootBadge size={32} />
            </div>
            <h2 className="text-lg font-bold text-center uppercase flex-1 text-navy">
              FANZONE TICKETS
            </h2>
            <div className="flex items-center gap-2">
              <FecafootBadge size={32} />
              <CameroonFlag width={36} height={24} />
            </div>
          </div>
          <div className="border-b-2 border-green mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-full max-w-md">
              {ticket.event?.imageUrl ? (
                <div className="relative w-full max-w-md h-56 overflow-hidden rounded-xl border border-gris4">
                  <Image
                    src={ticket.event.imageUrl}
                    alt={ticket.event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md h-56 flex items-center justify-center bg-bg rounded-xl border border-gris4 text-gris2">
                  Image indisponible
                </div>
              )}
            </div>
            <div>
              <div>
                <h2 className="text-xl font-semibold text-navy">
                  {ticket.event.title}
                </h2>
                <p className="text-sm text-gris2">
                  Type de billet: {ticket.ticketType.name}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <QRCode value={ticket.qrCode} size={144} />
              </div>
            </div>
          </div>
          {/* Pied de billet */}
          <div className="border-t border-gris4 mt-4 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CameroonFlag width={16} height={10} />
              <span className="text-xs text-gris2">Solution camerounaise</span>
            </div>
            <div className="text-xs text-center text-gris2">{ticket.qrCode}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gris2">FECAFOOT</span>
              <CameroonFlag width={16} height={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import Image from "next/image";
import {
  Loader2,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  Ticket,
  User,
  Mail,
  Phone,
  Home,
  ArrowLeft,
  Share2,
  Shield,
  Clock,
  ChevronRight,
} from "lucide-react";
import { CameroonFlag } from "@/components/cameroon-flag";
import { FecafootBadge } from "@/components/fecafoot-badge";
import { toast } from "sonner";

interface TicketDetails {
  id: string;
  qrCode: string;
  status: "VALID" | "USED" | "INVALID" | "CANCELLED";
  event: {
    id: string;
    title: string;
    imageUrl?: string;
    date?: string;
    location?: string;
    city?: string;
  };
  ticketType: { id: string; name: string; price?: number };
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  buyerName?: string;
  totalTickets?: number;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  VALID: {
    label: "Valide",
    bg: "bg-green/10",
    text: "text-green",
    dot: "bg-green",
    border: "border-green/20",
  },
  USED: {
    label: "Utilisé",
    bg: "bg-yellow/10",
    text: "text-yellow",
    dot: "bg-yellow",
    border: "border-yellow/20",
  },
  INVALID: {
    label: "Invalide",
    bg: "bg-red/10",
    text: "text-red",
    dot: "bg-red",
    border: "border-red/20",
  },
  CANCELLED: {
    label: "Annulé",
    bg: "bg-red/10",
    text: "text-red",
    dot: "bg-red",
    border: "border-red/20",
  },
};

export default function UserTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  const handleCopyQr = async () => {
    if (!ticket) return;
    await navigator.clipboard.writeText(ticket.qrCode);
    setCopied(true);
    toast.success("Code QR copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!ticket || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
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

      // On mobile, open PDF in new tab (download attribute not supported on iOS Safari)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const pdfBlob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
      } else {
        pdf.save(`billet_${ticket.id}.pdf`);
      }
      toast.success(isMobile ? "Le billet s'ouvre dans un nouvel onglet" : "Billet téléchargé !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!ticket) return;
    if (navigator.share) {
      await navigator.share({
        title: `Billet - ${ticket.event.title}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        {/* Hero skeleton */}
        <div className="relative bg-navy overflow-hidden">
          <div className="container pt-10 pb-28">
            <div className="h-4 w-16 bg-white/10 rounded-lg mb-8 animate-pulse" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse mb-3" />
            <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="container mt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* QR skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1.5 bg-green" />
                <div className="p-6 flex flex-col items-center gap-4">
                  <div className="w-[232px] h-[232px] rounded-2xl bg-gris4/20 animate-pulse" />
                  <div className="h-10 w-full rounded-xl bg-gris4/20 animate-pulse" />
                  <div className="h-8 w-full rounded-2xl bg-gris4/10 animate-pulse" />
                  <div className="h-12 w-full rounded-2xl bg-green/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Info skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gris4/20 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-gris4/20 rounded animate-pulse" />
                      <div className="h-5 w-28 bg-gris4/20 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-10 bg-gris4/20 rounded animate-pulse ml-auto" />
                    <div className="h-5 w-24 bg-gris4/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 space-y-4">
                <div className="h-5 w-48 bg-gris4/20 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl bg-gris4/10 animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 space-y-4">
                <div className="h-5 w-36 bg-gris4/20 rounded animate-pulse" />
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-full bg-gris4/10 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="relative bg-navy overflow-hidden">
          <div className="container pt-10 pb-28" />
        </div>
        <div className="max-w-md mx-auto px-4 -mt-16">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="h-1.5 bg-red" />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-red" />
              </div>
              <h2 className="text-lg font-semibold text-black">
                Billet introuvable
              </h2>
              <p className="text-sm text-gris2 mt-2 mb-6">
                {error || "Ce billet n'existe pas ou a été supprimé."}
              </p>
              <button
                onClick={() => router.push("/events")}
                className="inline-flex items-center gap-2 h-12 px-8 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux événements
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[ticket.status] || statusConfig.VALID;

  const eventDate = ticket.event.date
    ? new Date(ticket.event.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const eventTime = ticket.event.date
    ? new Date(ticket.event.date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero with event image ── */}
      <div className="relative bg-navy overflow-hidden">
        {/* Event image background (blurred) */}
        {ticket.event.imageUrl && (
          <Image
            src={ticket.event.imageUrl}
            alt=""
            fill
            className="object-cover opacity-20 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />

        <div className="container relative pt-10 pb-28">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text} ${status.border} border`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}
                  />
                  {status.label}
                </div>
                <span className="text-[11px] text-white/40 font-mono tracking-wider">
                  #{ticket.id.slice(-8).toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {ticket.event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                {(ticket.event.location || ticket.event.city) && (
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <MapPin className="h-3.5 w-3.5" />
                    {[ticket.event.location, ticket.event.city]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
                {eventDate && (
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Calendar className="h-3.5 w-3.5" />
                    {eventDate}
                  </div>
                )}
                {eventTime && (
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Clock className="h-3.5 w-3.5" />
                    {eventTime}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white/10 text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>
              <button
                onClick={() => router.push(`/events/${ticket.event.id}`)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white/10 text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Voir l&apos;événement
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: QR Code card ── */}
          <div className="lg:col-span-2">
            <div className="bg-white h-full rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="h-1.5 bg-green" />
              <div className="p-6 flex flex-col items-center">
                {/* QR Code */}
                <div className=" bg-white rounded-2xl border-2 border-gris4/60 p-6 mb-4">
                  <QRCode value={ticket.qrCode} size={200} />
                  {/* Overlay for used/cancelled */}
                  {(ticket.status === "USED" ||
                    ticket.status === "CANCELLED") && (
                    <div className=" inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                      <span
                        className={`text-lg font-bold ${status.text} uppercase tracking-wider`}
                      >
                        {status.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Copy QR */}
                <button
                  onClick={handleCopyQr}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg border border-gris4 text-xs text-gris2 hover:border-green hover:text-green transition-all w-full justify-center"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="font-mono truncate">{ticket.qrCode}</span>
                </button>

                <div className="flex items-center gap-2 mt-5 px-3 py-2 rounded-2xl bg-green/5 w-full">
                  <Shield className="h-4 w-4 text-green flex-shrink-0" />
                  <p className="text-[11px] text-gris2 leading-relaxed">
                    Présentez ce QR code à l&apos;entrée de l&apos;événement
                    pour le scanner
                  </p>
                </div>

                {/* Download PDF */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="w-full mt-5 inline-flex items-center justify-center gap-2 h-12 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading
                    ? "Génération en cours..."
                    : "Télécharger le billet"}
                </button>

                {/* Share (mobile) */}
                <button
                  onClick={handleShare}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 h-12 bg-white text-black font-medium rounded-2xl border border-gris4 hover:border-green hover:text-green transition-colors lg:hidden"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Ticket type badge */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gris2 uppercase tracking-wide">
                      Type de billet
                    </p>
                    <p className="text-lg font-bold text-black">
                      {ticket.ticketType?.name}
                    </p>
                  </div>
                </div>
                {ticket.ticketType?.price !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-gris2">Prix</p>
                    <p className="text-lg font-bold text-green">
                      {ticket.ticketType.price === 0
                        ? "Gratuit"
                        : `${ticket.ticketType.price.toLocaleString("fr-FR")} FCFA`}
                    </p>
                  </div>
                )}
              </div>

              {ticket.totalTickets && ticket.totalTickets > 1 && (
                <div className="mt-4 rounded-xl bg-green/5 border border-green/10 px-4 py-3 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-green" />
                  <p className="text-sm text-green font-medium">
                    {ticket.totalTickets} billets dans cette commande
                  </p>
                </div>
              )}
            </div>

            {/* Buyer info */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-green" />
                </div>
                Informations de l&apos;acheteur
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: User,
                    label: "Nom complet",
                    value: ticket.buyerName || ticket.name || "—",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: ticket.email || "—",
                    colSpan: false,
                  },
                  {
                    icon: Phone,
                    label: "Téléphone",
                    value: ticket.phone || "—",
                  },
                  {
                    icon: Home,
                    label: "Quartier",
                    value: ticket.address || "—",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-bg border border-gris4/50 p-3.5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="h-3.5 w-3.5 text-gris2" />
                      <p className="text-[11px] text-gris2 uppercase tracking-wide">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm text-black font-medium truncate pl-5.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase details */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green/10 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-green" />
                </div>
                Détails de l&apos;achat
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2.5 border-b border-gris4/40">
                  <span className="text-sm text-gris2">Date d&apos;achat</span>
                  <span className="text-sm text-black font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gris4/40">
                  <span className="text-sm text-gris2">Statut</span>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text} ${status.border} border`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gris2">
                    Référence du billet
                  </span>
                  <span className="text-xs text-gris2 font-mono bg-bg px-2.5 py-1 rounded-lg border border-gris4/50">
                    {ticket.id.slice(-12).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Link to event (mobile) */}
            <button
              onClick={() => router.push(`/events/${ticket.event.id}`)}
              className="w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow lg:hidden"
            >
              <div className="flex items-center gap-3">
                {ticket.event.imageUrl && (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={ticket.event.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs text-gris2">Événement</p>
                  <p className="text-sm font-semibold text-black">
                    {ticket.event.title}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gris2" />
            </button>
          </div>
        </div>

        {/* ── PDF Preview ── */}
        <div className="mt-8 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
                <Download className="h-4 w-4 text-green" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-black">
                  Aperçu du billet
                </h2>
                <p className="text-xs text-gris2">
                  Ce visuel sera utilisé pour la génération du PDF
                </p>
              </div>
            </div>

            <div
              ref={pdfRef}
              className="border border-gris4 rounded-2xl p-6 bg-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CameroonFlag width={36} height={24} />
                  <FecafootBadge size={32} />
                </div>
                <h2 className="text-lg font-bold text-center uppercase flex-1 text-black">
                  FANZONE TICKETS
                </h2>
                <div className="flex items-center gap-2">
                  <FecafootBadge size={32} />
                  <CameroonFlag width={36} height={24} />
                </div>
              </div>

              <div className="h-0.5 bg-green mb-4" />

              <h2 className="text-xl text-center mb-5 uppercase font-semibold text-black">
                {ticket.event.title}
              </h2>

              <div className="flex flex-col md:flex-row items-stretch gap-6">
                <div className="md:w-1/2 w-full">
                  {ticket.event?.imageUrl ? (
                    <div className="relative w-full h-56 overflow-hidden rounded-xl border border-gris4">
                      <Image
                        src={ticket.event.imageUrl}
                        alt={ticket.event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center bg-bg rounded-xl border border-gris4 text-gris2">
                      Image indisponible
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 w-full flex flex-row items-end gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gris4 self-end">
                    <QRCode value={ticket.qrCode} size={140} />
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gris2">
                      <span className="font-medium text-black">Type :</span>{" "}
                      {ticket.ticketType.name}
                    </p>
                    <p className="text-gris2">
                      <span className="font-medium text-black">Acheteur :</span>{" "}
                      {ticket.buyerName || ticket.name || "—"}
                    </p>
                    <p className="text-gris2">
                      <span className="font-medium text-black">Billets :</span>{" "}
                      {ticket.totalTickets ?? 1}
                    </p>
                    {ticket.email && (
                      <p className="text-gris2">
                        <span className="font-medium text-black">Email :</span>{" "}
                        {ticket.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gris4 mt-5 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CameroonFlag width={16} height={10} />
                  <span className="text-xs text-gris2">
                    Solution camerounaise
                  </span>
                </div>
                <span className="text-xs text-gris2 font-mono">
                  {ticket.qrCode}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gris2">FECAFOOT</span>
                  <CameroonFlag width={16} height={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

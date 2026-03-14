"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  CreditCard,
  Shield,
  LogIn,
  UserPlus,
  Ticket,
  Download,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { isValidCameroonPhone } from "@/lib/sanitize";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BuyTicketModal = ({
  children,
  selectedTickets,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  selectedTickets: { ticketTypeId: string; quantity: number }[];
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Sync session data when it loads
  const sessionPhone = session?.user?.phone || "";
  const sessionAddress = session?.user?.address || "";

  const isAuthenticated = status === "authenticated" && !!session?.user;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/tickets/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }
      return result;
    },
    onSuccess: (res: any) => {
      setOpen(false);
      setIsRedirecting(true);

      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else if (res?.orderId) {
        window.location.href = `/confirmation?orderId=${res.orderId}`;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const finalPhone = phone || sessionPhone;
  const finalAddress = address || sessionAddress;
  const canSubmit = !!session?.user?.name && !!session?.user?.email && !!finalPhone && !!finalAddress;

  const handleConfirmOrder = () => {
    if (!canSubmit) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!isValidCameroonPhone(finalPhone)) {
      toast.error(
        "Numéro de téléphone invalide. Format attendu : 6XXXXXXXX ou +237 6XXXXXXXX"
      );
      return;
    }

    mutation.mutate({
      name: session!.user.name,
      email: session!.user.email,
      phone: finalPhone,
      address: finalAddress,
      tickets: selectedTickets.filter((t) => t.quantity > 0),
    });
  };

  if (isRedirecting) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="h-12 w-12 animate-spin text-green" />
            <div className="text-center">
              <h3 className="font-semibold text-lg text-black">
                Redirection en cours...
              </h3>
              <p className="text-gris2 text-sm mt-1">
                Vous allez être redirigé vers la page de paiement sécurisé
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Encode ticket selections in the callback URL so they persist through login
  const ticketParams = selectedTickets
    .filter((t) => t.quantity > 0)
    .map((t) => `${t.ticketTypeId}:${t.quantity}`)
    .join(",");
  const callbackWithTickets = ticketParams
    ? `${pathname}?checkout=${ticketParams}`
    : pathname;
  const callbackUrl = encodeURIComponent(callbackWithTickets);

  const benefits = [
    {
      icon: Download,
      text: "Retrouvez et retéléchargez vos billets à tout moment",
    },
    {
      icon: ShoppingBag,
      text: "Consultez l'historique de toutes vos commandes",
    },
    {
      icon: Settings,
      text: "Gérez vos préférences et paramètres de compte",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Green accent */}
        <div className="h-1.5 bg-green" />
        <div className="p-6">
          {status === "loading" ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green" />
            </div>
          ) : !isAuthenticated ? (
            /* ── Not logged in ── */
            <>
              <div className="flex justify-center pt-2 pb-4">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-green" />
                </div>
              </div>

              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-black text-center">
                  Créez votre espace personnel
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-gris2 text-center mt-2">
                Un compte vous permet de gérer vos billets en toute sérénité
              </p>

              <div className="mt-6 space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-green" />
                    </div>
                    <p className="text-sm text-black pt-1">{benefit.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {/* Register button */}
                <Link
                  href={`/auth/register?callbackUrl=${callbackUrl}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Créer un compte gratuitement
                </Link>

                {/* Login button */}
                <Link
                  href={`/auth/login?callbackUrl=${callbackUrl}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-green font-medium rounded-2xl border border-green hover:bg-green/5 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  J&apos;ai déjà un compte
                </Link>
              </div>
            </>
          ) : (
            /* ── Logged in ── */
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-black">
                  Confirmer votre commande
                </DialogTitle>
              </DialogHeader>

              <div className="mt-5 space-y-5">
                {/* User info summary */}
                <div className="rounded-xl bg-bg border border-gris4 p-4 space-y-3">
                  <p className="text-xs font-medium text-gris2 uppercase tracking-wide">
                    Vos informations
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {session.user.name && (
                      <>
                        <div>
                          <p className="text-[11px] text-gris2 mb-0.5">Nom</p>
                          <p className="text-sm text-black font-medium">
                            {session.user.name.split(" ").slice(1).join(" ") || session.user.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gris2 mb-0.5">
                            Prénom
                          </p>
                          <p className="text-sm text-black font-medium">
                            {session.user.name.split(" ")[0]}
                          </p>
                        </div>
                      </>
                    )}
                    {session.user.email && (
                      <div className="col-span-2">
                        <p className="text-[11px] text-gris2 mb-0.5">Email</p>
                        <p className="text-sm text-black font-medium">
                          {session.user.email}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-[11px] text-gris2 mb-0.5">
                        Téléphone <span className="text-red">*</span>
                      </p>
                      {sessionPhone ? (
                        <p className="text-sm text-black font-medium">
                          {sessionPhone}
                        </p>
                      ) : (
                        <>
                          <input
                            type="tel"
                            placeholder="Ex: +237 6XX XXX XXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-sm border border-gris4 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-green"
                          />
                          {phone && !isValidCameroonPhone(phone) && (
                            <p className="text-red text-xs mt-0.5">
                              Format invalide. Ex: 6XXXXXXXX ou +237 6XXXXXXXX
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-gris2 mb-0.5">
                        Quartier <span className="text-red">*</span>
                      </p>
                      {sessionAddress ? (
                        <p className="text-sm text-black font-medium">
                          {sessionAddress}
                        </p>
                      ) : (
                        <input
                          type="text"
                          placeholder="Ex: Bastos, Yaoundé"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full text-sm border border-gris4 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-green"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Secure payment info */}
                <div className="rounded-xl bg-green/5 border border-green/10 p-3.5 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-black">
                      Paiement sécurisé
                    </p>
                    <p className="text-gris2 text-xs mt-0.5">
                      Vous serez redirigé vers Notchpay pour effectuer votre
                      paiement en toute sécurité.
                    </p>
                  </div>
                </div>

                {/* Confirm button */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={mutation.isPending || !canSubmit}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Procéder au paiement
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

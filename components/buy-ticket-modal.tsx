"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const BuyTicketModal = ({
  children,
  selectedTickets,
}: {
  children: React.ReactNode;
  selectedTickets: { ticketTypeId: string; quantity: number }[];
}) => {
  const [open, setOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
      // Fermer la modal et afficher le loader de redirection
      setOpen(false);
      setIsRedirecting(true);

      // Redirection vers Notchpay ou page de confirmation
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else if (res?.orderId) {
        // Mode simulation
        window.location.href = `/confirmation?orderId=${res.orderId}`;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const schema = z.object({
    name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(9, "Numéro de téléphone invalide"),
    address: z.string().min(3, "L'adresse est requise"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutation.mutate({
      ...data,
      tickets: selectedTickets,
    });
  };

  // Afficher le loader de redirection en plein écran
  if (isRedirecting) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
            <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Redirection en cours...</h3>
              <p className="text-gray-600 text-sm mt-1">
                Vous allez être redirigé vers la page de paiement sécurisé
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Finaliser votre commande</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Jean Dupont"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre adresse"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info paiement sécurisé */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">Paiement sécurisé</p>
                <p>Vous serez redirigé vers Notchpay pour effectuer votre paiement en toute sécurité.</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Procéder au paiement
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2, CheckCircle } from "lucide-react";
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
  const [processingOpen, setProcessingOpen] = useState(false);
  const [processingStage, setProcessingStage] = useState<
    "processing" | "success"
  >("processing");
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
        throw new Error("Une erreur est survenue");
      }
      return result;
    },
    onSuccess: (res: any) => {
      const simulate = process.env.NEXT_PUBLIC_SIMULATE_PAYMENT === "true";

      const go = () => {
        if (res?.redirectUrl && !simulate) {
          window.location.href = res.redirectUrl as string;
          return;
        }
        if (res?.orderId) {
          window.location.href = `/confirmation?orderId=${res.orderId}`;
          return;
        }
        toast.success("Commande effectuée avec succès");
        form.reset();
        setOpen(false);
        setProcessingOpen(false);
      };

      // Afficher le loader (processing) pendant 5s, puis afficher le succès ~1.2s avant redirection
      setTimeout(() => {
        setProcessingStage("success");
        setTimeout(go, 1200);
      }, 5000);
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
      setProcessingOpen(false);
    },
  });
  const schema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    paymentMethod: z.enum(["orange", "mtn"]).default("orange"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "orange",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setProcessingStage("processing");
    setProcessingOpen(true);
    mutation.mutate({
      ...data,
      tickets: selectedTickets,
      paymentMethod: data.paymentMethod,
    });
  };

  const renderForm = () => {
    if (mutation.isPending) {
      return (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="animate-spin text-purple-600 h-12 w-12" />
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Mballa Stephane" {...field} />
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
                  <Input placeholder="mballa@exemple.com" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+237 65 55 55 55" {...field} />
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
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Place du Marché Efoulan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moyen de paiement</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orange">Orange Money</SelectItem>
                      <SelectItem value="mtn">MTN MoMo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Payer
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Ticket</DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>

      {/* Modal de traitement du paiement (simulation ou redirection réelle) */}
      <Dialog open={processingOpen} onOpenChange={setProcessingOpen}>
        <DialogContent className="p-0 overflow-hidden">
          {/* Fond avec image selon moyen de paiement */}
          <PaymentBackdrop method={form.watch("paymentMethod")} />
          <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center gap-3 bg-black/40 text-white">
            {processingStage === "processing" ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm">Traitement du paiement…</p>
              </>
            ) : (
              <>
                <div className="text-green-400">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <p className="text-sm">Paiement effectué avec succès</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Composant d'arrière-plan du paiement selon le moyen choisi
function PaymentBackdrop({ method }: { method?: "orange" | "mtn" }) {
  const isOrange = method !== "mtn"; // orange par défaut
  const bg = isOrange
    ? "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800"
    : "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700";
  const label = isOrange ? "Orange Money" : "MTN MoMo";
  return (
    <div className={`relative h-56 sm:h-64 ${bg}`}>
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,_white,_transparent_40%),_radial-gradient(circle_at_80%_30%,_white,_transparent_35%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/70 text-xl font-semibold drop-shadow">
          {label}
        </span>
      </div>
    </div>
  );
}

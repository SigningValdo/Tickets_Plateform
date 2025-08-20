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
import { Loader2 } from "lucide-react";
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
    onSuccess: () => {
      toast.success("Commande effectuée avec succès");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });
  const schema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
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
          <Button type="submit" disabled={mutation.isPending}>
            Payer
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Ticket</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

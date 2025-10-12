"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TicketType } from "@prisma/client";
import { BuyTicketModal } from "./buy-ticket-modal";

interface TicketSelectionProps {
  tickets: TicketType[];
  eventId: string;
}

export default function TicketSelection({
  tickets,
  eventId,
}: TicketSelectionProps) {
  const router = useRouter();
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  const incrementTicket = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const currentCount = selectedTickets[ticketId] || 0;
    if (currentCount < ticket.quantity) {
      setSelectedTickets({
        ...selectedTickets,
        [ticketId]: currentCount + 1,
      });
    }
  };

  const decrementTicket = (ticketId: string) => {
    const currentCount = selectedTickets[ticketId] || 0;
    if (currentCount > 0) {
      setSelectedTickets({
        ...selectedTickets,
        [ticketId]: currentCount - 1,
      });
    }
  };

  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalPrice = tickets.reduce((sum, ticket) => {
    const count = selectedTickets[ticket.id] || 0;
    return sum + ticket.price * count;
  }, 0);

  const handleCheckout = () => {
    if (totalTickets === 0) return;

    // Dans une implémentation réelle, nous stockerions les billets sélectionnés dans un état global ou un cookie
    // Puis nous redirigerions vers la page de paiement
    router.push(
      `/checkout?eventId=${eventId}&tickets=${encodeURIComponent(
        JSON.stringify(selectedTickets)
      )}`
    );
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{ticket.name}</h3>
                <p className="text-fanzone-orange font-bold">
                  {ticket.price.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-gray-500">
                  {ticket.quantity} disponibles
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => decrementTicket(ticket.id)}
                  disabled={(selectedTickets[ticket.id] || 0) === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center">
                  {selectedTickets[ticket.id] || 0}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => incrementTicket(ticket.id)}
                  disabled={
                    (selectedTickets[ticket.id] || 0) >= ticket.quantity
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {totalTickets > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-2">
            <span>Total billets:</span>
            <span>{totalTickets}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{totalPrice.toLocaleString()} FCFA</span>
          </div>
        </div>
      )}

      <BuyTicketModal
        selectedTickets={Object.keys(selectedTickets).map((key) => ({
          ticketTypeId: key,
          quantity: selectedTickets[key],
        }))}
      >
        <Button
          className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90 mt-4"
          disabled={totalTickets === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {totalTickets > 0
            ? "Procéder au paiement"
            : "Sélectionnez des billets"}
        </Button>
      </BuyTicketModal>
    </div>
  );
}

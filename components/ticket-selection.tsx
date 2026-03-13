"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart, Ticket } from "lucide-react";
import { TicketType } from "@prisma/client";
import { BuyTicketModal } from "./buy-ticket-modal";

interface TicketSelectionProps {
  tickets: TicketType[];
  eventId: string;
}

export default function TicketSelection({ tickets }: TicketSelectionProps) {
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
    0,
  );

  const totalPrice = tickets.reduce((sum, ticket) => {
    const count = selectedTickets[ticket.id] || 0;
    return sum + ticket.price * count;
  }, 0);

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const count = selectedTickets[ticket.id] || 0;
        const isSelected = count > 0;

        return (
          <div
            key={ticket.id}
            className={`rounded-xl border p-4 transition-colors ${
              isSelected ? "border-green bg-green/5" : "border-gris4 bg-bg"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-3">
                {/* <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-green/10" : "bg-gris4/30"
                  }`}
                >
                  <Ticket
                    className={`h-4 w-4 ${
                      isSelected ? "text-green" : "text-gris2"
                    }`}
                  />
                </div> */}
                <div>
                  <h3 className="text-sm font-semibold text-black">
                    {ticket.name}
                  </h3>
                  <p className="text-green font-bold text-sm">
                    {ticket.price === 0
                      ? "Gratuit"
                      : `${ticket.price.toLocaleString("fr-FR")} FCFA`}
                  </p>
                  <p className="text-xs text-gris2">
                    {ticket.quantity} disponible{ticket.quantity > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementTicket(ticket.id)}
                  disabled={count === 0}
                  className="w-8 h-8 rounded-xl border border-gris4 flex items-center justify-center text-gris2 hover:border-green hover:text-green disabled:opacity-30 disabled:hover:border-gris4 disabled:hover:text-gris2 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-black">
                  {count}
                </span>
                <button
                  onClick={() => incrementTicket(ticket.id)}
                  disabled={count >= ticket.quantity}
                  className="w-8 h-8 rounded-xl border border-gris4 flex items-center justify-center text-gris2 hover:border-green hover:text-green disabled:opacity-30 disabled:hover:border-gris4 disabled:hover:text-gris2 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {totalTickets > 0 && (
        <div className="rounded-2xl bg-bg p-4 space-y-2">
          <div className="flex justify-between text-sm text-gris2">
            <span>
              {totalTickets} billet{totalTickets > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-black">Total</span>
            <span className="text-lg font-bold text-green">
              {totalPrice.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      )}

      <BuyTicketModal
        selectedTickets={Object.keys(selectedTickets).map((key) => ({
          ticketTypeId: key,
          quantity: selectedTickets[key],
        }))}
      >
        <button
          disabled={totalTickets === 0}
          className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 bg-green text-white font-medium rounded-2xl hover:bg-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalTickets > 0
            ? "Procéder au paiement"
            : "Sélectionnez des billets"}
        </button>
      </BuyTicketModal>
    </div>
  );
}

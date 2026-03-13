import { Event, EventCategory, TicketType } from "@prisma/client";

export type EventAndCategory = Event & {
  category: EventCategory;
  ticketTypes: TicketType[];
};

export type ApiEvent = {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  city?: string;
  status?: "UPCOMING" | "ACTIVE" | "PAST";
  category?: { name: string } | null;
  ticketTypes?: { price: number }[];
};

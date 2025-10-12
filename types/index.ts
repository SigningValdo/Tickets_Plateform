import { Event, EventCategory, TicketType } from "@prisma/client";

export type EventAndCategory = Event & {
  category: EventCategory;
  ticketTypes: TicketType[];
};

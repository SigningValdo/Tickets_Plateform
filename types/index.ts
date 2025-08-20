import { Event, EventCategory, TicketType } from "@/lib/generated/prisma"

export type EventAndCategory = Event & {
  category: EventCategory,
  ticketTypes: TicketType[]
}
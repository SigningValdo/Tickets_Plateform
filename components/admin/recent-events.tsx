'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  capacity: number;
  status: 'upcoming' | 'active' | 'past';
}

// TODO: Remplacer par un appel API réel
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concert de rock',
    date: '2023-12-15T20:00:00',
    location: 'Salle des fêtes',
    attendees: 120,
    capacity: 200,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Conférence Tech',
    date: '2023-11-28T09:30:00',
    location: 'Espace conférences',
    attendees: 85,
    capacity: 100,
    status: 'active',
  },
  {
    id: '3',
    title: 'Exposition d\'art',
    date: '2023-11-20T10:00:00',
    location: 'Galerie municipale',
    attendees: 150,
    capacity: 150,
    status: 'past',
  },
];

const statusVariant = {
  upcoming: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  past: 'bg-gray-100 text-gray-800',
};

const statusLabel = {
  upcoming: 'À venir',
  active: 'En cours',
  past: 'Terminé',
};

export function RecentEvents() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Événements récents</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/events">
            Voir tout <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge 
                    className={`text-xs ${statusVariant[event.status]}`}
                    variant="outline"
                  >
                    {statusLabel[event.status]}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  <span className="mr-4">
                    {new Date(event.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  <span className="mr-4">{event.location}</span>
                  <Users className="mr-1 h-3.5 w-3.5" />
                  <span>
                    {event.attendees} / {event.capacity} participants
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/events/${event.id}`}>Détails</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

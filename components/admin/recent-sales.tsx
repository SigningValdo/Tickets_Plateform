'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CreditCard, User } from 'lucide-react';
import Link from 'next/link';

interface Sale {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  event: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

// TODO: Remplacer par un appel API réel
const mockSales: Sale[] = [
  {
    id: '1',
    customer: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      avatar: '/avatars/01.png',
    },
    event: 'Concert de rock',
    amount: 45.50,
    date: '2023-11-15T14:32:00',
    status: 'completed',
  },
  {
    id: '2',
    customer: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
    },
    event: 'Conférence Tech',
    amount: 29.99,
    date: '2023-11-14T09:15:00',
    status: 'completed',
  },
  {
    id: '3',
    customer: {
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      avatar: '/avatars/03.png',
    },
    event: 'Exposition d\'art',
    amount: 15.00,
    date: '2023-11-13T16:45:00',
    status: 'pending',
  },
  {
    id: '4',
    customer: {
      name: 'Sophie Laurent',
      email: 'sophie.laurent@example.com',
    },
    event: 'Concert de rock',
    amount: 45.50,
    date: '2023-11-13T11:20:00',
    status: 'completed',
  },
  {
    id: '5',
    customer: {
      name: 'Thomas Moreau',
      email: 'thomas.moreau@example.com',
      avatar: '/avatars/05.png',
    },
    event: 'Conférence Tech',
    amount: 29.99,
    date: '2023-11-12T10:05:00',
    status: 'failed',
  },
];

const statusVariant = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const statusLabel = {
  completed: 'Payé',
  pending: 'En attente',
  failed: 'Échoué',
};

export function RecentSales() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Ventes récentes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            Voir tout <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  {sale.customer.avatar ? (
                    <img src={sale.customer.avatar} alt={sale.customer.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {sale.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sale.customer.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {sale.amount.toFixed(2)} €
                </p>
                <div className="flex items-center justify-end">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusVariant[sale.status]}`}>
                    {statusLabel[sale.status]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

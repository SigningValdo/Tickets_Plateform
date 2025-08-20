'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Ticket, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}

function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-medium ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // TODO: Remplacer par des appels API réels
  const stats = [
    {
      title: 'Utilisateurs',
      value: '1,234',
      icon: <Users className="h-4 w-4" />,
      trend: {
        value: 12.5,
        label: 'ce mois-ci',
        positive: true,
      },
    },
    {
      title: 'Événements',
      value: '56',
      icon: <Calendar className="h-4 w-4" />,
      trend: {
        value: 5.2,
        label: 'ce mois-ci',
        positive: true,
      },
    },
    {
      title: 'Billets vendus',
      value: '3,456',
      icon: <Ticket className="h-4 w-4" />,
      trend: {
        value: 8.1,
        label: 'ce mois-ci',
        positive: true,
      },
    },
    {
      title: 'Revenus',
      value: '12,345 €',
      icon: <DollarSign className="h-4 w-4" />,
      trend: {
        value: 15.3,
        label: 'ce mois-ci',
        positive: true,
      },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Ticket, Users, BarChart3, Settings, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ className = '', onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname.startsWith(path);
  
  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  const navItems = [
    { 
      href: '/admin/dashboard', 
      icon: Home, 
      label: 'Tableau de bord' 
    },
    { 
      href: '/admin/events', 
      icon: Calendar, 
      label: 'Événements' 
    },
    { 
      href: '/admin/tickets', 
      icon: Ticket, 
      label: 'Billets' 
    },
    { 
      href: '/admin/users', 
      icon: Users, 
      label: 'Utilisateurs' 
    },
    { 
      href: '/admin/reports', 
      icon: BarChart3, 
      label: 'Rapports' 
    },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Paramètres' 
    },
  ];

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 py-4">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold text-purple-600">E-Tickets Admin</h1>
        </div>
        
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isItemActive = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClick}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isItemActive
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={() => {
            // TODO: Implémenter la déconnexion
            console.log('Déconnexion');
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

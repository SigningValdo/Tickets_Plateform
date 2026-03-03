"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  Home,
  Ticket,
  User,
  Settings,
  Search,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fanzone-orange mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/auth/login?callbackUrl=/account");
  }

  const links = [
    { href: "/account", label: "Tableau de bord", icon: Home },
    { href: "/account/tickets", label: "Mes billets", icon: Ticket },
    { href: "/account/events", label: "Événements", icon: Calendar },
    { href: "/account/profile", label: "Mon profil", icon: User },
    { href: "/account/settings", label: "Paramètres", icon: Settings },
  ];

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="text-xl font-bold text-fanzone-orange">
              E-Tickets
            </Link>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100",
                  {
                    "text-fanzone-orange bg-purple-50":
                      link.href === pathname ||
                      (link.href !== "/account" &&
                        pathname.startsWith(link.href)),
                  }
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200"
              onClick={() => {
                signOut().then(() => {
                  router.push("/");
                });
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/" className="text-xl font-bold text-fanzone-orange">
              E-Tickets
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100",
                  {
                    "text-fanzone-orange bg-purple-50":
                      link.href === pathname ||
                      (link.href !== "/account" &&
                        pathname.startsWith(link.href)),
                  }
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200"
              onClick={() => {
                signOut().then(() => {
                  router.push("/");
                });
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-500" />
            </button>

            <div className="flex items-center justify-between w-full">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9 w-64 h-9"
                />
              </div>
              <div className="flex items-center space-x-2 ml-auto">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-fanzone-orange font-medium">
                  {userInitials}
                </div>
                <span className="text-sm font-medium hidden sm:inline-block">
                  {session?.user?.name || "Utilisateur"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

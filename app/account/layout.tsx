"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Ticket,
  Settings,
  Search,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/auth/login?callbackUrl=/account");
  }

  const mainLinks = [
    { href: "/account/tickets", label: "Mes billets", icon: Ticket },
    { href: "/account/cart", label: "Mon panier", icon: ShoppingCart },
  ];

  const bottomLinks = [
    { href: "/account/profile", label: "Profil", icon: CircleUserRound },
    { href: "/account/settings", label: "Paramètres", icon: Settings },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 m-5 rounded-2xl px-6 py-3">
        <Image
          src="/logo/logo-green.svg"
          alt="FanZone Tickets"
          width={100}
          height={70}
        />
      </div>
      <hr className="border border-gris4 mx-6 mb-6" />
      {/* Main nav */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-green/10 text-green"
                : "text-gris2 hover:bg-gray-50 hover:text-navy",
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-1">
        {bottomLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-green/10 text-green"
                : "text-gris2 hover:bg-gray-50 hover:text-navy",
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}

        <button
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red hover:bg-red/5 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gris2" />
            </button>
          </div>
          <div className="flex flex-col h-[calc(100%-60px)]">
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white rounded-2xl m-5">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-5 z-30 bg-white rounded-2xl mr-5">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-navy" />
            </button>

            {/* Search */}
            <div className="relative hidden sm:block flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris3 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-10 pl-11 pr-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
              />
            </div>

            {/* User */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2 cursor-pointer">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-semibold">
                    {userInitials}
                  </div>
                )}
                <span className="text-sm font-medium text-navy hidden sm:inline-block">
                  {session?.user?.name || "Utilisateur"}
                </span>
                <ChevronDown className="h-4 w-4 text-gris2 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

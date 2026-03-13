"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Événements" },
  { href: "/about", label: "A propos" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/account";

  return (
    <header className="bg-navy fixed py-4 top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/logo-orange.svg"
            alt="FANZONE TICKETS"
            width={78}
            height={58}
          />
        </Link>
        <div className="flex items-center gap-8">
          {/* Desktop navigation - centered */}
          <nav className="hidden md:flex items-center gap-11">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-white py-3",
                  "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[5px] after:rounded-full after:bg-yellow after:transition-all after:duration-300",
                  link.href === pathname
                    ? "text-white after:w-[89px]"
                    : "after:w-0 hover:after:w-[89px]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {session ? (
              <Link
                href={dashboardHref}
                className="py-3.5 px-7 rounded-full bg-white text-black"
              >
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-3.5 px-7 rounded-l-full bg-white text-black"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="py-3.5 px-7 rounded-r-full bg-red text-white"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-white/80 hover:text-white transition-colors py-3 px-3 rounded-lg hover:bg-white/5 text-sm font-medium",
                  {
                    "text-white bg-white/5": link.href === pathname,
                  },
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              {session ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-full bg-white text-sm font-medium text-black hover:bg-white/90 transition-colors flex items-center justify-center"
                >
                  Mon espace
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-10 rounded-full border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-10 rounded-full bg-coral text-sm font-medium text-white hover:bg-coral/90 transition-colors flex items-center justify-center"
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

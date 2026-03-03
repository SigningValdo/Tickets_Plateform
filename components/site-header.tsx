"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { CameroonFlag } from "@/components/cameroon-flag";
import { FecafootBadge } from "@/components/fecafoot-badge";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/events", label: "Événements" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-black/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="FANZONE TICKETS"
            width={150}
            height={150}
          />
          {/* <div className="hidden sm:flex items-center gap-2">
            <CameroonFlag width={28} height={18} />
            <FecafootBadge size={30} />
          </div> */}
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-white hover:text-fanzone-orange transition-colors py-1",
                "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-fanzone-orange after:transition-all after:duration-300",
                link.href === pathname
                  ? "text-fanzone-orange after:w-full"
                  : "after:w-0 hover:after:w-full",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login" className="hidden sm:block">
            <Button
              variant="outline"
              className="border border-fanzone-gray text-fanzone-gray hover:bg-fanzone-gray hover:text-white"
            >
              Connexion
            </Button>
          </Link>
          <Link href="/auth/register" className="hidden sm:block">
            <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90 text-white">
              S&apos;inscrire
            </Button>
          </Link>

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
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-white hover:text-fanzone-orange transition-colors py-3 px-2 rounded-lg hover:bg-white/5",
                  {
                    "text-fanzone-orange bg-white/5": link.href === pathname,
                  },
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-fanzone-gray text-fanzone-gray hover:bg-fanzone-gray hover:text-white"
                >
                  Connexion
                </Button>
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-fanzone-orange hover:bg-fanzone-orange/90 text-white">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

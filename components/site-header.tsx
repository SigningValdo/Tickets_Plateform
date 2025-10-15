"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Accueil" },
    { href: "/events", label: "Événements" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="bg-black shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between ">
        <Link href="/" className="flex items-center space-x-4">
          {/* Logo FANZONE TICKETS - Version charte graphique */}
          <Image
            src="/logo.png"
            alt="FANZONE TICKETS"
            width={150}
            height={150}
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-white hover:text-fanzone-orange transition-colors",
                {
                  "text-fanzone-orange": link.href === pathname,
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border border-fanzone-gray text-fanzone-gray hover:bg-fanzone-gray hover:text-white"
            >
              Connexion
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90 text-white">
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

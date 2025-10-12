import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          {/* Logo FANZONE TICKETS - Version charte graphique */}
          <Image
            src="/logo.jpeg"
            alt="FANZONE TICKETS"
            width={200}
            height={100}
            // className="w-10 h-10"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/events"
            className="text-black hover:text-fanzone-orange transition-colors"
          >
            Événements
          </Link>
          <Link
            href="/about"
            className="text-black hover:text-fanzone-orange transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="text-black hover:text-fanzone-orange transition-colors"
          >
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-fanzone-gray text-fanzone-gray hover:bg-fanzone-gray hover:text-white"
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

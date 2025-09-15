import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-purple-600">E-Tickets</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="text-gray-600 hover:text-purple-600">
            Événements
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-purple-600">
            À propos
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-purple-600">
            Contact
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="outline" className="hidden sm:inline-flex">
              Connexion
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-purple-600 hover:bg-purple-700">S'inscrire</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

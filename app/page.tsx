import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedEvents from "@/components/featured-events"
import UpcomingEvents from "@/components/upcoming-events"
import { SearchBar } from "@/components/search-bar"
import { EventCategories } from "@/components/event-categories"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
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

      <main className="container mx-auto px-4 py-8">
        <section className="py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Découvrez et réservez vos événements préférés</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Achetez des billets en toute simplicité pour des concerts, festivals, conférences et plus encore.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Catégories</h2>
            <Link href="/events" className="text-purple-600 hover:underline">
              Voir tout
            </Link>
          </div>
          <EventCategories />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Événements en vedette</h2>
            <Link href="/events" className="text-purple-600 hover:underline">
              Voir tout
            </Link>
          </div>
          <FeaturedEvents />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Prochains événements</h2>
            <Link href="/events" className="text-purple-600 hover:underline">
              Voir tout
            </Link>
          </div>
          <UpcomingEvents />
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">E-Tickets</h3>
              <p className="text-gray-400">Votre plateforme de billetterie en ligne sécurisée et fiable.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-white">
                    Événements
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-gray-400 hover:text-white">
                    Politique de remboursement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Nous contacter</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: contact@e-tickets.com</li>
                <li className="text-gray-400">Téléphone: +123 456 789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} E-Tickets. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

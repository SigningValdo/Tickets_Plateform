import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
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
            <Link href="/about" className="text-purple-600 font-medium">
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

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6 text-center">À propos de E-Tickets</h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Votre plateforme de billetterie en ligne sécurisée et fiable pour tous vos événements en Afrique.
          </p>

          <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="L'équipe E-Tickets"
              fill
              className="object-cover"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Notre mission</h2>
            <p className="mb-6">
              Chez E-Tickets, notre mission est de simplifier l'accès aux événements culturels, sportifs et
              professionnels à travers l'Afrique. Nous croyons que la technologie peut rapprocher les gens et faciliter
              l'accès à des expériences enrichissantes.
            </p>

            <h2 className="text-2xl font-bold mb-4">Notre histoire</h2>
            <p className="mb-6">
              Fondée en 2020, E-Tickets est née de la passion de trois entrepreneurs africains pour la culture et la
              technologie. Face aux défis liés à l'achat de billets pour des événements locaux, ils ont décidé de créer
              une solution adaptée aux réalités du continent africain, en tenant compte des spécificités locales et des
              moyens de paiement disponibles.
            </p>

            <h2 className="text-2xl font-bold mb-4">Nos valeurs</h2>
            <ul className="space-y-2 mb-6">
              <li>
                <strong>Innovation :</strong> Nous repoussons constamment les limites pour offrir des solutions
                technologiques adaptées.
              </li>
              <li>
                <strong>Accessibilité :</strong> Nous rendons la culture et les événements accessibles au plus grand
                nombre.
              </li>
              <li>
                <strong>Fiabilité :</strong> Nous garantissons une expérience sécurisée et transparente pour tous nos
                utilisateurs.
              </li>
              <li>
                <strong>Proximité :</strong> Nous soutenons les organisateurs locaux et contribuons au développement
                culturel.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Notre équipe</h2>
            <p className="mb-6">
              Notre équipe diversifiée est composée de passionnés de technologie, de culture et d'événementiel. Basés
              principalement à Abidjan, avec des bureaux à Dakar et Casablanca, nous travaillons chaque jour pour
              améliorer notre plateforme et offrir la meilleure expérience possible à nos utilisateurs.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Pourquoi choisir E-Tickets ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Sécurité garantie</h3>
                <p className="text-gray-600">
                  Vos transactions sont 100% sécurisées. Nos billets électroniques sont protégés contre la fraude grâce
                  à notre technologie de QR code unique.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Paiements flexibles</h3>
                <p className="text-gray-600">
                  Nous acceptons différents moyens de paiement adaptés au contexte africain : mobile money, cartes
                  bancaires et paiements en espèces.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.25" />
                    <path d="M21 3v9h-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Rapidité d'accès</h3>
                <p className="text-gray-600">
                  Achetez vos billets en quelques clics et recevez-les instantanément par email. Plus besoin de faire la
                  queue !
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nos partenaires</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-24 bg-white rounded-md shadow-sm flex items-center justify-center">
                <div className="text-gray-400 font-medium">Partenaire {i}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-purple-50 rounded-xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre événement ?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Rejoignez les milliers d'organisateurs qui font confiance à E-Tickets pour la gestion de leur billetterie.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto">Devenir organisateur</Button>
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

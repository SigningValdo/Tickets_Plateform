import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : 1 mai 2024</p>

          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Bienvenue sur E-Tickets, une plateforme de billetterie en ligne. Les présentes Conditions Générales
              d'Utilisation régissent votre utilisation de notre site web, accessible à l'adresse www.e-tickets.com,
              ainsi que tous les services associés.
            </p>
            <p>
              En accédant à notre plateforme ou en utilisant nos services, vous acceptez d'être lié par ces conditions.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
            </p>

            <h2>2. Définitions</h2>
            <ul>
              <li>
                <strong>"Plateforme"</strong> désigne le site web E-Tickets et tous les services associés.
              </li>
              <li>
                <strong>"Utilisateur"</strong> désigne toute personne qui accède à la Plateforme ou utilise les
                services.
              </li>
              <li>
                <strong>"Organisateur"</strong> désigne toute personne ou entité qui crée et gère des événements sur la
                Plateforme.
              </li>
              <li>
                <strong>"Acheteur"</strong> désigne tout Utilisateur qui achète des billets sur la Plateforme.
              </li>
              <li>
                <strong>"Billet"</strong> désigne le droit d'accès à un événement, matérialisé par un document
                électronique.
              </li>
            </ul>

            <h2>3. Inscription et compte utilisateur</h2>
            <p>
              Pour utiliser certaines fonctionnalités de notre Plateforme, vous devrez créer un compte. Vous êtes
              responsable de maintenir la confidentialité de vos informations de connexion et de toutes les activités
              qui se produisent sous votre compte.
            </p>
            <p>
              Vous vous engagez à fournir des informations exactes, actuelles et complètes lors de votre inscription et
              à les mettre à jour régulièrement pour en préserver l'exactitude.
            </p>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre compte si nous avons des raisons de croire
              que les informations fournies sont inexactes, obsolètes ou incomplètes.
            </p>

            <h2>4. Achat de billets</h2>
            <p>L'achat de billets sur notre Plateforme est soumis aux conditions suivantes :</p>
            <ul>
              <li>Les prix des billets sont indiqués en FCFA et incluent toutes les taxes applicables.</li>
              <li>
                Une fois l'achat confirmé, vous recevrez vos billets par email et ils seront disponibles dans votre
                espace personnel.
              </li>
              <li>
                Les billets achetés sont personnels et ne peuvent être revendus sans l'autorisation expresse de
                l'Organisateur.
              </li>
              <li>
                En cas d'annulation de l'événement, les conditions de remboursement sont définies par l'Organisateur.
              </li>
            </ul>

            <h2>5. Responsabilités des Organisateurs</h2>
            <p>
              Les Organisateurs sont entièrement responsables des informations fournies concernant leurs événements, y
              compris la date, l'heure, le lieu et la description de l'événement.
            </p>
            <p>
              E-Tickets n'est pas responsable de l'organisation des événements et ne peut être tenu responsable en cas
              d'annulation, de report ou de modification d'un événement.
            </p>

            <h2>6. Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur la Plateforme, y compris les textes, graphiques, logos, images, ainsi que
              leur compilation, sont la propriété de E-Tickets ou de ses partenaires et sont protégés par les lois sur
              la propriété intellectuelle.
            </p>
            <p>
              Vous n'êtes pas autorisé à reproduire, distribuer, modifier ou créer des œuvres dérivées de tout contenu
              de la Plateforme sans notre consentement écrit préalable.
            </p>

            <h2>7. Protection des données personnelles</h2>
            <p>
              La collecte et le traitement des données personnelles sont régis par notre Politique de Confidentialité,
              que vous pouvez consulter à tout moment sur notre Plateforme.
            </p>

            <h2>8. Limitation de responsabilité</h2>
            <p>
              Dans toute la mesure permise par la loi applicable, E-Tickets ne pourra être tenu responsable des dommages
              indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité
              d'utiliser la Plateforme.
            </p>

            <h2>9. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces Conditions Générales d'Utilisation à tout moment. Les
              modifications prendront effet dès leur publication sur la Plateforme. Nous vous encourageons à consulter
              régulièrement ces conditions.
            </p>

            <h2>10. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation sont régies par le droit en vigueur en Côte d'Ivoire.
              Tout litige relatif à l'interprétation ou à l'exécution de ces conditions sera soumis à la compétence
              exclusive des tribunaux d'Abidjan.
            </p>

            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant ces Conditions Générales d'Utilisation, veuillez nous contacter à l'adresse
              suivante : legal@e-tickets.com.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-12">
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

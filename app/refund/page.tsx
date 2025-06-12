import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RefundPage() {
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
          <h1 className="text-3xl font-bold mb-6">Politique de Remboursement</h1>
          <p className="text-gray-500 mb-8">Dernière mise à jour : 1 mai 2024</p>

          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Cette Politique de Remboursement définit les conditions dans lesquelles les remboursements peuvent être
              effectués pour les billets achetés sur la plateforme E-Tickets. Veuillez lire attentivement cette
              politique avant d'acheter des billets.
            </p>

            <h2>2. Principes généraux</h2>
            <p>
              E-Tickets agit en tant qu'intermédiaire entre les Organisateurs d'événements et les Acheteurs de billets.
              Les conditions de remboursement peuvent varier selon les événements et sont généralement définies par les
              Organisateurs.
            </p>
            <p>
              Sauf indication contraire spécifiée pour un événement particulier, les principes suivants s'appliquent.
            </p>

            <h2>3. Annulation d'un événement</h2>
            <p>En cas d'annulation complète d'un événement par l'Organisateur :</p>
            <ul>
              <li>Les Acheteurs seront informés par email dès que possible.</li>
              <li>
                Un remboursement complet du prix du billet sera effectué automatiquement dans un délai de 14 jours
                ouvrables, via le même moyen de paiement que celui utilisé pour l'achat.
              </li>
              <li>Les frais de service peuvent être non remboursables, selon la politique de l'Organisateur.</li>
            </ul>

            <h2>4. Report d'un événement</h2>
            <p>En cas de report d'un événement à une date ultérieure :</p>
            <ul>
              <li>Les billets restent généralement valables pour la nouvelle date.</li>
              <li>
                Si vous ne pouvez pas assister à l'événement à la nouvelle date, vous pouvez demander un remboursement
                dans un délai de 14 jours suivant l'annonce du report.
              </li>
              <li>
                Après ce délai, les demandes de remboursement seront soumises à l'approbation de l'Organisateur et
                pourront être refusées.
              </li>
            </ul>

            <h2>5. Changement significatif</h2>
            <p>
              En cas de changement significatif dans la programmation d'un événement (par exemple, changement d'artiste
              principal, de lieu) :
            </p>
            <ul>
              <li>L'Organisateur peut, à sa discrétion, offrir un remboursement partiel ou total.</li>
              <li>
                Les demandes de remboursement doivent être soumises dans un délai de 7 jours suivant l'annonce du
                changement.
              </li>
            </ul>

            <h2>6. Annulation par l'Acheteur</h2>
            <p>En règle générale, les billets ne sont pas remboursables en cas d'annulation par l'Acheteur, sauf :</p>
            <ul>
              <li>Si l'Organisateur a spécifiquement prévu cette possibilité dans ses conditions.</li>
              <li>Si vous avez souscrit à une assurance annulation au moment de l'achat (si disponible).</li>
            </ul>

            <h2>7. Billets non utilisés</h2>
            <p>
              Les billets non utilisés ne sont généralement pas remboursables, quelle que soit la raison (maladie,
              empêchement personnel, etc.), sauf si une assurance annulation a été souscrite.
            </p>

            <h2>8. Procédure de remboursement</h2>
            <p>Pour demander un remboursement dans les cas où cela est possible :</p>
            <ol>
              <li>Connectez-vous à votre compte E-Tickets.</li>
              <li>Accédez à la section "Mes billets".</li>
              <li>Sélectionnez le billet concerné et cliquez sur "Demander un remboursement".</li>
              <li>Suivez les instructions pour compléter votre demande.</li>
            </ol>
            <p>
              Vous pouvez également contacter notre service client à l'adresse support@e-tickets.com en précisant votre
              numéro de commande et le motif de votre demande.
            </p>

            <h2>9. Délais de remboursement</h2>
            <p>Lorsqu'un remboursement est approuvé :</p>
            <ul>
              <li>
                Pour les paiements par carte bancaire : le remboursement est généralement traité dans un délai de 5 à 14
                jours ouvrables.
              </li>
              <li>
                Pour les paiements par mobile money : le remboursement est généralement traité dans un délai de 2 à 5
                jours ouvrables.
              </li>
            </ul>
            <p>Les délais peuvent varier en fonction des institutions financières impliquées.</p>

            <h2>10. Cas particuliers</h2>
            <p>
              Dans certains cas exceptionnels (force majeure, problèmes techniques majeurs), des conditions spécifiques
              de remboursement peuvent être appliquées. Ces conditions seront communiquées aux Acheteurs concernés.
            </p>

            <h2>11. Modifications de cette politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette Politique de Remboursement à tout moment. Les modifications
              prendront effet dès leur publication sur notre plateforme.
            </p>

            <h2>12. Contact</h2>
            <p>
              Pour toute question concernant cette Politique de Remboursement, veuillez nous contacter à l'adresse
              suivante : support@e-tickets.com.
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

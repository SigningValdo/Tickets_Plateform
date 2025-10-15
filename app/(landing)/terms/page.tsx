export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-justify">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Conditions d'Utilisation</h1>
          <p className="text-gray-500 mb-8">
            Dernière mise à jour : 1 janvier 2025
          </p>

          <div className="prose max-w-none [&_span]:font-bold [&_h2]:font-bold [&_ul]:list-disc [&_ul]:list-inside space-y-5">
            <p>
              Bienvenue sur <span>FanZone Tickets</span>. En accédant à notre
              plateforme, vous acceptez de respecter les présentes conditions
              d'utilisation. Veuillez les lire attentivement.
            </p>

            <h2>1. Acceptation des Conditions</h2>
            <p>
              L'utilisation de notre plateforme implique l'acceptation des
              présentes conditions. Si vous n'acceptez pas ces conditions, nous
              vous prions de ne pas utiliser notre service.
            </p>

            <h2>2. Inscription et Compte Utilisateur</h2>
            <ul>
              <li>
                Pour acheter des billets, vous devez créer un compte sur notre
                plateforme.
              </li>
              <li>
                Vous vous engagez à fournir des informations exactes et à jour
                lors de votre inscription.
              </li>
              <li>
                Vous êtes responsable de la confidentialité de vos identifiants
                de connexion et de toutes les activités effectuées sous votre
                compte.
              </li>
            </ul>

            <h2>3. Achat de Billets</h2>
            <ul>
              <li>Tous les achats de billets sont soumis à disponibilité.</li>
              <li>
                Les prix des billets peuvent varier et seront affichés en temps
                réel sur la plateforme.
              </li>
              <li>
                Les frais de service peuvent s'appliquer et seront clairement
                indiqués au moment de l'achat.
              </li>
            </ul>

            <h2>4. Politique de Remboursement</h2>
            <ul>
              <li>
                Les billets achetés ne sont généralement pas remboursables, sauf
                en cas d'annulation de l'événement.
              </li>
              <li>
                En cas de changement de date ou de lieu, nous informerons les
                acheteurs et proposerons des options de remboursement ou
                d'échange.
              </li>
            </ul>

            <h2>5. Utilisation de la Plateforme</h2>
            <ul>
              <li>
                Vous vous engagez à utiliser notre service uniquement à des fins
                légales et conformément aux lois en vigueur.
              </li>
              <li>
                Il est interdit de revendre des billets achetés sur notre
                plateforme sans autorisation préalable.
              </li>
            </ul>

            <h2>6. Propriété Intellectuelle</h2>
            <ul>
              <li>
                Tout le contenu de la plateforme, y compris les logos, textes,
                graphiques et logiciels, est protégé par des droits d'auteur et
                d'autres lois sur la propriété intellectuelle.
              </li>
              <li>
                Vous n'êtes pas autorisé à reproduire, distribuer ou modifier
                tout contenu sans notre autorisation écrite.
              </li>
            </ul>

            <h2>7. Limitation de Responsabilité</h2>
            <ul>
              <li>
                <span>FanZone Tickets</span> ne peut être tenu responsable des
                pertes ou dommages résultant de l'utilisation de notre
                plateforme, y compris les retards ou annulations d'événements.
              </li>
              <li>
                Nous ne garantissons pas que notre service sera ininterrompu ou
                exempt d'erreurs.
              </li>
            </ul>

            <h2>8. Modifications des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions
              d'utilisation à tout moment. Les utilisateurs seront informés de
              toute mise à jour et l'utilisation continue de la plateforme
              constituera une acceptation des nouvelles conditions.
            </p>

            <h2>9. Loi Applicable</h2>
            <p>
              Les présentes conditions sont régies par la législation en vigueur
              au Cameroun. Tout litige sera soumis à la compétence exclusive des
              tribunaux de la région.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation,
              veuillez nous contacter à l'adresse suivante :
              <a
                className="text-fanzone-orange"
                href="mailto:fanszonetickets@gmail.com"
              >
                fanszonetickets@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

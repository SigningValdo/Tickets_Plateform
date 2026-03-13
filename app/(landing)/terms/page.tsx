import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="bg-bg">
      {/* Hero banner */}
      <section className="relative bg-navy text-white py-16 md:py-20 overflow-hidden">
        <Image
          src="/filigrame.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="relative container text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Conditions d&apos;Utilisation
          </h1>
        </div>
      </section>

      <div className="container py-12 md:py-16 max-w-4xl mx-auto space-y-6">
        <p className="text-sm text-gris2">
          Dernière mise à jour : 1 janvier 2025
        </p>

        {/* Intro */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <p className="text-sm text-gris2 leading-relaxed">
            Bienvenue sur <strong className="text-black">FanZone Tickets</strong>
            . En accédant à notre plateforme, vous acceptez de respecter les
            présentes conditions d&apos;utilisation. Veuillez les lire
            attentivement.
          </p>
        </div>

        {/* Sections 1 & 2 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                1. Acceptation des Conditions
              </h2>
              <p className="text-sm text-gris2 leading-relaxed">
                L&apos;utilisation de notre plateforme implique l&apos;acceptation
                des présentes conditions. Si vous n&apos;acceptez pas ces
                conditions, nous vous prions de ne pas utiliser notre service.
              </p>
            </div>
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                2. Inscription et Compte Utilisateur
              </h2>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
                <li>
                  Pour acheter des billets, vous devez créer un compte sur notre
                  plateforme.
                </li>
                <li>
                  Vous vous engagez à fournir des informations exactes et à jour
                  lors de votre inscription.
                </li>
                <li>
                  Vous êtes responsable de la confidentialité de vos
                  identifiants de connexion et de toutes les activités effectuées
                  sous votre compte.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sections 3 & 4 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                3. Achat de Billets
              </h2>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
                <li>
                  Tous les achats de billets sont soumis à disponibilité.
                </li>
                <li>
                  Les prix des billets peuvent varier et seront affichés en temps
                  réel sur la plateforme.
                </li>
                <li>
                  Les frais de service peuvent s&apos;appliquer et seront
                  clairement indiqués au moment de l&apos;achat.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                4. Politique de Remboursement
              </h2>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
                <li>
                  Les billets achetés ne sont généralement pas remboursables,
                  sauf en cas d&apos;annulation de l&apos;événement.
                </li>
                <li>
                  En cas de changement de date ou de lieu, nous informerons les
                  acheteurs et proposerons des options de remboursement ou
                  d&apos;échange.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sections 5 & 6 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              5. Utilisation de la Plateforme
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Vous vous engagez à utiliser notre service uniquement à des fins
                légales et conformément aux lois en vigueur.
              </li>
              <li>
                Il est interdit de revendre des billets achetés sur notre
                plateforme sans autorisation préalable.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              6. Propriété Intellectuelle
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Tout le contenu de la plateforme, y compris les logos, textes,
                graphiques et logiciels, est protégé par des droits d&apos;auteur
                et d&apos;autres lois sur la propriété intellectuelle.
              </li>
              <li>
                Vous n&apos;êtes pas autorisé à reproduire, distribuer ou
                modifier tout contenu sans notre autorisation écrite.
              </li>
            </ul>
          </div>
        </div>

        {/* Sections 7, 8, 9, 10 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              7. Limitation de Responsabilité
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-black">FanZone Tickets</strong> ne peut
                être tenu responsable des pertes ou dommages résultant de
                l&apos;utilisation de notre plateforme, y compris les retards ou
                annulations d&apos;événements.
              </li>
              <li>
                Nous ne garantissons pas que notre service sera ininterrompu ou
                exempt d&apos;erreurs.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              8. Modifications des Conditions
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions
              d&apos;utilisation à tout moment. Les utilisateurs seront informés
              de toute mise à jour et l&apos;utilisation continue de la
              plateforme constituera une acceptation des nouvelles conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              9. Loi Applicable
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Les présentes conditions sont régies par la législation en vigueur
              au Cameroun. Tout litige sera soumis à la compétence exclusive des
              tribunaux de la région.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              10. Contact
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Pour toute question concernant ces conditions d&apos;utilisation,
              veuillez nous contacter à l&apos;adresse suivante :{" "}
              <a
                className="text-green hover:underline"
                href="mailto:support@fanzonetickets.com"
              >
                support@fanzonetickets.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

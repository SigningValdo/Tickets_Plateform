import Image from "next/image";

export default function PrivacyPage() {
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
            Politique de Confidentialité
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
            Chez <strong className="text-black">FanZone Tickets</strong>, nous
            nous engageons à protéger la vie privée de nos utilisateurs. Cette
            politique de confidentialité décrit comment nous collectons,
            utilisons, et protégeons vos informations personnelles lorsque vous
            utilisez notre plateforme.
          </p>
        </div>

        {/* Sections 1 & 2 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                1. Informations Collectées
              </h2>
              <p className="text-sm text-gris2 leading-relaxed mb-3">
                Nous collectons diverses informations afin de vous fournir nos
                services :
              </p>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed">
                <li>
                  <strong className="text-black">
                    Informations personnelles :
                  </strong>{" "}
                  Nom, prénom, adresse e-mail, numéro de téléphone, et
                  informations de paiement.
                </li>
                <li>
                  <strong className="text-black">
                    Informations d&apos;utilisation :
                  </strong>{" "}
                  Données sur votre interaction avec notre plateforme, y compris
                  les pages visitées, le temps passé, et les événements
                  consultés.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                2. Utilisation des Informations
              </h2>
              <p className="text-sm text-gris2 leading-relaxed mb-3">
                Nous utilisons vos informations pour :
              </p>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
                <li>
                  Gérer votre compte et faciliter l&apos;achat de billets.
                </li>
                <li>
                  Communiquer avec vous concernant votre commande, les mises à
                  jour d&apos;événements, et le support client.
                </li>
                <li>
                  Améliorer notre plateforme et personnaliser votre expérience
                  utilisateur.
                </li>
                <li>
                  Envoyer des promotions et des informations sur nos événements,
                  si vous avez accepté de les recevoir.
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              3. Partage des Informations
            </h2>
            <p className="text-sm text-gris2 leading-relaxed mb-3">
              Nous ne vendons ni ne louons vos informations personnelles à des
              tiers. Vos informations peuvent être partagées dans les cas
              suivants :
            </p>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Avec des partenaires de paiement pour traiter vos transactions.
              </li>
              <li>
                Avec des fournisseurs de services qui nous assistent dans nos
                opérations (ex. : services de support client).
              </li>
              <li>
                En cas d&apos;obligation légale ou pour protéger nos droits.
              </li>
            </ul>
          </div>
        </div>

        {/* Sections 4, 5, 6 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              4. Sécurité des Données
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos informations personnelles
              contre tout accès non autorisé, perte ou divulgation. Cependant,
              aucune méthode de transmission sur Internet ou de stockage
              électronique n&apos;est totalement sécurisée.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              5. Vos Droits
            </h2>
            <p className="text-sm text-gris2 leading-relaxed mb-3">
              Vous avez le droit de :
            </p>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Accéder à vos informations personnelles et en demander la
                correction.
              </li>
              <li>
                Demander la suppression de vos informations personnelles dans
                les limites permises par la loi.
              </li>
              <li>
                Refuser de recevoir des communications marketing à tout moment.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">6. Cookies</h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur
              notre plateforme. Les cookies sont de petits fichiers texte
              stockés sur votre appareil. Vous pouvez gérer vos préférences de
              cookies dans les paramètres de votre navigateur.
            </p>
          </div>
        </div>

        {/* Sections 7 & 8 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              7. Modifications de la Politique
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les utilisateurs seront informés de
              tout changement, et votre utilisation continue de la plateforme
              constituera une acceptation des nouvelles conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">8. Contact</h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Pour toute question ou préoccupation concernant notre politique de
              confidentialité, veuillez nous contacter à l&apos;adresse suivante
              :{" "}
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

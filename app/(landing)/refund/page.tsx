import Image from "next/image";

export default function RefundPage() {
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
            Politique de Remboursement
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
            nous engageons à offrir une expérience utilisateur transparente et
            équitable. Cette politique de remboursement décrit les conditions
            dans lesquelles les remboursements peuvent être accordés pour les
            billets achetés sur notre plateforme.
          </p>
        </div>

        {/* Sections 1 & 2 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                1. Billets Non Remboursables
              </h2>
              <p className="text-sm text-gris2 leading-relaxed">
                Tous les billets achetés sur{" "}
                <strong className="text-black">FanZone Tickets</strong> sont
                généralement non remboursables. Veuillez vérifier les détails de
                chaque événement, car des conditions particulières peuvent
                s&apos;appliquer.
              </p>
            </div>
            <div>
              <h2 className="text-base font-bold text-black mb-3">
                2. Annulation d&apos;Événement
              </h2>
              <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
                <li>
                  En cas d&apos;annulation d&apos;un événement, nous procéderons
                  au remboursement intégral du prix du billet (hors frais de
                  service éventuels) aux acheteurs.
                </li>
                <li>
                  Le remboursement sera effectué dans un délai raisonnable après
                  l&apos;annulation et sera crédité sur le mode de paiement
                  utilisé lors de l&apos;achat.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sections 3 & 4 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              3. Changement de Date ou de Lieu
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Si un événement change de date ou de lieu, nous informerons tous
                les acheteurs. Les billets resteront valides pour la nouvelle
                date ou le nouveau lieu.
              </li>
              <li>
                Les acheteurs auront la possibilité de demander un remboursement
                si la nouvelle date ou le nouveau lieu ne leur convient pas. Les
                demandes de remboursement doivent être soumises dans un délai
                spécifié (généralement 7 jours) après l&apos;annonce du
                changement.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              4. Procédure de Demande de Remboursement
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Pour demander un remboursement, veuillez contacter notre service
                client à l&apos;adresse{" "}
                <a
                  className="text-green hover:underline"
                  href="mailto:support@fanzonetickets.com"
                >
                  support@fanzonetickets.com
                </a>{" "}
                en précisant votre numéro de commande et la raison de votre
                demande.
              </li>
              <li>
                Les demandes seront examinées au cas par cas et une réponse vous
                sera fournie dans les meilleurs délais.
              </li>
            </ul>
          </div>
        </div>

        {/* Sections 5, 6, 7 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-black mb-3">
              5. Exceptions
            </h2>
            <ul className="space-y-2 text-sm text-gris2 leading-relaxed list-disc list-inside">
              <li>
                Les remboursements ne seront pas accordés pour les billets
                achetés auprès de revendeurs non autorisés ou pour les billets
                perdus ou volés.
              </li>
              <li>
                Nous ne sommes pas responsables des frais d&apos;hébergement, de
                transport ou d&apos;autres dépenses engagés en raison de
                changements d&apos;événements ou d&apos;annulations.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">
              6. Modification de la Politique
            </h2>
            <p className="text-sm text-gris2 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de
              remboursement à tout moment. Les utilisateurs seront informés de
              toute mise à jour, et l&apos;utilisation continue de la plateforme
              constituera une acceptation des nouvelles conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-black mb-3">7. Contact</h2>
            <div className="text-sm text-gris2 leading-relaxed space-y-1">
              <p>
                <strong className="text-black">Siège social :</strong> Mimboman,
                DOCC OPEP
              </p>
              <p>
                <strong className="text-black">Email :</strong>{" "}
                <a
                  className="text-green hover:underline"
                  href="mailto:support@fanzonetickets.com"
                >
                  support@fanzonetickets.com
                </a>
              </p>
              <p>
                <strong className="text-black">Web :</strong>{" "}
                <a
                  className="text-green hover:underline"
                  href="https://fanzonetickets.com"
                >
                  fanzonetickets.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

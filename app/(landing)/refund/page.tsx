import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-justify">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Politique de Remboursement
          </h1>
          <p className="text-gray-500 mb-8">
            Dernière mise à jour : 1 janvier 2025
          </p>

          <div className="prose max-w-none [&_span]:font-bold [&_h2]:font-bold [&_ul]:list-disc [&_ul]:list-inside space-y-5">
            <p>
              Chez <span>FanZone Tickets</span>, nous nous engageons à offrir
              une expérience utilisateur transparente et équitable. Cette
              politique de remboursement décrit les conditions dans lesquelles
              les remboursements peuvent être accordés pour les billets achetés
              sur notre plateforme.
            </p>

            <h2>1. Billets Non Remboursables</h2>
            <ul>
              <li>
                Tous les billets achetés sur <span>FanZone Tickets</span> sont
                généralement non remboursables. Veuillez vérifier les détails de
                chaque événement, car des conditions particulières peuvent
                s'appliquer.
              </li>
            </ul>

            <h2>2. Annulation d'Événement</h2>
            <ul>
              <li>
                En cas d'annulation d'un événement, nous procéderons au
                remboursement intégral du prix du billet (hors frais de service
                éventuels) aux acheteurs.
              </li>
              <li>
                Le remboursement sera effectué dans un délai raisonnable après
                l'annulation et sera crédité sur le mode de paiement utilisé
                lors de l'achat.
              </li>
            </ul>

            <h2>3. Changement de Date ou de Lieu</h2>
            <ul>
              <li>
                Si un événement change de date ou de lieu, nous informerons tous
                les acheteurs. Les billets resteront valides pour la nouvelle
                date ou le nouveau lieu.
              </li>
              <li>
                Les acheteurs auront la possibilité de demander un remboursement
                si la nouvelle date ou le nouveau lieu ne leur convient pas. Les
                demandes de remboursement doivent être soumises dans un délai
                spécifié (généralement 7 jours) après l'annonce du changement.
              </li>
            </ul>

            <h2>4. Procédure de Demande de Remboursement</h2>
            <ul>
              <li>
                Pour demander un remboursement, veuillez contacter notre service
                client à l'adresse fanszonetickets@gmail.com en précisant votre
                numéro de commande et la raison de votre demande.
              </li>
              <li>
                Les demandes seront examinées au cas par cas et une réponse vous
                sera fournie dans les meilleurs délais.
              </li>
            </ul>

            <h2>5. Exceptions</h2>
            <ul>
              <li>
                Les remboursements ne seront pas accordés pour les billets
                achetés auprès de revendeurs non autorisés ou pour les billets
                perdus ou volés.
              </li>
              <li>
                Nous ne sommes pas responsables des frais d'hébergement, de
                transport ou d'autres dépenses engagés en raison de changements
                d'événements ou d'annulations.
              </li>
            </ul>

            <h2>6. Modification de la Politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              remboursement à tout moment. Les utilisateurs seront informés de
              toute mise à jour, et l'utilisation continue de la plateforme
              constituera une acceptation des nouvelles conditions.
            </p>

            <h2>7. Contact</h2>
            <p>
              Siège social : Mimboman, DOVV OPEP
              <br />
              Email :{" "}
              <a
                className="text-fanzone-orange"
                href="mailto:fanszonetickets@gmail.com"
              >
                fanszonetickets@gmail.com
              </a>
              <br />
              Web :{" "}
              <a
                className="text-fanzone-orange"
                href="https://fanszonetickets.cm"
              >
                fanszonetickets.cm
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

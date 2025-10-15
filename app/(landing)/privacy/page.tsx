import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-justify">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-500 mb-8">
            Dernière mise à jour : 1 janvier 2025
          </p>

          <div className="prose max-w-none [&_span]:font-bold [&_h2]:font-bold [&_ul]:list-disc [&_ul]:list-inside space-y-5">
            <p>
              Chez <span>FanZone Tickets</span>, nous nous engageons à protéger
              la vie privée de nos utilisateurs. Cette politique de
              confidentialité décrit comment nous collectons, utilisons, et
              protégeons vos informations personnelles lorsque vous utilisez
              notre plateforme.
            </p>

            <h2>1. Informations Collectées</h2>
            <p>
              Nous collectons diverses informations afin de vous fournir nos
              services :
            </p>
            <ul>
              <li>
                <strong>Informations personnelles :</strong> Nom, prénom,
                adresse e-mail, numéro de téléphone, et informations de
                paiement.
              </li>
              <li>
                <strong>Informations d'utilisation :</strong> Données sur votre
                interaction avec notre plateforme, y compris les pages visitées,
                le temps passé, et les événements consultés.
              </li>
            </ul>

            <h2>2. Utilisation des Informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul>
              <li>Gérer votre compte et faciliter l'achat de billets.</li>
              <li>
                Communiquer avec vous concernant votre commande, les mises à
                jour d'événements, et le support client.
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

            <h2>3. Partage des Informations</h2>
            <p>
              Nous ne vendons ni ne louons vos informations personnelles à des
              tiers. Vos informations peuvent être partagées dans les cas
              suivants :
            </p>
            <ul>
              <li>
                Avec des partenaires de paiement pour traiter vos transactions.
              </li>
              <li>
                Avec des fournisseurs de services qui nous assistent dans nos
                opérations (ex. : services de support client).
              </li>
              <li>En cas d'obligation légale ou pour protéger nos droits.</li>
            </ul>

            <h2>4. Sécurité des Données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos informations personnelles
              contre tout accès non autorisé, perte ou divulgation. Cependant,
              aucune méthode de transmission sur Internet ou de stockage
              électronique n'est totalement sécurisée.
            </p>

            <h2>5. Vos Droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
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

            <h2>6. Cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur
              notre plateforme. Les cookies sont de petits fichiers texte
              stockés sur votre appareil. Vous pouvez gérer vos préférences de
              cookies dans les paramètres de votre navigateur.
            </p>

            <h2>7. Modifications de la Politique</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment. Les utilisateurs seront informés de
              tout changement, et votre utilisation continue de la plateforme
              constituera une acceptation des nouvelles conditions.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute question ou préoccupation concernant notre politique de
              confidentialité, veuillez nous contacter à l'adresse suivante :
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

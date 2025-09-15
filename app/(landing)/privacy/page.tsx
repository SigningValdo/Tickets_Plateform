import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-500 mb-8">
            Dernière mise à jour : 1 mai 2024
          </p>

          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Chez E-Tickets, nous accordons une grande importance à la
              protection de vos données personnelles. Cette Politique de
              Confidentialité explique comment nous collectons, utilisons,
              partageons et protégeons vos informations lorsque vous utilisez
              notre plateforme et nos services.
            </p>
            <p>
              En utilisant notre plateforme, vous consentez à la collecte et à
              l'utilisation de vos informations conformément à cette politique.
            </p>

            <h2>2. Informations que nous collectons</h2>
            <p>
              Nous collectons différents types d'informations vous concernant,
              notamment :
            </p>
            <ul>
              <li>
                <strong>Informations d'identification :</strong> nom, prénom,
                adresse email, numéro de téléphone, adresse postale.
              </li>
              <li>
                <strong>Informations de paiement :</strong> numéro de carte
                bancaire, date d'expiration, code de sécurité (ces informations
                sont traitées par nos prestataires de paiement sécurisés et ne
                sont pas stockées sur nos serveurs).
              </li>
              <li>
                <strong>Informations d'utilisation :</strong> données sur la
                façon dont vous interagissez avec notre plateforme, les pages
                que vous visitez, les événements qui vous intéressent.
              </li>
              <li>
                <strong>Informations techniques :</strong> adresse IP, type de
                navigateur, appareil utilisé, système d'exploitation.
              </li>
            </ul>

            <h2>3. Comment nous utilisons vos informations</h2>
            <p>
              Nous utilisons vos informations pour les finalités suivantes :
            </p>
            <ul>
              <li>
                Fournir, maintenir et améliorer notre plateforme et nos
                services.
              </li>
              <li>Traiter vos transactions et vous envoyer vos billets.</li>
              <li>
                Vous envoyer des informations importantes concernant vos achats
                ou les événements auxquels vous participez.
              </li>
              <li>
                Vous envoyer des communications marketing si vous avez donné
                votre consentement.
              </li>
              <li>
                Détecter, prévenir et résoudre les problèmes techniques ou de
                sécurité.
              </li>
              <li>Se conformer aux obligations légales.</li>
            </ul>

            <h2>4. Partage de vos informations</h2>
            <p>Nous pouvons partager vos informations avec :</p>
            <ul>
              <li>
                <strong>Les organisateurs d'événements :</strong> pour leur
                permettre de gérer l'accès à leurs événements et de vous
                contacter si nécessaire.
              </li>
              <li>
                <strong>Nos prestataires de services :</strong> qui nous aident
                à fournir nos services (traitement des paiements, hébergement,
                support client, etc.).
              </li>
              <li>
                <strong>Les autorités légales :</strong> lorsque nous sommes
                légalement tenus de le faire ou pour protéger nos droits.
              </li>
            </ul>
            <p>Nous ne vendons pas vos données personnelles à des tiers.</p>

            <h2>5. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles appropriées pour protéger vos données
              personnelles contre la perte, l'accès non autorisé, la
              divulgation, l'altération ou la destruction.
            </p>
            <p>
              Cependant, aucune méthode de transmission sur Internet ou de
              stockage électronique n'est totalement sécurisée. Nous ne pouvons
              donc pas garantir une sécurité absolue.
            </p>

            <h2>6. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que
              nécessaire pour atteindre les finalités décrites dans cette
              politique, sauf si une période de conservation plus longue est
              requise ou permise par la loi.
            </p>

            <h2>7. Vos droits</h2>
            <p>
              Selon les lois applicables en matière de protection des données,
              vous pouvez avoir les droits suivants :
            </p>
            <ul>
              <li>Droit d'accès à vos données personnelles.</li>
              <li>Droit de rectification des données inexactes.</li>
              <li>
                Droit à l'effacement de vos données dans certaines
                circonstances.
              </li>
              <li>
                Droit à la limitation du traitement dans certaines
                circonstances.
              </li>
              <li>Droit à la portabilité des données.</li>
              <li>
                Droit d'opposition au traitement dans certaines circonstances.
              </li>
              <li>Droit de retirer votre consentement à tout moment.</li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter à l'adresse
              privacy@e-tickets.com.
            </p>

            <h2>8. Cookies et technologies similaires</h2>
            <p>
              Nous utilisons des cookies et des technologies similaires pour
              améliorer votre expérience sur notre plateforme, analyser comment
              vous l'utilisez et personnaliser notre contenu.
            </p>
            <p>
              Vous pouvez configurer votre navigateur pour refuser tous les
              cookies ou pour indiquer quand un cookie est envoyé. Cependant,
              certaines fonctionnalités de notre plateforme peuvent ne pas
              fonctionner correctement sans cookies.
            </p>

            <h2>9. Transferts internationaux de données</h2>
            <p>
              Vos informations peuvent être transférées et traitées dans des
              pays autres que celui où vous résidez. Ces pays peuvent avoir des
              lois différentes en matière de protection des données.
            </p>
            <p>
              Lorsque nous transférons vos données en dehors de votre pays de
              résidence, nous prenons des mesures appropriées pour assurer que
              vos informations bénéficient d'un niveau de protection adéquat.
            </p>

            <h2>10. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette Politique de Confidentialité de
              temps à autre. La version la plus récente sera toujours disponible
              sur notre plateforme avec la date de la dernière mise à jour.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette politique
              pour rester informé de la façon dont nous protégeons vos
              informations.
            </p>

            <h2>11. Contact</h2>
            <p>
              Si vous avez des questions concernant cette Politique de
              Confidentialité, veuillez nous contacter à l'adresse suivante :
              privacy@e-tickets.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

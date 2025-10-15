import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="FANZONE TICKETS"
              width={200}
              height={100}
            />
            <p className="text-gray-300 fanzone-body mb-4">
              Votre plateforme de billetterie en ligne sécurisée et fiable.
            </p>
            <p className="text-fanzone-orange font-medium italic text-sm">
              "Agility vos émotions, un ticket à la fois"
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fanzone-orange">
              Liens rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fanzone-orange">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-300 hover:text-fanzone-orange transition-colors"
                >
                  Politique de remboursement
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-fanzone-orange">
              Nous contacter
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-300 ">
                Email:{" "}
                <a
                  href="mailto:fanszonetickets@gmail.com"
                  className="hover:text-fanzone-orange transition-colors"
                >
                  fanszonetickets@gmail.com
                </a>
              </li>
              <li className="text-gray-300 ">
                Téléphone:{" "}
                <a
                  href="tel:+237676766471"
                  className="hover:text-fanzone-orange transition-colors"
                >
                  6 76 76 64 71 / 694 59 30 08
                </a>
              </li>
              <li className="text-gray-300 ">
                Adresse:{" "}
                <a
                  href="https://maps.app.goo.gl/H6h3Q7DPhMh1NwWd7"
                  className="hover:text-fanzone-orange transition-colors"
                >
                  Mimboman, DOVV OPEP
                  <br />
                  Yaoundé, Cameroun
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} FANZONE TICKETS. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

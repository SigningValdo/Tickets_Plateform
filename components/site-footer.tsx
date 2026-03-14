import Link from "next/link";
import Image from "next/image";
import { CameroonFlag } from "@/components/cameroon-flag";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-y-10 gap-x-[118px]">
          {/* Logo & description */}
          <div>
            <Image
              src="/logo/logo-white.svg"
              alt="FANZONE TICKETS"
              width={160}
              height={80}
            />
            <p className="text-gris3 text-sm mt-4 mb-4">
              Votre plateforme de billetterie en ligne <br /> sécurisée et
              fiable
            </p>
            <p className="text-yellow font-medium italic text-sm mb-4">
              &quot;Agility vos émotions, un ticket à la fois&quot;
            </p>
          </div>
          <div className="flex flex-col gap-y-10 md:flex-row md:justify-between flex-1">
            {/* Liens rapides */}
            <div>
              <h4 className="font-semibold mb-5">Liens rapides</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/events"
                    className="text-bg hover:text-white transition-colors"
                  >
                    Evènements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-bg hover:text-white transition-colors"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-bg hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Informations Légales */}
            <div>
              <h4 className="font-semibold mb-5">Informations Légales</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/terms"
                    className="text-bg hover:text-white transition-colors"
                  >
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-bg hover:text-white transition-colors"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund"
                    className="text-bg hover:text-white transition-colors"
                  >
                    Politique de remboursement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Nous contacter */}
            <div>
              <h4 className="font-semibold mb-5">Nous contacter</h4>
              <ul className="space-y-3 text-bg">
                <li>
                  Email :{" "}
                  <a
                    href="mailto:support@fanzonetickets.com"
                    className="hover:text-white transition-colors"
                  >
                    support@fanzonetickets.com
                  </a>
                </li>
                <li>
                  Téléphone :{" "}
                  <a
                    href="tel:+237676766471"
                    className="hover:text-white transition-colors"
                  >
                    676 76 64 71 / 694 59 30 08
                  </a>
                </li>
                <li>
                  Adresse : DOCC OPEP, Mimboman
                  <br />
                  <span className="ml-[70px]">Yaoundé - Cameroun</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#000]">
        <div className="container pt-2 pb-3">
          <p className="text-center text-xs text-gris2">
            &copy; {new Date().getFullYear()} FANZONE TICKETS. Tous droits
            réservés. Made in Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
}

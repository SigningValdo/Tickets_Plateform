import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  QrCode,
  BarChart3,
  HeadphonesIcon,
  Star,
  Eye,
} from "lucide-react";

const VALUES = [
  {
    title: "Innovation",
    description:
      "Nous nous engageons à innover en permanence pour offrir des solutions technologiques à la pointe.",
  },
  {
    title: "Transparence",
    description:
      "Nous valorisons la transparence dans toutes nos interactions et créons un environnement de confiance.",
  },
  {
    title: "Excellence",
    description:
      "Nous visons l'excellence dans tout ce que nous faisons, de la conception à l'expérience utilisateur.",
  },
  {
    title: "Accessibilité",
    description:
      "Nous croyons que l'accès à la culture et au divertissement devrait être universel.",
  },
  {
    title: "Responsabilité Sociale",
    description:
      "Nous soutenons les initiatives qui favorisent le développement durable et l'épanouissement des talents locaux.",
  },
  {
    title: "Collaboration",
    description:
      "Nous croyons en la force du travail d'équipe et de la collaboration avec nos partenaires.",
  },
];

const ADVANTAGES = [
  {
    icon: Shield,
    title: "Sécurité des Transactions",
    description:
      "Paiements sécurisés grâce à l'intégration de solutions locales comme Mobile Money (MTN, Orange) et cartes bancaires.",
  },
  {
    icon: QrCode,
    title: "Billetterie 100% Numérique",
    description:
      "Billets numériques avec QR Code unique envoyé par e-mail ou SMS pour faciliter l'entrée aux événements.",
  },
  {
    icon: BarChart3,
    title: "Gestion en Temps Réel",
    description:
      "Suivez les ventes et accédez à des statistiques détaillées en temps réel pour des décisions éclairées.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support Client Dédié",
    description:
      "Notre équipe de support est disponible pour assister les utilisateurs à chaque étape.",
  },
  {
    icon: Star,
    title: "Flexibilité Totale",
    description:
      "Concert, conférence, festival ou événement sportif — FanZone Tickets s'adapte à vos besoins.",
  },
  {
    icon: Eye,
    title: "Transparence Complète",
    description:
      "Informations claires sur les frais et les processus pour une confiance totale.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[500px] w-full overflow-hidden">
        <Image
          src="/bg-about.jpg"
          alt="À propos de FanZone Tickets"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Découvrez l&apos;univers de FanZone Tickets
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Transformons l&apos;expérience événementielle au Cameroun en
              rendant l&apos;achat et la gestion des billets simples, rapides et
              sécurisés.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-20">
        {/* Mission */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Notre Mission
            </h2>
            <div className="w-16 h-1 bg-green mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/mission.jpg"
                alt="Notre mission"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gris2 mb-5 leading-relaxed">
                Chez <strong className="text-black">FanZone Tickets</strong>,
                notre mission est de transformer l&apos;expérience
                événementielle au Cameroun. Nous nous engageons à :
              </p>
              <ul className="space-y-3">
                {[
                  {
                    label: "Faciliter l'accès aux événements",
                    text: "Offrir une plateforme intuitive qui simplifie le processus d'achat de billets.",
                  },
                  {
                    label: "Promouvoir la transparence",
                    text: "Garantir un système de billetterie fiable qui favorise la confiance.",
                  },
                  {
                    label: "Soutenir le développement local",
                    text: "Contribuer à la modernisation de l'économie de l'événementiel au Cameroun.",
                  },
                  {
                    label: "Service client exceptionnel",
                    text: "Assurer un support accessible et réactif.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-1 h-6 w-6 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="h-2 w-2 rounded-full bg-green" />
                    </span>
                    <p className="text-sm text-gris2 leading-relaxed">
                      <strong className="text-black">{item.label} :</strong>{" "}
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Nos Valeurs
            </h2>
            <div className="w-16 h-1 bg-green mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              >
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green/10 text-green font-bold text-sm mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-black mb-2">{v.title}</h3>
                <p className="text-sm text-gris2 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Histoire */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Notre Histoire
            </h2>
            <div className="w-16 h-1 bg-green mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gris2 mb-4 leading-relaxed">
                <strong className="text-black">FanZone Tickets</strong> est née
                en 2025 d&apos;une vision audacieuse : transformer
                l&apos;expérience événementielle au Cameroun. Face aux défis
                rencontrés par les organisateurs et les participants dans le
                processus d&apos;achat de billets, nous avons compris
                qu&apos;il était essentiel de créer une plateforme adaptée aux
                besoins spécifiques du marché local.
              </p>
              <p className="text-gris2 mb-4 leading-relaxed">
                L&apos;idée a émergé en réponse aux préoccupations exprimées par
                de nombreux organisateurs concernant la fraude, la complexité de
                gestion des ventes et l&apos;accès limité à des solutions de
                billetterie modernes.
              </p>
              <p className="text-gris2 leading-relaxed">
                Après plusieurs mois de recherche et de développement, nous
                avons conçu notre plateforme en intégrant des solutions de
                paiement locales telles que Mobile Money, permettant à chaque
                utilisateur d&apos;acheter des billets facilement.
              </p>
            </div>
            <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/equipe.jpg"
                alt="Notre équipe"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Croissance */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Notre Croissance
            </h2>
            <div className="w-16 h-1 bg-green mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative h-[320px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/croissance.jpg"
                alt="Notre croissance"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gris2 mb-4 leading-relaxed">
                <strong className="text-black">FanZone Tickets</strong> a été
                officiellement lancé en 2025 et a rapidement attiré
                l&apos;attention des organisateurs d&apos;événements et du
                public. Grâce à sa simplicité d&apos;utilisation, sa sécurité et
                ses fonctionnalités innovantes, notre plateforme est devenue un
                outil essentiel pour gérer divers événements.
              </p>
              <p className="text-gris2 leading-relaxed">
                Depuis notre lancement, nous avons constamment évolué en réponse
                aux besoins de nos utilisateurs. Nous avons élargi notre équipe
                pour inclure des experts en marketing, en analyse de données et
                en support client, garantissant ainsi une expérience optimale
                pour tous.
              </p>
            </div>
          </div>
        </section>

        {/* Pourquoi choisir */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Pourquoi Choisir FanZone Tickets ?
            </h2>
            <div className="w-16 h-1 bg-green mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="h-12 w-12 rounded-full bg-green/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-green" />
                </div>
                <h3 className="font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-sm text-gris2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="relative bg-green h-[276px] text-white text-center">
        <Image
          src="/filigrame.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 max-w-3xl flex flex-col justify-center items-center text-center container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à organiser votre événement ?
          </h2>
          <p className="text-lg mb-8">
            Rejoignez les organisateurs qui font confiance à FanZone Tickets
            pour la gestion de leur billetterie au Cameroun.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-12 px-8 bg-white text-green font-medium rounded-2xl hover:bg-white/90 transition-colors"
          >
            Devenir organisateur
          </Link>
        </div>
      </section>
    </div>
  );
}

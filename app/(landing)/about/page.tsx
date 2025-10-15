import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen ">
      <section className="text-center bg-[url('/bg-about.jpg')] bg-cover bg-center h-[600px] w-full">
        <div className="w-full h-full bg-black/50 flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-fanzone-orange fanzone-heading">
              Découvrez l'univers de FanZone Tickets
            </h1>
            <p className="text-xl text-white mb-6 max-w-3xl mx-auto fanzone-body">
              Transformons l'expérience événementielle au Cameroun en rendant
              l'achat et la gestion des billets simples, rapides et sécurisés.
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 mt-10 py-12 space-y-16">
        <section>
          <div className="space-y-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-fanzone-orange mb-4">
              Notre Mission
            </h2>
            <div className="prose grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Image
                  src="/mission.jpg"
                  alt="FanZone Tickets"
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
              <div className="w-[600px] text-lg">
                <p className="mb-6">
                  Chez FanZone Tickets, notre mission est de transformer
                  l'expérience événementielle au Cameroun. Nous nous engageons à
                  :
                </p>
                <ul className="space-y-2 mb-6 max-w-[450px]">
                  <li>
                    • <strong>Faciliter l'accès aux événements : </strong>
                    Offrir une plateforme intuitive qui simplifie le processus
                    d'achat de billets.
                  </li>
                  <li>
                    • <strong>Promouvoir la transparence :</strong> Garantir un
                    système de billetterie fiable qui favorise la confiance.
                  </li>
                  <li>
                    •{" "}
                    <strong>
                      Soutenir le développement économique local :
                    </strong>{" "}
                    Contribuer à la modernisation de l'économie de
                    l'événementiel au Cameroun.
                  </li>
                  <li>
                    • <strong>Offrir un service client exceptionnel :</strong>{" "}
                    Assurer un support accessible et réactif.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="space-y-16 text-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-fanzone-orange mb-4">
              Nos Valeurs
            </h2>
            <div className="">
              <ul className="space-y-2 prose grid grid-cols-1 md:grid-cols-3 gap-8">
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>1. Innovation </strong> Nous nous engageons à innover
                  en permanence pour offrir des solutions technologiques à la
                  pointe.
                </li>
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>2. Transparence </strong> Nous valorisons la
                  transparence dans toutes nos interactions et créons un
                  environnement de confiance.
                </li>
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>3. Excellence </strong> Nous visons l'excellence dans
                  tout ce que nous faisons.
                </li>
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>4. Accessibilité </strong> Nous croyons que l'accès à
                  la culture et au divertissement devrait être universel.
                </li>
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>5. Responsabilité Sociale </strong> Nous soutenons les
                  initiatives qui favorisent le développement durable et
                  l'épanouissement des talents locaux.
                </li>
                <li className="flex items-center gap-2 flex-col text-center">
                  <strong>6. Collaboration </strong> Nous croyons en la force du
                  travail d'équipe et de la collaboration.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <div className="space-y-16 text-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-fanzone-orange mb-4">
              Notre Histoire
            </h2>
            <div className="prose grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="max-w-[600px]">
                <p>
                  FanZone Tickets est née en 2025 d'une vision audacieuse :
                  transformer l'expérience événementielle au Cameroun. Face aux
                  défis rencontrés par les organisateurs et les participants
                  dans le processus d'achat de billets, nous avons compris qu'il
                  était essentiel de créer une plateforme adaptée aux besoins
                  spécifiques du marché local.
                </p>
                <p className="mb-6">
                  L'idée de FanZone Tickets a émergé en réponse aux
                  préoccupations exprimées par de nombreux organisateurs
                  d'événements concernant la fraude, la complexité de gestion
                  des ventes et l'accès limité à des solutions de billetterie
                  modernes.
                </p>
                <p className="mb-6">
                  Après plusieurs mois de recherche et de développement, nous
                  avons conçu notre plateforme en intégrant des solutions de
                  paiement locales telles que Mobile Money, permettant à chaque
                  utilisateur d'acheter des billets facilement.
                </p>
              </div>
              <div>
                <Image
                  src="/equipe.jpg"
                  alt="FanZone Tickets"
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="space-y-16 text-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-fanzone-orange mb-4">
              Notre Croissance
            </h2>
            <div className="prose grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Image
                  src="/croissance.jpg"
                  alt="FanZone Tickets"
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
              <div className="max-w-[600px]">
                <p className="mb-4">
                  <strong>FanZone Tickets</strong> a été officiellement lancée
                  en 2025 et a rapidement attiré l'attention des organisateurs
                  d'événements et du public. Grâce à sa simplicité
                  d'utilisation, sa sécurité et ses fonctionnalités innovantes,
                  notre plateforme est devenue un outil essentiel pour gérer
                  divers événements.
                </p>
                <p className="mb-6">
                  Depuis notre lancement, nous avons constamment évolué en
                  réponse aux besoins de nos utilisateurs. Nous avons élargi
                  notre équipe pour inclure des experts en marketing, en analyse
                  de données et en support client, garantissant ainsi une
                  expérience optimale pour tous.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 space-y-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-fanzone-orange mb-4">
            Pourquoi Choisir FanZone Tickets ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Sécurité des Transactions
                </h3>
                <p className="text-gray-600">
                  Nous garantissons des paiements sécurisés grâce à
                  l'intégration de solutions de paiement locales comme Mobile
                  Money (MTN, Orange) et cartes bancaires.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.25" />
                    <path d="M21 3v9h-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Billetterie 100% Numérique
                </h3>
                <p className="text-gray-600">
                  Tous les billets sont numériques, accompagnés d'un QR Code
                  unique envoyé par e-mail ou SMS. Ce système facilite l'entrée
                  aux événements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Gestion en Temps Réel
                </h3>
                <p className="text-gray-600">
                  Les organisateurs peuvent suivre les ventes et accéder à des
                  statistiques détaillées en temps réel, leur permettant de
                  prendre des décisions éclairées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Support Client Dédicacé
                </h3>
                <p className="text-gray-600">
                  Notre équipe de support est disponible pour assister les
                  utilisateurs à chaque étape, garantissant une expérience
                  fluide et agréable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Flexibilité pour Tous Types d'Événements
                </h3>
                <p className="text-gray-600">
                  Que vous organisiez un concert, une conférence, un festival ou
                  un événement sportif, FanZone Tickets s'adapte à vos besoins
                  spécifiques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-fanzone-orange"
                  >
                    <path d="M3 3h18v18H3zM9 9h6v6H9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Engagement envers la Transparence
                </h3>
                <p className="text-gray-600">
                  Nous croyons en la transparence totale dans nos opérations,
                  fournissant des informations claires sur les frais et les
                  processus.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Nos Partenaires Locaux
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-md shadow-sm flex items-center justify-center"
              >
                <div className="text-gray-400 font-medium">Partenaire {i}</div>
              </div>
            ))}
          </div>
        </section> */}

        <section className="bg-purple-50 rounded-xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à organiser votre événement ?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Rejoignez les milliers d'organisateurs qui font confiance à FanZone
            Tickets pour la gestion de leur billetterie au Cameroun.
          </p>
          <Button className="bg-fanzone-orange hover:bg-fanzone-orange/90 text-lg px-8 py-6 h-auto">
            Devenir organisateur
          </Button>
        </section>
      </main>
    </div>
  );
}

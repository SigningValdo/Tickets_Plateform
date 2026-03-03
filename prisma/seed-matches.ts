import prisma from "../lib/db";

/**
 * Seed script — Elite One Cameroun (Saison Régulière)
 * Journée du dimanche 08 mars 2026
 *
 * Run with: npx tsx prisma/seed-matches.ts
 */

const matches = [
  {
    title: "Aigle Royal vs Fortuna Mfou - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Aigle Royal</strong> reçoit <strong>Fortuna Mfou</strong>.</p>
<p>Venez vibrer au rythme du football camerounais !</p>`,
    location: "Stade de Menoua",
    address: "Dschang",
    city: "Dschang",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 3000 },
      { name: "Tribune Couverte", price: 2000, quantity: 1500 },
      { name: "Tribune VIP", price: 5000, quantity: 500 },
    ],
  },
  {
    title: "Canon vs PWD Bamenda - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p>Le <strong>Canon de Yaoundé</strong> affronte <strong>PWD Bamenda</strong> dans un choc palpitant.</p>
<p>Le Canon joue à domicile, ne manquez pas ce grand rendez-vous !</p>`,
    location: "Stade Ahmadou Ahidjo",
    address: "Boulevard du 20 Mai, Yaoundé",
    city: "Yaoundé",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 5000 },
      { name: "Tribune Couverte", price: 3000, quantity: 2000 },
      { name: "Tribune VIP", price: 5000, quantity: 1000 },
      { name: "Tribune Présidentielle", price: 10000, quantity: 200 },
    ],
  },
  {
    title: "Cotonsport vs Aigle Royal - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Cotonsport de Garoua</strong> reçoit <strong>Aigle Royal</strong> au Stade Roumdé Adjia.</p>
<p>Le champion en titre joue devant son public !</p>`,
    location: "Stade Roumdé Adjia",
    address: "Garoua",
    city: "Garoua",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 4000 },
      { name: "Tribune Couverte", price: 2000, quantity: 2000 },
      { name: "Tribune VIP", price: 5000, quantity: 800 },
    ],
  },
  {
    title: "Fauve Azur E. vs Victoria Utd - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Fauve Azur Elite</strong> affronte <strong>Victoria United</strong>.</p>
<p>Un duel passionnant à ne pas rater !</p>`,
    location: "Stade Omnisports de Bafoussam",
    address: "Bafoussam",
    city: "Bafoussam",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 3000 },
      { name: "Tribune Couverte", price: 2000, quantity: 1500 },
      { name: "Tribune VIP", price: 5000, quantity: 500 },
    ],
  },
  {
    title: "Gazelle vs Dynamo - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Gazelle de Garoua</strong> reçoit <strong>Dynamo</strong>.</p>
<p>Ambiance garantie dans le Nord Cameroun !</p>`,
    location: "Stade Roumdé Adjia",
    address: "Garoua",
    city: "Garoua",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 3000 },
      { name: "Tribune Couverte", price: 2000, quantity: 1500 },
      { name: "Tribune VIP", price: 5000, quantity: 500 },
    ],
  },
  {
    title: "Renard vs Panthère Ndé - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Renard</strong> affronte <strong>Panthère du Ndé</strong>.</p>
<p>Venez encourager votre équipe favorite !</p>`,
    location: "Stade Municipal de Mfou",
    address: "Mfou",
    city: "Mfou",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 2000 },
      { name: "Tribune Couverte", price: 2000, quantity: 1000 },
      { name: "Tribune VIP", price: 5000, quantity: 300 },
    ],
  },
  {
    title: "Unisport vs Colombe - Elite One",
    description: `<p>Match de la saison régulière du championnat <strong>Elite One</strong> du Cameroun.</p>
<p><strong>Unisport de Bertoua</strong> reçoit <strong>Colombe</strong>.</p>
<p>Supportez Unisport à domicile dans ce match de championnat !</p>`,
    location: "Stade Municipal de Bertoua",
    address: "Bertoua",
    city: "Bertoua",
    status: "ACTIVE" as const,
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
    ticketTypes: [
      { name: "Tribune Populaire", price: 1000, quantity: 2500 },
      { name: "Tribune Couverte", price: 2000, quantity: 1200 },
      { name: "Tribune VIP", price: 5000, quantity: 400 },
    ],
  },
];

// Tous les matchs se jouent le dimanche 08 mars 2026
const MATCH_DATE = new Date("2026-03-08T15:00:00Z");

async function main() {
  console.log("Ajout des matchs Elite One - Journée du 08/03/2026...\n");

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error(
      "Aucun utilisateur ADMIN trouvé. Lancez d'abord le seed principal."
    );
    process.exit(1);
  }

  // Ensure "Sports" category exists
  const sportsCategory = await prisma.eventCategory.upsert({
    where: { name: "Sports" },
    update: {},
    create: { name: "Sports", description: "Événements sportifs" },
  });

  for (const match of matches) {
    // Check if event already exists
    const existing = await prisma.event.findFirst({
      where: { title: match.title },
    });

    if (existing) {
      console.log(`  [skip] "${match.title}" existe déjà.`);
      continue;
    }

    const event = await prisma.event.create({
      data: {
        title: match.title,
        description: match.description,
        date: MATCH_DATE,
        location: match.location,
        address: match.address,
        city: match.city,
        country: "Cameroun",
        organizer: "FECAFOOT - Elite One",
        imageUrl: match.imageUrl,
        status: match.status,
        authorId: admin.id,
        categoryId: sportsCategory.id,
        ticketTypes: {
          create: match.ticketTypes,
        },
      },
      include: {
        ticketTypes: true,
      },
    });

    console.log(`  [ok] "${event.title}"`);
    event.ticketTypes.forEach((t) => {
      console.log(
        `       - ${t.name}: ${t.price.toLocaleString("fr-FR")} FCFA (${t.quantity} places)`
      );
    });
  }

  console.log("\nTerminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

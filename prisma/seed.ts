import { Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import prisma from "../lib/db";

// Données provenant des composants UI
const categorySeeds = [
  { name: "Concerts", slug: "concerts" },
  { name: "Théâtre", slug: "theatre" },
  { name: "Conférences", slug: "conferences" },
  { name: "Gastronomie", slug: "food" },
  { name: "Spectacles", slug: "shows" },
  { name: "Cinéma", slug: "cinema" },
  { name: "Ateliers", slug: "workshops" },
  { name: "Festivals", slug: "festivals" },
  { name: "Expositions", slug: "expositions" },
  { name: "Sports", slug: "sports" },
];

const featuredEvents = [
  {
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    location: "Palais de la Culture, Abidjan",
    category: "Concerts",
    price: "15000 FCFA",
  },
  {
    title: "Conférence Tech Innovation",
    image: "/placeholder.svg?height=400&width=600",
    date: "22 Juin 2024",
    location: "Centre de Conférences, Dakar",
    category: "Conférences",
    price: "5000 FCFA",
  },
  {
    title: "Exposition d'Art Contemporain",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 Juillet 2024",
    location: "Galerie Nationale, Lomé",
    category: "Expositions",
    price: "2000 FCFA",
  },
];

const upcomingEvents = [
  {
    title: "Concert de Musique Classique",
    image: "/placeholder.svg?height=400&width=600",
    date: "5 Août 2024",
    location: "Opéra National, Rabat",
    category: "Concerts",
    price: "10000 FCFA",
  },
  {
    title: "Tournoi de Football Caritatif",
    image: "/placeholder.svg?height=400&width=600",
    date: "12 Août 2024",
    location: "Stade Municipal, Douala",
    category: "Sports",
    price: "3000 FCFA",
  },
  {
    title: "Salon du Livre Africain",
    image: "/placeholder.svg?height=400&width=600",
    date: "20 Août 2024",
    location: "Centre Culturel, Bamako",
    category: "Expositions",
    price: "Gratuit",
  },
  {
    title: "Festival de Cinéma",
    image: "/placeholder.svg?height=400&width=600",
    date: "1 Septembre 2024",
    location: "Cinémathèque, Tunis",
    category: "Cinéma",
    price: "5000 FCFA",
  },
];

function parseFrenchDate(input: string): Date {
  const months: Record<string, number> = {
    janvier: 0,
    février: 1,
    fevrier: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    aout: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
    decembre: 11,
  };
  const m = input
    .trim()
    .toLowerCase()
    .match(/(\d{1,2})\s+([a-zéèêûôîàùç]+)\s+(\d{4})/i);
  if (!m) return new Date();
  const day = Number(m[1]);
  const monthName = m[2].normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const year = Number(m[3]);
  const month = months[monthName] ?? 0;
  return new Date(Date.UTC(year, month, day));
}

function parseCityAndCountry(location: string): {
  address: string;
  city: string;
  country: string;
} {
  const parts = location.split(",").map((s) => s.trim());
  const city = parts[parts.length - 1] || "N/A";
  return { address: location, city, country: "N/A" };
}

function parsePriceToFloat(price: string): number {
  if (!price) return 0;
  if (/gratuit/i.test(price)) return 0;
  const n = price.replace(/[^0-9.]/g, "");
  return Number(n || 0);
}

async function main() {
  console.log("Start seeding...");

  const adminEmail = "admin@example.com";
  const adminPassword = "password123";

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin User",
        role: Role.ADMIN,
      },
    });
    console.log(
      `Admin user created with email: ${adminEmail} and password: ${adminPassword}`
    );
  }

  // Fetch admin (ensures we have the id)
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) throw new Error("Admin not found after creation");

  // Seed categories
  console.log("Seeding categories...");
  for (const cat of categorySeeds) {
    await prisma.eventCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name, description: cat.slug },
    });
  }

  const categories = await prisma.eventCategory.findMany();
  const categoryByName = new Map(categories.map((c) => [c.name, c]));

  // Seed events (featured -> ACTIVE, upcoming -> UPCOMING)
  console.log("Seeding events...");
  const allEvents = [
    ...featuredEvents.map((e) => ({ ...e, status: "ACTIVE" as const })),
    ...upcomingEvents.map((e) => ({ ...e, status: "UPCOMING" as const })),
  ];

  for (const e of allEvents) {
    const cat =
      categoryByName.get(e.category) ?? Array.from(categoryByName.values())[0];
    if (!cat) {
      throw new Error("No event categories available to assign to events");
    }
    const { address, city, country } = parseCityAndCountry(e.location);
    const date = parseFrenchDate(e.date);
    const price = parsePriceToFloat(e.price);

    const existing = await prisma.event.findFirst({
      where: { title: e.title, date },
    });
    if (existing) {
      continue;
    }

    const createdEvent = await prisma.event.create({
      data: {
        title: e.title,
        description: `Billets pour ${e.title}.`,
        date,
        location: e.location,
        address,
        city,
        country,
        organizer: "E-Tickets",
        imageUrl: e.image,
        status: e.status === "ACTIVE" ? "ACTIVE" : "UPCOMING",
        authorId: admin.id,
        categoryId: cat.id,
      },
    });

    // Create a default TicketType
    await prisma.ticketType.create({
      data: {
        name: "Standard",
        price,
        quantity: 100,
        eventId: createdEvent.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

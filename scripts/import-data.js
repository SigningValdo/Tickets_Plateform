const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log("🔄 Import des données vers la nouvelle base...");

    // Lire le fichier d'export
    const exportPath = path.join(__dirname, "..", "data-export.json");
    if (!fs.existsSync(exportPath)) {
      throw new Error(
        "Fichier data-export.json non trouvé. Exécutez d'abord export-data.js"
      );
    }

    const data = JSON.parse(fs.readFileSync(exportPath, "utf8"));
    console.log(`📅 Données exportées le: ${data.exportedAt}`);

    // Import des catégories
    console.log("📂 Import des catégories...");
    for (const category of data.categories) {
      await prisma.eventCategory.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      });
    }
    console.log(`✅ ${data.categories.length} catégories importées`);

    // Import des utilisateurs
    console.log("👥 Import des utilisateurs...");
    for (const user of data.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    console.log(`✅ ${data.users.length} utilisateurs importés`);

    // Import des événements
    console.log("🎫 Import des événements...");
    for (const event of data.events) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: {
          ...event,
          category: { connect: { id: event.category.id } },
          author: { connect: { id: event.author.id } },
        },
        create: {
          ...event,
          category: { connect: { id: event.category.id } },
          author: { connect: { id: event.author.id } },
        },
      });
    }
    console.log(`✅ ${data.events.length} événements importés`);

    // Import des types de tickets
    console.log("🎟️ Import des types de tickets...");
    for (const ticketType of data.ticketTypes) {
      await prisma.ticketType.upsert({
        where: { id: ticketType.id },
        update: {
          ...ticketType,
          event: { connect: { id: ticketType.event.id } },
        },
        create: {
          ...ticketType,
          event: { connect: { id: ticketType.event.id } },
        },
      });
    }
    console.log(`✅ ${data.ticketTypes.length} types de tickets importés`);

    // Import des commandes
    console.log("🛒 Import des commandes...");
    for (const order of data.orders) {
      await prisma.order.upsert({
        where: { id: order.id },
        update: order,
        create: order,
      });
    }
    console.log(`✅ ${data.orders.length} commandes importées`);

    // Import des tickets
    console.log("🎫 Import des tickets...");
    for (const ticket of data.tickets) {
      await prisma.ticket.upsert({
        where: { id: ticket.id },
        update: {
          ...ticket,
          event: { connect: { id: ticket.event.id } },
          ticketType: { connect: { id: ticket.ticketType.id } },
          order: { connect: { id: ticket.order.id } },
        },
        create: {
          ...ticket,
          event: { connect: { id: ticket.event.id } },
          ticketType: { connect: { id: ticket.ticketType.id } },
          order: { connect: { id: ticket.order.id } },
        },
      });
    }
    console.log(`✅ ${data.tickets.length} tickets importés`);

    // Import des paramètres
    console.log("⚙️ Import des paramètres...");
    for (const setting of data.settings) {
      await prisma.setting.upsert({
        where: { id: setting.id },
        update: setting,
        create: setting,
      });
    }
    console.log(`✅ ${data.settings.length} paramètres importés`);

    // Import des rapports
    console.log("📊 Import des rapports...");
    for (const report of data.reports) {
      await prisma.report.upsert({
        where: { id: report.id },
        update: {
          ...report,
          user: { connect: { id: report.user.id } },
        },
        create: {
          ...report,
          user: { connect: { id: report.user.id } },
        },
      });
    }
    console.log(`✅ ${data.reports.length} rapports importés`);

    console.log("🎉 Import terminé avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();

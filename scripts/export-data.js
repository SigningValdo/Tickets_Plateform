const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log("🔄 Export des données de la base locale...");

    // Export des catégories
    const categories = await prisma.eventCategory.findMany();
    console.log(`✅ ${categories.length} catégories exportées`);

    // Export des utilisateurs
    const users = await prisma.user.findMany();
    console.log(`✅ ${users.length} utilisateurs exportés`);

    // Export des événements
    const events = await prisma.event.findMany({
      include: {
        category: true,
        ticketTypes: true,
        author: true,
      },
    });
    console.log(`✅ ${events.length} événements exportés`);

    // Export des types de tickets
    const ticketTypes = await prisma.ticketType.findMany({
      include: {
        event: true,
      },
    });
    console.log(`✅ ${ticketTypes.length} types de tickets exportés`);

    // Export des commandes
    const orders = await prisma.order.findMany({
      include: {
        tickets: {
          include: {
            event: true,
            ticketType: true,
          },
        },
      },
    });
    console.log(`✅ ${orders.length} commandes exportées`);

    // Export des tickets
    const tickets = await prisma.ticket.findMany({
      include: {
        event: true,
        ticketType: true,
        order: true,
      },
    });
    console.log(`✅ ${tickets.length} tickets exportés`);

    // Export des paramètres
    const settings = await prisma.setting.findMany();
    console.log(`✅ ${settings.length} paramètres exportés`);

    // Export des rapports
    const reports = await prisma.report.findMany({
      include: {
        user: true,
      },
    });
    console.log(`✅ ${reports.length} rapports exportés`);

    // Créer l'objet de données complet
    const data = {
      categories,
      users,
      events,
      ticketTypes,
      orders,
      tickets,
      settings,
      reports,
      exportedAt: new Date().toISOString(),
    };

    // Sauvegarder dans un fichier JSON
    const exportPath = path.join(__dirname, "..", "data-export.json");
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));

    console.log(`✅ Données exportées vers: ${exportPath}`);
    console.log("📊 Résumé de l'export:");
    console.log(`   - Catégories: ${categories.length}`);
    console.log(`   - Utilisateurs: ${users.length}`);
    console.log(`   - Événements: ${events.length}`);
    console.log(`   - Types de tickets: ${ticketTypes.length}`);
    console.log(`   - Commandes: ${orders.length}`);
    console.log(`   - Tickets: ${tickets.length}`);
    console.log(`   - Paramètres: ${settings.length}`);
    console.log(`   - Rapports: ${reports.length}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();

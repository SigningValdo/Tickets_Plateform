const { PrismaClient } = require("@prisma/client");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isLocalUploadUrl(url) {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/uploads/");
}

async function uploadLocalFileToCloudinary(localUrl) {
  const filePath = path.join(process.cwd(), "public", localUrl);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Fichier introuvable: ${filePath} (ignoré)`);
    return null;
  }
  const folder = process.env.CLOUDINARY_FOLDER || "tickets-platform";
  const res = await cloudinary.uploader.upload(filePath, { folder });
  return res.secure_url;
}

async function migrateEvents() {
  const events = await prisma.event.findMany({
    select: { id: true, imageUrl: true },
  });
  let migrated = 0;
  for (const ev of events) {
    if (!isLocalUploadUrl(ev.imageUrl)) continue;
    const secureUrl = await uploadLocalFileToCloudinary(ev.imageUrl);
    if (!secureUrl) continue;
    await prisma.event.update({
      where: { id: ev.id },
      data: { imageUrl: secureUrl },
    });
    migrated++;
  }
  console.log(`✅ Événements mis à jour: ${migrated}`);
}

async function migrateUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, image: true },
  });
  let migrated = 0;
  for (const u of users) {
    if (!u.image || !isLocalUploadUrl(u.image)) continue;
    const secureUrl = await uploadLocalFileToCloudinary(u.image);
    if (!secureUrl) continue;
    await prisma.user.update({
      where: { id: u.id },
      data: { image: secureUrl },
    });
    migrated++;
  }
  console.log(`✅ Utilisateurs mis à jour: ${migrated}`);
}

async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Variables Cloudinary manquantes (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)"
    );
  }

  console.log("🚚 Migration des images locales (/uploads) vers Cloudinary...");
  await migrateEvents();
  await migrateUsers();
  console.log("🎉 Migration terminée");
}

main()
  .catch((e) => {
    console.error("❌ Erreur de migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# 🚀 Guide de Déploiement - FANZONE TICKETS

## 📋 Prérequis

- Compte Vercel (gratuit)
- Compte PlanetScale (gratuit) ou Supabase (gratuit)
- Données exportées (déjà fait ✅)

## 🗄️ Option 1: PlanetScale (Recommandé)

### 1. Créer la base de données PlanetScale

1. Allez sur [planetscale.com](https://planetscale.com)
2. Créez un compte gratuit
3. Créez une nouvelle base de données "fanzone-tickets"
4. Dans le dashboard, cliquez sur "Connect" → "Prisma"
5. Copiez la connection string

### 2. Configurer le schéma Prisma pour MySQL

```bash
# Modifier le schéma pour MySQL
sed -i '' 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma
echo '  relationMode = "prisma"' >> prisma/schema.prisma
```

### 3. Mettre à jour les variables d'environnement

```bash
# Créer .env.production
echo 'DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"' > .env.production
echo 'NEXTAUTH_URL="https://your-domain.vercel.app"' >> .env.production
echo 'NEXTAUTH_SECRET="your-secret-key-here"' >> .env.production
```

### 4. Déployer le schéma

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers PlanetScale
npx prisma db push

# Importer les données
DATABASE_URL="mysql://..." node scripts/import-data.js
```

## 🗄️ Option 2: Supabase (Alternative)

### 1. Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans Settings → Database
4. Copiez la connection string PostgreSQL

### 2. Configurer pour PostgreSQL

```bash
# Modifier le schéma pour PostgreSQL
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
```

### 3. Déployer

```bash
npx prisma generate
npx prisma db push
DATABASE_URL="postgresql://..." node scripts/import-data.js
```

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login
```

### 2. Configurer les variables d'environnement

Dans le dashboard Vercel :

- `DATABASE_URL` : Votre connection string de production
- `NEXTAUTH_URL` : https://your-domain.vercel.app
- `NEXTAUTH_SECRET` : Une clé secrète forte

### 3. Déployer

```bash
# Déployer
vercel --prod

# Ou via Git
git add .
git commit -m "Deploy to production"
git push origin main
```

## 📊 Migration des données

### Export (déjà fait ✅)

```bash
# Les données sont déjà exportées dans data-export.json
ls -la data-export.json
```

### Import vers la nouvelle base

```bash
# Pour PlanetScale
DATABASE_URL="mysql://..." node scripts/import-data.js

# Pour Supabase
DATABASE_URL="postgresql://..." node scripts/import-data.js
```

## 🔧 Scripts disponibles

```bash
# Export des données locales
yarn export-data

# Import vers la base de production
yarn import-data

# Déployer le schéma
yarn db:push

# Générer le client Prisma
yarn postinstall
```

## 🎯 Étapes de déploiement rapide

1. **Choisir une base de données** (PlanetScale recommandé)
2. **Créer le compte et la base**
3. **Obtenir la connection string**
4. **Modifier le schéma Prisma** pour la base choisie
5. **Configurer les variables d'environnement**
6. **Déployer le schéma** (`npx prisma db push`)
7. **Importer les données** (`node scripts/import-data.js`)
8. **Déployer sur Vercel**

## 🆘 Dépannage

### Erreur de connection

- Vérifiez la connection string
- Assurez-vous que la base de données est accessible
- Vérifiez les paramètres SSL

### Erreur de schéma

- Régénérez le client Prisma : `npx prisma generate`
- Vérifiez que le schéma correspond à la base de données

### Données manquantes

- Vérifiez que l'export s'est bien passé
- Relancez l'import avec les bonnes variables d'environnement

## 📞 Support

- Documentation Prisma : https://prisma.io/docs
- Documentation Vercel : https://vercel.com/docs
- Documentation PlanetScale : https://planetscale.com/docs
- Documentation Supabase : https://supabase.com/docs

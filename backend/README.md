# 🎫 Plateforme de Billetterie - Backend

Une API REST complète pour une plateforme de billetterie d'événements construite avec Node.js, Express et Sequelize.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Base de données](#-base-de-données)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)

## 🚀 Fonctionnalités

### Authentification et Autorisation
- ✅ Inscription et connexion utilisateur
- ✅ Authentification JWT avec refresh tokens
- ✅ Vérification email obligatoire
- ✅ Réinitialisation de mot de passe
- ✅ Gestion des rôles (User, Organizer, Admin)
- ✅ Middleware de protection des routes

### Gestion des Utilisateurs
- ✅ Profils utilisateur complets
- ✅ Upload et gestion d'avatars
- ✅ Historique des commandes et billets
- ✅ Statistiques utilisateur
- ✅ Désactivation de compte

### Gestion des Événements
- ✅ CRUD complet des événements
- ✅ Upload d'images d'événements
- ✅ Gestion des types de billets
- ✅ Système de publication/brouillon
- ✅ Statistiques détaillées
- ✅ Filtrage et recherche avancés

### Système de Commandes
- ✅ Création et gestion des commandes
- ✅ Application de codes de réduction
- ✅ Intégration Stripe pour les paiements
- ✅ Gestion des remboursements
- ✅ Historique complet des transactions

### Gestion des Billets
- ✅ Génération automatique de QR codes
- ✅ Validation et scan des billets
- ✅ Transfert de billets entre utilisateurs
- ✅ Annulation avec remboursement
- ✅ Envoi par email

### Fonctionnalités Avancées
- ✅ Système de notifications email
- ✅ Rate limiting et sécurité
- ✅ Logging complet
- ✅ Gestion des fichiers et images
- ✅ Webhooks Stripe
- ✅ Export de données (CSV/JSON)

## 🛠 Technologies

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de données**: PostgreSQL
- **ORM**: Sequelize
- **Authentification**: JWT
- **Paiements**: Stripe
- **Email**: Nodemailer
- **Upload**: Multer + Sharp
- **Validation**: Express-validator
- **Sécurité**: Helmet, CORS, Rate limiting
- **Logging**: Winston
- **Tests**: Jest + Supertest

## 📋 Prérequis

- Node.js 18.0.0 ou supérieur
- PostgreSQL 12.0 ou supérieur
- npm ou yarn
- Compte Stripe (pour les paiements)
- Service email (Gmail, SendGrid, etc.)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

```bash
# Créer la base de données PostgreSQL
psql -U postgres
CREATE DATABASE ticketing_platform;
\q
```

### 4. Configuration de l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos configurations
nano .env
```

### 5. Initialiser la base de données

```bash
# Exécuter les migrations
npm run db:migrate

# (Optionnel) Charger les données de test
npm run db:seed
```

### 6. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## ⚙️ Configuration

### Variables d'environnement essentielles

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticketing_platform
DB_USERNAME=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
```

Voir `.env.example` pour la configuration complète.

## 🎯 Utilisation

### Scripts disponibles

```bash
# Développement
npm run dev          # Démarrer avec nodemon
npm run start        # Démarrer en production

# Base de données
npm run db:migrate   # Exécuter les migrations
npm run db:seed      # Charger les données de test
npm run db:reset     # Reset complet de la DB

# Tests
npm test             # Exécuter les tests
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture

# Qualité du code
npm run lint         # Vérifier le code
npm run format       # Formater le code

# Utilitaires
npm run logs         # Voir les logs
npm run clean        # Nettoyer les fichiers temporaires
```

### Endpoints principaux

```
POST   /api/auth/register     # Inscription
POST   /api/auth/login        # Connexion
GET    /api/events            # Liste des événements
POST   /api/events            # Créer un événement
POST   /api/orders            # Créer une commande
GET    /api/tickets/:id       # Détails d'un billet
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Configuration Sequelize
│   │   └── stripe.js           # Configuration Stripe
│   ├── controllers/
│   │   ├── authController.js   # Authentification
│   │   ├── userController.js   # Gestion utilisateurs
│   │   ├── eventController.js  # Gestion événements
│   │   ├── orderController.js  # Gestion commandes
│   │   ├── ticketController.js # Gestion billets
│   │   └── paymentController.js # Gestion paiements
│   ├── middleware/
│   │   ├── auth.js            # Authentification JWT
│   │   ├── upload.js          # Upload de fichiers
│   │   ├── rateLimiter.js     # Limitation de taux
│   │   └── errorHandler.js    # Gestion d'erreurs
│   ├── models/
│   │   ├── index.js           # Configuration Sequelize
│   │   ├── User.js            # Modèle utilisateur
│   │   ├── Event.js           # Modèle événement
│   │   ├── Order.js           # Modèle commande
│   │   ├── Ticket.js          # Modèle billet
│   │   ├── Payment.js         # Modèle paiement
│   │   └── TicketType.js      # Modèle type de billet
│   ├── routes/
│   │   ├── auth.js            # Routes authentification
│   │   ├── users.js           # Routes utilisateurs
│   │   ├── events.js          # Routes événements
│   │   ├── orders.js          # Routes commandes
│   │   ├── tickets.js         # Routes billets
│   │   └── payments.js        # Routes paiements
│   ├── utils/
│   │   ├── email.js           # Utilitaires email
│   │   ├── fileSystem.js      # Gestion fichiers
│   │   ├── payment.js         # Utilitaires Stripe
│   │   └── validation.js      # Validation des données
│   ├── migrations/            # Migrations Sequelize
│   ├── seeders/              # Données de test
│   ├── app.js                # Configuration Express
│   └── server.js             # Point d'entrée
├── uploads/                  # Fichiers uploadés
├── logs/                     # Fichiers de logs
├── tests/                    # Tests unitaires
├── .env.example             # Variables d'environnement
├── .sequelizerc             # Configuration Sequelize
├── package.json             # Dépendances et scripts
└── README.md               # Documentation
```

## 📚 API Documentation

### Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

### Codes de statut

- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `429` - Trop de requêtes
- `500` - Erreur serveur

### Pagination

Les listes utilisent la pagination :

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🗄️ Base de données

### Modèles principaux

- **User** : Utilisateurs de la plateforme
- **Event** : Événements organisés
- **TicketType** : Types de billets par événement
- **Order** : Commandes passées
- **Ticket** : Billets individuels
- **Payment** : Transactions de paiement

### Relations

- User → Orders (1:N)
- User → Tickets (1:N)
- Event → TicketTypes (1:N)
- Event → Orders (1:N)
- Order → Tickets (1:N)
- Order → Payment (1:1)

### Migrations

```bash
# Créer une nouvelle migration
npx sequelize-cli migration:generate --name create-table-name

# Exécuter les migrations
npm run db:migrate

# Annuler la dernière migration
npx sequelize-cli db:migrate:undo
```

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests d'un fichier spécifique
npm test -- auth.test.js
```

### Structure des tests

```
tests/
├── unit/
│   ├── controllers/
│   ├── models/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   ├── events.test.js
│   └── orders.test.js
└── helpers/
    ├── setup.js
    └── factories.js
```

## 🚀 Déploiement

### Variables d'environnement production

```env
NODE_ENV=production
PORT=5000
DB_SSL=true
JWT_SECRET=<strong-secret>
STRIPE_SECRET_KEY=sk_live_...
```

### Docker

```dockerfile
# Dockerfile exemple
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Certificats SSL configurés
- [ ] Monitoring configuré
- [ ] Sauvegardes automatiques
- [ ] Rate limiting activé
- [ ] Logs configurés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- Utiliser ESLint et Prettier
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles API
- Suivre les conventions de nommage

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour obtenir de l'aide :

1. Consulter la documentation
2. Vérifier les issues existantes
3. Créer une nouvelle issue avec le template approprié

## 🔄 Changelog

Voir `CHANGELOG.md` pour l'historique des versions.

---

**Développé avec ❤️ pour la communauté des organisateurs d'événements**# EvenTicket

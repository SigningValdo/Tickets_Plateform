# FANZONE TICKETS - Guide d'utilisation complet

## Table des matières

1. [Introduction](#1-introduction)
2. [Guide Utilisateur](#2-guide-utilisateur)
   - [Créer un compte](#21-créer-un-compte)
   - [Se connecter](#22-se-connecter)
   - [Mot de passe oublié](#23-mot-de-passe-oublié)
   - [Parcourir les événements](#24-parcourir-les-événements)
   - [Acheter un billet](#25-acheter-un-billet)
   - [Tableau de bord utilisateur](#26-tableau-de-bord-utilisateur)
   - [Gérer ses billets](#27-gérer-ses-billets)
   - [Modifier son profil](#28-modifier-son-profil)
   - [Paramètres du compte](#29-paramètres-du-compte)
3. [Guide Administrateur](#3-guide-administrateur)
   - [Tableau de bord administrateur](#31-tableau-de-bord-administrateur)
   - [Gestion des événements](#32-gestion-des-événements)
   - [Gestion des billets](#33-gestion-des-billets)
   - [Gestion des utilisateurs](#34-gestion-des-utilisateurs)
   - [Gestion des catégories](#35-gestion-des-catégories)
   - [Rapports et analyses](#36-rapports-et-analyses)
   - [Paramètres de la plateforme](#37-paramètres-de-la-plateforme)
4. [Informations pratiques](#4-informations-pratiques)

---

## 1. Introduction

**FANZONE TICKETS** est une plateforme de billetterie en ligne camerounaise permettant aux utilisateurs d'acheter des billets pour divers événements (concerts, conférences, festivals, théâtre, etc.) et aux administrateurs de gérer l'ensemble de la plateforme.

**Accès à la plateforme :** Ouvrez votre navigateur et rendez-vous sur l'adresse de la plateforme.

---

## 2. Guide Utilisateur

### 2.1 Créer un compte

1. Depuis la page d'accueil, cliquez sur le bouton **"S'inscrire"** en haut à droite de la page.
2. Remplissez le formulaire d'inscription :
   - **Prénom** (obligatoire)
   - **Nom** (obligatoire)
   - **Email** (obligatoire) — doit être une adresse email valide
   - **Mot de passe** (obligatoire) — 6 caractères minimum
   - **Confirmer le mot de passe** — doit correspondre au mot de passe
3. Cochez la case **"J'accepte les conditions d'utilisation et la politique de confidentialité"**.
4. Cliquez sur **"S'inscrire"**.
5. Si l'inscription réussit, vous serez redirigé vers la page de connexion avec un message de confirmation.

> **Note :** Si l'adresse email est déjà utilisée, un message d'erreur s'affichera.

---

### 2.2 Se connecter

1. Cliquez sur **"Connexion"** en haut à droite de la page, ou rendez-vous sur `/auth/login`.
2. Entrez votre **email** et votre **mot de passe**.
3. Cliquez sur **"Se connecter"**.
4. Après connexion :
   - Si vous êtes un **utilisateur**, vous serez redirigé vers votre **tableau de bord** (`/account`).
   - Si vous êtes un **administrateur**, vous serez redirigé vers le **tableau de bord administrateur** (`/admin/dashboard`).

> **Astuce :** Vous pouvez afficher/masquer votre mot de passe en cliquant sur l'icône en forme d'oeil à côté du champ.

---

### 2.3 Mot de passe oublié

1. Sur la page de connexion, cliquez sur **"Mot de passe oublié ?"**.
2. Entrez votre **adresse email** associée à votre compte.
3. Cliquez sur **"Envoyer le lien de réinitialisation"**.
4. Consultez votre boîte email (vérifiez aussi les spams).
5. Cliquez sur le lien dans l'email pour accéder à la page de réinitialisation.
6. Entrez votre **nouveau mot de passe** et confirmez-le.
   - Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
7. Cliquez sur **"Réinitialiser le mot de passe"**.
8. Vous serez automatiquement redirigé vers la page de connexion.

---

### 2.4 Parcourir les événements

#### Page d'accueil

La page d'accueil vous présente :
- Un **carrousel** avec les événements à la une (défilement automatique).
- Les **catégories d'événements** pour naviguer rapidement.
- Les **événements mis en avant** et les **événements à venir**.
- Un **bouton de recherche** pour trouver un événement spécifique.

#### Page des événements (`/events`)

1. Accédez à la page depuis le menu **"Événements"** ou via le lien **"Voir tout"** sur la page d'accueil.
2. Utilisez les **filtres** sur la gauche pour affiner votre recherche :
   - **Catégorie** : Concerts, Théâtre, Conférences, Gastronomie, Spectacles, Cinéma, Ateliers, Festivals
   - **Date** : Toutes les dates, Aujourd'hui, Ce weekend, Ce mois, Date spécifique
   - **Lieu** : Sélectionnez une ville (Abidjan, Dakar, Lomé, Rabat, Douala, Bamako, Tunis)
3. Cliquez sur **"Réinitialiser"** pour effacer tous les filtres.
4. Cliquez sur **"Voir les détails"** pour accéder à la page détaillée d'un événement.

#### Page de détail d'un événement (`/events/[id]`)

La page de détail affiche :
- L'**image de l'événement** en pleine largeur avec un compteur de temps restant.
- Trois onglets :
  - **Détails** : Description complète, date, lieu, organisateur.
  - **Lieu** : Adresse et carte interactive.
  - **Organisateur** : Informations sur l'organisateur.
- Sur la droite, le **bloc de réservation** avec :
  - Les différents types de billets disponibles (nom, prix, quantité restante).
  - Des boutons **+** et **-** pour sélectionner la quantité.
  - Le **total** (nombre de billets et montant).
  - Le bouton **"Procéder au paiement"**.

---

### 2.5 Acheter un billet

1. Sur la page de détail d'un événement, sélectionnez le nombre de billets souhaité pour chaque type en utilisant les boutons **+** et **-**.
2. Cliquez sur **"Procéder au paiement"**.
3. Un formulaire s'affiche pour saisir vos informations :
   - **Nom complet** (obligatoire, 2 caractères minimum)
   - **Email** (obligatoire, format valide)
   - **Téléphone** (obligatoire, 9 caractères minimum, ex: +237 6XX XXX XXX)
   - **Adresse** (obligatoire, 3 caractères minimum)
4. Cliquez sur **"Procéder au paiement"**.
5. Vous serez redirigé vers la plateforme de paiement **Notchpay** pour effectuer le paiement de manière sécurisée.
6. Après le paiement, vous serez redirigé vers la **page de confirmation**.

#### Page de confirmation

Après un paiement réussi, vous verrez :
- Un message de **"Paiement confirmé !"** avec une coche verte.
- Votre **billet électronique** contenant :
  - Le numéro de référence du billet.
  - Le titre de l'événement, la date, l'heure et le lieu.
  - Les informations du billet (type, numéro, date d'achat).
  - Un **QR code** à présenter à l'entrée de l'événement.
- Un bouton **"Télécharger le billet"** pour sauvegarder votre billet en PDF.
- Un bouton **"Partager le billet"** pour envoyer le billet à un tiers.
- Un lien **"Voir tous mes billets"** pour accéder à votre espace billets.

> **Important :** Vous recevrez également une copie de votre billet par email.

---

### 2.6 Tableau de bord utilisateur

Après connexion, votre tableau de bord (`/account`) affiche :

#### Statistiques en un coup d'oeil

4 cartes de statistiques :
- **Total billets** : Le nombre total de billets achetés, avec le nombre de billets valides.
- **Événements à venir** : Le nombre d'événements à venir pour lesquels vous avez des billets.
- **Total dépensé** : Le montant total dépensé en FCFA sur l'ensemble de vos billets.
- **Billets valides** : Le nombre de billets prêts à utiliser.

#### Événements à venir

Une liste de vos prochains événements (maximum 3) avec :
- L'image de l'événement.
- Le type de billet acheté.
- Le titre, la date, l'heure et le lieu.
- Un bouton **"Voir le billet"** pour accéder au détail du billet.

#### Actions rapides

3 raccourcis :
- **Découvrir les événements** — accède à la liste des événements.
- **Mes billets** — accède à la liste de vos billets.
- **Mon profil** — accède à votre profil.

#### Navigation de l'espace utilisateur

Le menu latéral (barre de navigation à gauche sur ordinateur, menu hamburger sur mobile) contient :
- **Tableau de bord** — la page d'accueil de votre espace.
- **Mes billets** — la liste de tous vos billets.
- **Événements** — parcourir les événements disponibles.
- **Mon profil** — modifier vos informations personnelles.
- **Paramètres** — gérer vos préférences et la sécurité.
- **Déconnexion** — se déconnecter de votre compte.

---

### 2.7 Gérer ses billets

#### Liste des billets (`/account/tickets`)

1. Accédez à **"Mes billets"** depuis le menu latéral.
2. Utilisez la **barre de recherche** pour retrouver un billet spécifique.
3. Deux onglets sont disponibles :
   - **À venir** : Affiche les billets pour les événements futurs.
   - **Passés** : Affiche les billets pour les événements terminés (en grisé).
4. Chaque billet affiche :
   - L'image de l'événement et le type de billet.
   - Le titre, la date, l'heure et le lieu de l'événement.
   - Le numéro du billet et son **statut** :
     - 🟢 **Valide** — le billet est prêt à être utilisé.
     - 🔵 **Utilisé** — le billet a été scanné à l'entrée.
     - 🔴 **Annulé** — le billet a été annulé.
   - Le prix en FCFA.
   - Un bouton **"Voir le billet"** pour accéder au détail.

#### Détail d'un billet (`/account/tickets/[id]`)

La page de détail d'un billet affiche :
- Le **numéro de référence** et le **statut** du billet.
- Les informations complètes :
  - Titre de l'événement.
  - Date, heure et lieu.
  - Type de billet, numéro, nom du titulaire, date d'achat, prix, organisateur.
- Le **QR code** à présenter à l'entrée.
- Boutons d'action :
  - **Télécharger le billet** — sauvegarde en PDF.
  - **Partager le billet** — partagez le billet.
  - **Annuler le billet** — uniquement disponible si le billet est valide ET l'événement est à venir.

#### Annuler un billet

1. Sur la page de détail du billet, cliquez sur **"Annuler ce billet"** (bouton rouge en bas).
2. Une boîte de dialogue de confirmation s'affiche :
   - **"Annuler ce billet ?"** — Cette action est irréversible.
3. Cliquez sur **"Oui, annuler le billet"** pour confirmer, ou **"Non, garder le billet"** pour annuler l'opération.

> **Attention :** L'annulation est **irréversible**. Le billet ne pourra plus être utilisé.

#### Informations importantes affichées sur chaque billet

- Présentez ce billet à l'entrée de l'événement.
- Une pièce d'identité peut être demandée.
- Arrivez au moins **30 minutes** avant le début de l'événement.
- Ce billet est personnel et ne peut pas être revendu.

---

### 2.8 Modifier son profil

1. Accédez à **"Mon profil"** depuis le menu latéral.
2. Votre profil s'affiche avec votre avatar (initiales), votre nom et votre email.

#### Onglet "Profil" — Informations personnelles

- Modifiez votre **nom complet**.
- L'**email** ne peut pas être modifié (affiché en lecture seule).
- Cliquez sur **"Mettre à jour"** pour sauvegarder les modifications.

#### Onglet "Sécurité" — Changer le mot de passe

1. Entrez votre **mot de passe actuel**.
2. Entrez votre **nouveau mot de passe** (6 caractères minimum).
3. **Confirmez** le nouveau mot de passe.
4. Cliquez sur **"Changer le mot de passe"**.

#### Onglet "Notifications" — Préférences de notification

Activez ou désactivez les notifications suivantes :
- **Notifications par email** — Recevoir des emails sur vos billets et événements.
- **Notifications par SMS** — Recevoir des SMS pour les mises à jour importantes.
- **Rappels d'événements** — Recevoir des rappels avant vos événements.
- **Emails marketing** — Recevoir des offres spéciales et recommandations.

---

### 2.9 Paramètres du compte

Accédez à **"Paramètres"** depuis le menu latéral.

#### Notifications

Gérez les mêmes préférences de notification que dans l'onglet Profil :
- Notifications par email
- Notifications par SMS
- Rappels d'événements
- Emails marketing

#### Sécurité & Compte

- **Changer le mot de passe** — Redirige vers la page de profil pour modifier le mot de passe.
- **Informations du compte** — Affiche votre email et un lien vers votre profil.

#### Zone dangereuse

- **Déconnexion** — Vous déconnecte de votre compte. Vous devrez vous reconnecter pour accéder à votre espace.

---

## 3. Guide Administrateur

> **Accès :** Seuls les utilisateurs ayant le rôle **ADMIN** peuvent accéder à l'espace administrateur. Après connexion, vous êtes automatiquement redirigé vers `/admin/dashboard`.

### 3.1 Tableau de bord administrateur

Le tableau de bord (`/admin/dashboard`) offre une vue d'ensemble de l'activité de la plateforme.

#### Statistiques principales

4 cartes affichent les indicateurs clés :
- **Ventes totales** — Montant total des ventes en FCFA avec la tendance mensuelle (ex: +12.5% ce mois).
- **Billets vendus** — Nombre total de billets vendus avec la tendance.
- **Événements actifs** — Nombre d'événements actuellement actifs.
- **Utilisateurs** — Nombre total d'utilisateurs inscrits avec la tendance.

#### Graphiques

- **Ventes des 30 derniers jours** — Un graphique en barres/lignes montrant l'évolution des ventes sur les 30 derniers jours.
- **Ventes par catégorie** — Des barres de progression montrant la répartition des ventes par catégorie (Concerts, Conférences, Festivals, Théâtre, Autres).

#### Navigation

Le menu latéral (identique à celui de l'utilisateur, mais avec des options supplémentaires) :
- **Tableau de bord** — Page d'accueil de l'administration.
- **Événements** — Gérer les événements.
- **Billets** — Gérer les billets.
- **Utilisateurs** — Gérer les utilisateurs.
- **Rapports** — Voir les rapports et analyses.
- **Catégories** — Gérer les catégories d'événements.
- **Paramètres** — Configurer la plateforme.
- **Déconnexion** — Se déconnecter.

---

### 3.2 Gestion des événements

#### Liste des événements (`/admin/events`)

1. Accédez à **"Événements"** depuis le menu latéral.
2. La page affiche la liste de tous les événements avec :
   - Des **filtres** : par catégorie, par date.
   - Des **onglets** : Tous, Actifs, À venir, Passés.
   - Un bouton **"Créer un événement"** en haut à droite.
3. Chaque événement affiche ses informations principales et permet :
   - De **voir les détails**.
   - De **modifier** l'événement.
   - De **supprimer** l'événement.
4. La pagination en bas de page permet de naviguer entre les pages.

#### Créer un événement (`/admin/events/create`)

1. Cliquez sur **"Créer un événement"**.
2. Remplissez les sections du formulaire :

**Informations de l'événement :**
- **Titre** (obligatoire, 3 caractères minimum) — Ex: "Concert de Rock"
- **Description** (obligatoire, 10 caractères minimum) — Décrivez l'événement en détail.
- **Date** (obligatoire) — Sélectionnez via le calendrier. Les dates passées sont désactivées.
- **Lieu** (obligatoire, 3 caractères minimum) — Ex: "Le Zénith, Paris"

**Adresse :**
- **Adresse complète** (obligatoire)
- **Ville** (obligatoire)
- **Pays** (obligatoire)
- **Organisateur** (obligatoire)

**Catégorie :**
- Sélectionnez une catégorie dans la liste déroulante.

**Image de l'événement :**
- Cliquez sur **"Parcourir"** pour uploader une image depuis votre ordinateur.
- L'image est automatiquement uploadée et un aperçu s'affiche.
- Vous pouvez aussi saisir une URL d'image manuellement.

**Types de billets :**
- Au moins **1 type de billet** est requis.
- Pour chaque type, renseignez :
  - **Nom** — Ex: "VIP", "Standard", "Early Bird"
  - **Prix** (en FCFA)
  - **Quantité** disponible
- Cliquez sur **"Ajouter un type de ticket"** pour ajouter d'autres types.
- Cliquez sur l'icône **poubelle** pour supprimer un type (sauf s'il n'en reste qu'un).

3. Cliquez sur **"Créer l'événement"** pour publier.
4. Vous serez redirigé vers la liste des événements.

#### Modifier un événement (`/admin/events/[id]/edit`)

1. Depuis la liste des événements, cliquez sur **"Modifier"** sur l'événement souhaité.
2. Le formulaire est pré-rempli avec les données existantes.
3. Vous pouvez modifier toutes les sections :
   - **Informations générales** : Titre, date, heure, catégorie, statut (À venir, Actif, Passé), description.
   - **Lieu de l'événement** : Nom du lieu, capacité maximale, adresse, ville, pays.
   - **Types de billets** : Modifier, ajouter ou supprimer des types de billets.
   - **Image** : Changer l'image ou l'URL.
4. Cliquez sur **"Sauvegarder les modifications"**.

#### Détails d'un événement (`/admin/events/[id]`)

La page de détails affiche :
- L'image de l'événement.
- Le titre et les métadonnées (date, lieu, catégorie, nombre total de billets).
- Le statut de l'événement (badge : "Passé" ou "À venir").
- La description complète.
- L'adresse, la ville, le pays et l'organisateur.
- Un tableau des **types de billets** avec le nom, le prix (FCFA) et la quantité.
- Un bouton **"Modifier"** pour accéder à l'édition.

---

### 3.3 Gestion des billets

#### Liste des billets (`/admin/tickets`)

1. Accédez à **"Billets"** depuis le menu latéral.
2. La page affiche tous les billets vendus avec :
   - Des **filtres** : par événement, type de billet, statut.
   - Un **champ de recherche** par QR code.
   - Des **onglets** : Tous, Valides, Utilisés, Annulés.
   - Un bouton **"Exporter les données"** en haut à droite.
3. Le tableau affiche pour chaque billet :
   - **ID Billet** — identifiant unique.
   - **Événement** — titre de l'événement.
   - **Client** — identifiant de l'acheteur.
   - **Date d'achat** — date formatée.
   - **Type** — nom du type de billet.
   - **Prix** — montant en FCFA.
   - **Statut** — liste déroulante permettant de **changer le statut directement** :
     - 🟢 Valide (VALID)
     - 🔵 Utilisé (USED)
     - 🔴 Invalide (INVALID)
   - **Actions** — menu déroulant :
     - Voir les détails.
     - Modifier.
     - Supprimer (avec confirmation).

#### Créer un billet manuellement (`/admin/tickets/create`)

Cette fonctionnalité permet de créer des billets sans passer par le processus d'achat classique.

1. Sélectionnez un **événement** dans la liste déroulante.
2. Sélectionnez un **type de billet** (la liste se met à jour automatiquement selon l'événement).
3. Indiquez la **quantité**.
4. Sélectionnez l'**utilisateur** qui recevra le billet.
5. Définissez le **statut du billet** : En attente, Confirmé, Annulé, Utilisé.
6. Définissez le **statut de paiement** : En attente, Payé, Remboursé, Échoué.
7. Choisissez la **méthode de paiement** : Carte bancaire, Mobile Money, Espèces, Virement bancaire, Gratuit.
8. Ajoutez des **notes** si nécessaire.
9. Cochez ou décochez **"Envoyer un email de confirmation"**.
10. Cliquez sur **"Créer le ticket"**.

> **Note :** Le prix unitaire et le prix total sont calculés et affichés automatiquement.

#### Détail d'un billet (`/admin/tickets/[id]`)

La page de détails affiche :
- Le **QR code** du billet avec possibilité de le copier.
- Le **statut** du billet.
- Les **informations détaillées** : événement, type, commande, nom, email, téléphone, adresse, dates.
- Un **aperçu du billet** prêt pour la génération PDF.
- Un bouton **"Télécharger le billet (PDF)"** qui génère un PDF contenant :
  - L'en-tête FANZONE TICKETS avec les emblèmes.
  - L'image de l'événement.
  - Le titre et le type de billet.
  - Le QR code.
  - Le pied de page avec les informations de référence.

#### Scanner un billet (API)

L'API de scan permet de valider un billet à l'entrée d'un événement :
1. Scannez le **QR code** du billet.
2. Le système vérifie si le billet est valide.
3. Si le billet est valide, son statut passe automatiquement à **"Utilisé"**.
4. Si le billet a déjà été utilisé, un message d'erreur s'affiche : *"Le ticket a déjà été utilisé"*.
5. Si le QR code est invalide, un message d'erreur s'affiche.

---

### 3.4 Gestion des utilisateurs

#### Liste des utilisateurs (`/admin/users`)

1. Accédez à **"Utilisateurs"** depuis le menu latéral.
2. La page affiche tous les utilisateurs avec :
   - Des **filtres** : par rôle (Administrateur, Utilisateur), par statut (Actif, Inactif, Banni).
   - Des **onglets** : Tous, Actifs, Inactifs, Bannis.
   - Un bouton **"Exporter"** et un bouton **"Ajouter un utilisateur"**.
3. Le tableau affiche pour chaque utilisateur :
   - **Avatar et nom** — avec les initiales colorées.
   - **Email** — avec un badge "Vérifié" si applicable.
   - **Rôle** — badge "Administrateur" (violet) ou "Utilisateur".
   - **Date d'inscription** — au format DD/MM/YYYY HH:MM.
   - **Nombre de billets** — badge avec le compteur.
   - **Statut** :
     - 🟢 **Actif** — le compte est fonctionnel.
     - 🟡 **Inactif** — le compte est désactivé.
     - 🔴 **Banni** — le compte est bloqué.
   - **Actions** (menu déroulant) :
     - Modifier.
     - Activer / Désactiver / Bannir / Débannir (selon le statut actuel).
     - Supprimer (texte rouge).

#### Créer un utilisateur (`/admin/users/create`)

1. Cliquez sur **"Ajouter un utilisateur"**.
2. Remplissez le formulaire :
   - **Nom** (obligatoire).
   - **Email** (obligatoire, format valide, doit être unique).
   - **Statut du compte** : Actif, Inactif, Banni.
   - **Mot de passe** (obligatoire, 8 caractères minimum) — avec toggle afficher/masquer.
   - **Confirmer le mot de passe**.
   - **Rôle** : Utilisateur ou Administrateur.
   - **Email vérifié** (case à cocher).
3. Cliquez sur **"Créer l'utilisateur"**.

#### Modifier un utilisateur (`/admin/users/[id]/edit`)

1. Depuis la liste, cliquez sur **"Modifier"** dans le menu d'actions.
2. Le formulaire est pré-rempli. Vous pouvez modifier :
   - **Nom**.
   - **Email**.
   - **Image de profil** (URL).
   - **Rôle** : Utilisateur ou Administrateur.
   - **Compte actif** (case à cocher).
   - **Email vérifié** (case à cocher).
   - **Mot de passe** : Cochez "Modifier le mot de passe" pour changer le mot de passe. Sinon, le mot de passe actuel est conservé.
3. La barre latérale affiche les statistiques : statut du compte et statut de vérification de l'email.
4. Cliquez sur **"Sauvegarder les modifications"**.

#### Supprimer un utilisateur (`/admin/users/[id]/delete`)

1. Depuis la liste, cliquez sur **"Supprimer"** dans le menu d'actions.
2. La page affiche un avertissement en rouge :
   > *"La suppression de cet utilisateur est définitive et irréversible. Toutes les données associées (historique des achats, événements créés, etc.) seront également supprimées."*
3. Les informations de l'utilisateur sont affichées (nom, email, rôle, statut).
4. Les statistiques sont affichées (billets achetés, événements créés, total dépensé).
5. Pour confirmer la suppression, tapez **"SUPPRIMER"** dans le champ de confirmation.
6. Cliquez sur le bouton **"Supprimer"** (le bouton reste désactivé tant que le mot n'est pas saisi).

> **Attention :** Cette action est **irréversible**. Toutes les données de l'utilisateur seront perdues.

---

### 3.5 Gestion des catégories

#### Liste des catégories (`/admin/event-categories`)

1. Accédez à **"Catégories"** depuis le menu latéral.
2. La page affiche toutes les catégories avec :
   - Le **nom** de la catégorie.
   - La **description** (ou "—" si aucune).
   - Les boutons **Modifier** et **Supprimer**.
3. Cliquez sur **"Créer une catégorie"** pour en ajouter une nouvelle.

#### Créer une catégorie (`/admin/event-categories/create`)

1. Cliquez sur **"Créer une catégorie"**.
2. Remplissez le formulaire :
   - **Nom** (obligatoire, 2 caractères minimum) — Ex: "Musique", "Sport", "Conférence"
   - **Couleur** (optionnel) — Sélectionnez une couleur ou entrez un code hexadécimal (ex: `3b82f6`).
   - **Description** (optionnel) — Brève description de la catégorie.
3. Cliquez sur **"Créer la catégorie"**.

> **Note :** Chaque nom de catégorie doit être unique. Si une catégorie avec le même nom existe déjà, une erreur s'affichera.

#### Modifier une catégorie (`/admin/event-categories/[id]/edit`)

1. Depuis la liste, cliquez sur **"Modifier"** à côté de la catégorie.
2. Modifiez le **nom** et/ou la **description**.
3. Cliquez sur **"Enregistrer les modifications"**.
4. Pour **supprimer** la catégorie, cliquez sur le bouton rouge de suppression dans l'en-tête. Une confirmation vous sera demandée.

---

### 3.6 Rapports et analyses

Accédez à **"Rapports"** depuis le menu latéral (`/admin/reports`).

La page affiche :
- Les **statistiques générales** de la plateforme.
- Des graphiques et visualisations de données.
- Une vue d'ensemble des performances.

---

### 3.7 Paramètres de la plateforme

Accédez à **"Paramètres"** depuis le menu latéral (`/admin/settings`).

La page permet de configurer les paramètres globaux de la plateforme. Les paramètres sont organisés par groupes et peuvent être de différents types :
- **Texte** — champs de saisie libre.
- **Nombre** — valeurs numériques.
- **Booléen** — activé/désactivé (interrupteurs).
- **Sélection** — choix parmi une liste d'options.

Les paramètres sont sauvegardés individuellement et appliqués immédiatement.

---

## 4. Informations pratiques

### Contact

- **Email :** fanszonetickets@gmail.com
- **Téléphone :** +237 6 76 76 64 71 / 694 59 30 08
- **Adresse :** Mimboman, DOVV OPEP, Yaoundé, Cameroun

### Moyens de paiement acceptés

- **Mobile Money** : Orange Money, MTN Mobile Money
- **Carte bancaire** : Bientôt disponible

### Sécurité

- Tous les billets sont sécurisés par un **QR code unique**.
- Les paiements sont traités via la plateforme sécurisée **Notchpay**.
- Les mots de passe sont **chiffrés** et jamais stockés en clair.
- Les sessions sont protégées par des **tokens JWT** sécurisés.

### Conseils pour les utilisateurs

- **Gardez votre billet accessible** — Téléchargez-le sur votre téléphone ou imprimez-le.
- **Arrivez en avance** — Prévoyez d'arriver 30 minutes avant le début de l'événement.
- **Protégez votre QR code** — Ne partagez pas votre QR code avec des inconnus.
- **Vérifiez vos emails** — Vos billets et confirmations sont envoyés par email.

### Conseils pour les administrateurs

- **Sauvegardez régulièrement** — Exportez vos données utilisateurs et billets régulièrement.
- **Vérifiez les statuts** — Assurez-vous que les événements passés ont bien le statut "Passé".
- **Scannez les billets** — Utilisez la fonctionnalité de scan QR code pour valider les billets à l'entrée.
- **Gérez les utilisateurs** — Bannissez les comptes suspects et désactivez les comptes inactifs.

---

*FANZONE TICKETS — Solution camerounaise de billetterie en ligne*
*© 2025 FANZONE TICKETS. Tous droits réservés. Made in Cameroun*

# Uber Eats Clone - Guide de démarrage complet

# 🍔 Uber Eats Clone

[![CI Pipeline](https://github.com/Sereir/congenial-octo-system/actions/workflows/ci.yml/badge.svg)](https://github.com/Sereir/congenial-octo-system/actions/workflows/ci.yml)
[![Deploy to Production](https://github.com/Sereir/congenial-octo-system/actions/workflows/deploy.yml/badge.svg)](https://github.com/Sereir/congenial-octo-system/actions/workflows/deploy.yml)

Clone complet d'Uber Eats avec Vue.js 3, Node.js, Express et MongoDB.

## 🚀 Démarrage rapide avec Docker

### Prérequis
- Docker Desktop installé et en cours d'exécution

### Lancer l'application

**Option 1 : Script PowerShell (recommandé sur Windows)**
```powershell
.\start-docker.ps1
```

**Option 2 : Docker Compose**
```powershell
docker-compose up -d --build
```

### Accéder à l'application
- **Frontend** : http://localhost
- **Backend API** : http://localhost:5001/api
- **MongoDB** : localhost:27017

---

## 📦 Stack technique

### Frontend
- Vue.js 3 (Composition API)
- Vuetify 3 (Material Design)
- Vue Router
- Axios
- Vite

### Backend
- Node.js + Express.js
- MongoDB avec Mongoose
- JWT Authentication
- bcryptjs

### DevOps
- Docker & Docker Compose
- Nginx
- Multi-stage builds

---

## 🛠️ Développement local (sans Docker)

## 📋 Prérequis

- Node.js (v18+)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

## 🚀 Installation

### 1. Backend

```powershell
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env (déjà présent)
# Vérifier que MongoDB est démarré

# Peupler la base de données avec des données de test
node seed.js

# Démarrer le serveur backend
npm run dev
```

Le backend sera accessible sur : http://localhost:5000

### 2. Frontend

```powershell
# Retourner à la racine et aller dans vuetify-project
cd ../vuetify-project

# Installer les dépendances (incluant axios)
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : http://localhost:3001

## 📁 Structure du projet

```
test/
├── backend/                    # API Node.js/Express
│   ├── config/
│   │   └── database.js        # Configuration MongoDB
│   ├── models/                # Modèles Mongoose
│   │   ├── Restaurant.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── controllers/           # Logique métier
│   │   ├── restaurantController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                # Routes API
│   │   ├── restaurantRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env                   # Variables d'environnement
│   ├── server.js              # Point d'entrée
│   ├── seed.js                # Script de seed
│   └── package.json
│
└── vuetify-project/           # Frontend Vue.js
    ├── src/
    │   ├── pages/
    │   │   └── index.vue      # Page principale
    │   ├── services/
    │   │   └── api.js         # Service API Axios
    │   └── ...
    ├── .env                   # URL de l'API
    └── package.json
```

## 🎯 Fonctionnalités

### ✅ Implémenté

- **Frontend**
  - ✅ Interface complète Uber Eats avec Vuetify
  - ✅ Header avec recherche, panier, authentification
  - ✅ Sidebar de navigation
  - ✅ Catégories horizontales scrollables
  - ✅ Section promotions avec images
  - ✅ Grille de restaurants avec images réelles
  - ✅ Modale de panier interactive
  - ✅ Gestion des favoris
  - ✅ Calcul automatique des totaux

- **Backend**
  - ✅ API REST complète avec Express
  - ✅ Modèles MongoDB (Restaurant, Product, Cart, Order, User)
  - ✅ CRUD complet pour restaurants et produits
  - ✅ Gestion du panier (ajouter, modifier, supprimer)
  - ✅ Système de commandes avec statuts
  - ✅ Validation et gestion d'erreurs
  - ✅ Script de seed avec données de test
  - ✅ Service API Axios configuré

### 🔨 À implémenter

- Connexion complete frontend ↔ backend
- Authentification JWT
- Page détails restaurant avec menu
- Processus de paiement
- Suivi de commande en temps réel
- Notifications
- Système de notation et avis

## 🔌 API Endpoints

### Restaurants
- `GET /api/restaurants` - Liste tous les restaurants
- `GET /api/restaurants/:id` - Détails d'un restaurant
- `POST /api/restaurants` - Créer un restaurant

### Produits
- `GET /api/products?restaurant=:id` - Produits d'un restaurant
- `POST /api/products` - Créer un produit

### Panier
- `GET /api/cart?sessionId=xxx` - Récupérer le panier
- `POST /api/cart` - Ajouter un article
- `PUT /api/cart` - Modifier la quantité
- `DELETE /api/cart/:productId` - Supprimer un article

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders?sessionId=xxx` - Liste des commandes
- `PUT /api/orders/:id` - Mettre à jour le statut

## 🛠️ Technologies utilisées

### Frontend
- Vue.js 3 (Composition API)
- Vuetify 3 (Material Design)
- Vue Router
- Axios (HTTP client)
- Vite (Build tool)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (hachage mots de passe)
- JWT (authentification)
- CORS

## 📝 Notes

- Le panier utilise un `sessionId` stocké dans localStorage pour les utilisateurs non connectés
- Les images utilisent Unsplash pour la démo
- MongoDB doit être démarré avant le backend
- Le backend écoute sur le port 5000, le frontend sur 3001

## 🐛 Dépannage

### MongoDB n'est pas démarré
```powershell
# Windows - démarrer MongoDB
mongod
```

### Port déjà utilisé
```powershell
# Changer le port dans backend/.env
PORT=5001

# Et dans vuetify-project/.env
VITE_API_URL=http://localhost:5001/api
```

### Erreur CORS
Vérifiez que le backend utilise bien `cors()` middleware dans server.js

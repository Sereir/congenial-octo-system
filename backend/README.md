# Uber Eats Clone - Backend API

Backend API pour le clone Uber Eats avec Node.js, Express et MongoDB.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber-eats
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution :

```bash
# Windows (avec MongoDB installé)
mongod

# Ou utilisez MongoDB Atlas (cloud)
# Remplacez MONGODB_URI par votre connexion string Atlas
```

## Lancer le serveur

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Peupler la base de données

Pour ajouter des données de test :

```bash
node seed.js
```

## Endpoints API

### Restaurants
- `GET /api/restaurants` - Liste tous les restaurants
- `GET /api/restaurants/:id` - Détails d'un restaurant
- `POST /api/restaurants` - Créer un restaurant
- `PUT /api/restaurants/:id` - Mettre à jour un restaurant
- `DELETE /api/restaurants/:id` - Supprimer un restaurant

### Produits
- `GET /api/products` - Liste tous les produits (filtrable par restaurant)
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Panier
- `GET /api/cart?sessionId=xxx` - Récupérer le panier
- `POST /api/cart` - Ajouter un article au panier
- `PUT /api/cart` - Mettre à jour la quantité d'un article
- `DELETE /api/cart/:productId` - Supprimer un article
- `DELETE /api/cart` - Vider le panier

### Commandes
- `GET /api/orders?sessionId=xxx` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Mettre à jour le statut
- `PUT /api/orders/:id/cancel` - Annuler une commande

## Structure du projet

```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── models/
│   ├── Restaurant.js        # Modèle Restaurant
│   ├── Product.js           # Modèle Produit
│   ├── Cart.js              # Modèle Panier
│   ├── Order.js             # Modèle Commande
│   └── User.js              # Modèle Utilisateur
├── controllers/
│   ├── restaurantController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── routes/
│   ├── restaurantRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── .env                      # Variables d'environnement
├── .gitignore
├── server.js                 # Point d'entrée
├── seed.js                   # Script de seed
└── package.json
```

## Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **bcryptjs** - Hachage de mots de passe
- **jsonwebtoken** - Authentification JWT
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables d'environnement

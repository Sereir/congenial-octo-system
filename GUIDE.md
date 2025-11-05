# Guide de démarrage - Uber Eats Clone

## 🎉 Le projet est prêt !

### Serveurs lancés

✅ **Backend** : http://localhost:5001
- MongoDB Atlas connecté
- API REST fonctionnelle
- Données de seed chargées

✅ **Frontend** : http://localhost:3001
- Interface Uber Eats complète
- Connexion au backend active
- Routing fonctionnel

## 🚀 Fonctionnalités implémentées

### Page d'accueil (`/`)
- ✅ Liste des restaurants depuis l'API MongoDB
- ✅ Images réelles (Unsplash)
- ✅ Catégories horizontales scrollables
- ✅ Offres promotionnelles
- ✅ Filtres et tri
- ✅ Modale panier interactive
- ✅ Gestion des favoris
- ✅ Clic sur restaurant → navigation vers page détails

### Page Restaurant (`/restaurant/:id`)
- ✅ Header avec image plein écran
- ✅ Informations restaurant (nom, note, délai, frais)
- ✅ Choix Livraison / À emporter
- ✅ Recherche dans le menu
- ✅ Onglets de catégories
- ✅ Liste des produits par catégorie
- ✅ Cartes produits avec images, descriptions, prix
- ✅ Bouton + pour ajouter au panier
- ✅ Modale détails produit
- ✅ Panier synchronisé entre pages
- ✅ Calcul automatique des totaux

### Backend API
- ✅ GET `/api/restaurants` - Liste restaurants
- ✅ GET `/api/restaurants/:id` - Détails restaurant
- ✅ GET `/api/products?restaurant=:id` - Produits d'un restaurant
- ✅ GET `/api/cart?sessionId=xxx` - Panier utilisateur
- ✅ POST `/api/cart` - Ajouter au panier
- ✅ PUT `/api/cart` - Modifier quantité
- ✅ DELETE `/api/cart/:productId` - Supprimer article
- ✅ POST `/api/orders` - Créer commande

## 📂 Structure

```
test/
├── backend/                    # Port 5001
│   ├── server.js              # ✅ Running
│   ├── seed.js                # ✅ Executed
│   └── .env                   # MongoDB Atlas
│
└── vuetify-project/           # Port 3001
    ├── src/
    │   ├── pages/
    │   │   ├── index.vue      # ✅ Home page
    │   │   └── restaurant/
    │   │       └── [id].vue   # ✅ Restaurant details
    │   ├── services/
    │   │   └── api.js         # ✅ Axios client
    │   └── ...
    └── .env                   # API URL
```

## 🎯 Comment tester

1. **Ouvrir l'app** : http://localhost:3001

2. **Voir les restaurants**
   - La page d'accueil charge automatiquement les restaurants depuis MongoDB
   - Hover sur une carte pour voir l'effet
   - Cliquer sur le cœur pour mettre en favori

3. **Cliquer sur un restaurant**
   - Exemple : cliquer sur "KFC"
   - L'URL change vers `/restaurant/:id`
   - La page détails se charge avec :
     - Image header plein écran
     - Infos restaurant
     - Menu par catégories
     - Produits avec images

4. **Ajouter au panier**
   - Cliquer sur le bouton + d'un produit
   - Ou cliquer sur le produit pour voir les détails
   - Le badge du panier se met à jour automatiquement

5. **Ouvrir le panier**
   - Cliquer sur l'icône panier (header)
   - Modifier les quantités avec +/-
   - Voir le total calculé automatiquement

6. **Rechercher dans le menu**
   - Utiliser la barre de recherche dans la page restaurant
   - Les produits sont filtrés en temps réel

7. **Filtrer par catégorie**
   - Utiliser les onglets (Menus, Poulet, etc.)
   - Seuls les produits de la catégorie s'affichent

## 🔧 API en action

### Test manuel de l'API

```powershell
# Liste restaurants
curl http://localhost:5001/api/restaurants

# Détails d'un restaurant
curl http://localhost:5001/api/restaurants/<ID>

# Produits d'un restaurant
curl "http://localhost:5001/api/products?restaurant=<ID>"

# Health check
curl http://localhost:5001/api/health
```

## 📊 Données disponibles

Le script seed a créé :
- 6 restaurants (KFC, Burger King, Sushi Shop, Toasushi, Pizza Hut, McDonald's)
- ~12 produits (menus, plats, nuggets, sushis, etc.)
- Chaque produit est lié à un restaurant
- Images Unsplash pour tous les éléments

## 🐛 Résolution de problèmes

### Le backend ne se lance pas
```powershell
# Vérifier que le port 5001 est libre
# Si occupé, changer PORT dans backend/.env
```

### Les restaurants ne s'affichent pas
1. Vérifier que le backend tourne : http://localhost:5001/api/health
2. Vérifier la console du navigateur (F12)
3. Vérifier que MongoDB Atlas est accessible

### Erreur CORS
- Le backend a `cors()` activé
- Vérifier que VITE_API_URL dans vuetify-project/.env pointe vers http://localhost:5001/api

### Les images ne chargent pas
- Vérifier la connexion internet (images Unsplash)
- Les placeholders s'affichent automatiquement pendant le chargement

## 🎨 Prochaines étapes suggérées

1. **Synchronisation panier avec API**
   - Persister le panier dans MongoDB
   - Récupérer le panier au chargement

2. **Authentification**
   - JWT tokens
   - Login/Register
   - Profil utilisateur

3. **Processus de commande**
   - Page checkout
   - Choix adresse de livraison
   - Paiement (Stripe ?)
   - Confirmation

4. **Suivi de commande**
   - Statuts en temps réel
   - Socket.io pour les updates
   - Historique des commandes

5. **Améliorations UI/UX**
   - Animations de transition
   - Toast notifications
   - Loading skeletons
   - Infinite scroll

## ✅ Checklist complète

- [x] Backend Express + MongoDB Atlas
- [x] 5 modèles Mongoose
- [x] API REST complète
- [x] Script de seed
- [x] Service Axios frontend
- [x] Page d'accueil avec liste restaurants
- [x] Page détails restaurant
- [x] Routing Vue Router
- [x] Modale panier
- [x] Images réelles
- [x] Calcul des totaux
- [x] Recherche dans menu
- [x] Filtres par catégorie
- [x] Gestion favoris
- [x] Responsive design

## 📱 Accès rapide

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:5001/api
- **Health Check** : http://localhost:5001/api/health
- **Restaurants** : http://localhost:5001/api/restaurants

Bon développement ! 🍕🍔🍣

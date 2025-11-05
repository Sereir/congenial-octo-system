# Guide de démarrage rapide - Docker

## 🚀 Démarrage en 3 étapes

### 1. Vérifier Docker
```powershell
docker --version
docker-compose --version
```

### 2. Build et démarrer
```powershell
# Depuis le dossier test/
docker-compose up -d --build
```

### 3. Vérifier que tout fonctionne
```powershell
# Voir les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## 🌐 Accès

- Frontend : http://localhost
- Backend : http://localhost:5001/api
- Health check : http://localhost:5001/api/health

## 🌱 Initialiser les données

```powershell
docker-compose exec backend node seed.js
```

## 🔍 Dépannage

### MongoDB ne démarre pas
```powershell
docker-compose logs mongodb
docker-compose restart mongodb
```

### Backend ne se connecte pas
```powershell
docker-compose logs backend
docker-compose restart backend
```

### Frontend ne charge pas
```powershell
docker-compose logs frontend
docker-compose restart frontend
```

### Tout nettoyer et recommencer
```powershell
docker-compose down -v
docker-compose up -d --build
```

## 🛑 Arrêter l'application

```powershell
# Arrêter sans supprimer les données
docker-compose down

# Arrêter ET supprimer les données
docker-compose down -v
```

## 📊 Commandes utiles

```powershell
# Voir l'utilisation des ressources
docker stats

# Entrer dans un conteneur
docker-compose exec backend sh
docker-compose exec frontend sh

# Voir les logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Redémarrer un service
docker-compose restart backend
```

## ⚡ Premier test

1. Démarrer : `docker-compose up -d --build`
2. Attendre 30 secondes
3. Ouvrir http://localhost
4. Créer un compte
5. Se connecter
6. Explorer les restaurants !

## 🎯 Seed des données de test

```powershell
# Créer 6 restaurants avec produits
docker-compose exec backend node seed.js

# Résultat attendu :
# ✅ 6 restaurants créés
# ✅ ~12 produits par restaurant
```

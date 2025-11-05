# Docker Uber Eats Clone

Cette application est conteneurisée avec Docker et Docker Compose.

## Prérequis

- Docker Desktop installé sur Windows
- Docker Compose (inclus avec Docker Desktop)

## Structure Docker

```
├── docker-compose.yml       # Orchestration des services
├── backend/
│   ├── Dockerfile          # Image Docker du backend
│   ├── .dockerignore       # Fichiers à exclure
│   └── init-mongo.js       # Script d'initialisation MongoDB
└── vuetify-project/
    ├── Dockerfile          # Image Docker du frontend
    ├── .dockerignore       # Fichiers à exclure
    └── nginx.conf          # Configuration Nginx
```

## Services

- **MongoDB** (port 27017) - Base de données
- **Backend** (port 5001) - API Node.js/Express
- **Frontend** (port 80) - Application Vue.js via Nginx

## Démarrage rapide

### 1. Build et démarrage de tous les services

```powershell
docker-compose up -d --build
```

### 2. Vérifier les logs

```powershell
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 3. Vérifier l'état des conteneurs

```powershell
docker-compose ps
```

### 4. Accéder à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:5001/api
- **Health Check Backend** : http://localhost:5001/api/health
- **MongoDB** : localhost:27017

## Commandes utiles

### Arrêter les services

```powershell
docker-compose down
```

### Arrêter et supprimer les volumes (données)

```powershell
docker-compose down -v
```

### Rebuild un service spécifique

```powershell
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Voir les logs en temps réel

```powershell
docker-compose logs -f --tail=100
```

### Exécuter une commande dans un conteneur

```powershell
# Shell dans le backend
docker-compose exec backend sh

# Shell dans MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123

# Shell dans le frontend
docker-compose exec frontend sh
```

### Redémarrer un service

```powershell
docker-compose restart backend
docker-compose restart frontend
```

## Initialiser les données

Pour seed la base de données avec des données de test :

```powershell
docker-compose exec backend node seed.js
```

## Variables d'environnement

Les variables sont définies dans `docker-compose.yml`. Pour la production, créez un fichier `.env` :

```env
# MongoDB
MONGO_ROOT_PASSWORD=your-secure-password

# Backend
JWT_SECRET=your-very-secure-jwt-secret
NODE_ENV=production

# Frontend
VITE_API_URL=http://your-domain.com/api
```

## Production

Pour déployer en production :

1. **Modifier les secrets** dans `docker-compose.yml`
2. **Utiliser HTTPS** avec un reverse proxy (Traefik, Nginx)
3. **Configurer les volumes** pour la persistance des données
4. **Activer les logs** centralisés

### Exemple avec reverse proxy

Ajoutez un service Nginx ou Traefik pour gérer HTTPS :

```yaml
nginx-proxy:
  image: nginx:alpine
  ports:
    - "443:443"
  volumes:
    - ./nginx-proxy.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
```

## Monitoring

### Santé des services

```powershell
# Backend
curl http://localhost:5001/api/health

# Frontend
curl http://localhost/health
```

### Métriques Docker

```powershell
docker stats
```

## Dépannage

### Le backend ne se connecte pas à MongoDB

Vérifiez que MongoDB est démarré :
```powershell
docker-compose logs mongodb
```

### Le frontend ne peut pas joindre le backend

Vérifiez la variable `VITE_API_URL` dans le frontend.

### Port déjà utilisé

Changez les ports dans `docker-compose.yml` :
```yaml
ports:
  - "8080:80"  # Frontend sur le port 8080
  - "5002:5001"  # Backend sur le port 5002
```

## Nettoyage complet

Pour tout supprimer (conteneurs, images, volumes) :

```powershell
docker-compose down -v --rmi all
docker system prune -a --volumes
```

## Build séparé des images

Si vous voulez build les images séparément :

```powershell
# Backend
cd backend
docker build -t ubereats-backend:latest .

# Frontend
cd vuetify-project
docker build -t ubereats-frontend:latest .
```

## Performance

Pour optimiser les performances :

1. **Multi-stage builds** : Déjà implémenté dans les Dockerfiles
2. **Cache des layers** : Docker utilise le cache automatiquement
3. **Volumes nommés** : Pour MongoDB (déjà configuré)
4. **Nginx gzip** : Activé dans nginx.conf

## Sécurité

⚠️ **Important pour la production** :

1. Changez tous les mots de passe par défaut
2. Utilisez des secrets Docker ou des variables d'environnement sécurisées
3. Activez HTTPS
4. Limitez l'exposition des ports
5. Utilisez des images officielles et à jour
6. Scannez les vulnérabilités avec `docker scan`

```powershell
docker scan ubereats-backend
docker scan ubereats-frontend
```

# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5001

# Démarrer l'application
CMD ["node", "server.js"]

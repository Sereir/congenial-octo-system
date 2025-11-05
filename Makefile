# Makefile pour Uber Eats Clone
.PHONY: help build up down restart logs clean seed ps

help: ## Afficher l'aide
	@echo "Commandes disponibles:"
	@echo "  make build    - Build les images Docker"
	@echo "  make up       - Démarrer les services"
	@echo "  make down     - Arrêter les services"
	@echo "  make restart  - Redémarrer les services"
	@echo "  make logs     - Voir les logs"
	@echo "  make seed     - Initialiser la base de données"
	@echo "  make clean    - Nettoyer tout"
	@echo "  make ps       - Voir l'état des conteneurs"

build: ## Build les images Docker
	docker-compose build --no-cache

up: ## Démarrer les services
	docker-compose up -d
	@echo "✅ Services démarrés"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost:5001/api"

down: ## Arrêter les services
	docker-compose down

restart: ## Redémarrer les services
	docker-compose restart

logs: ## Voir les logs en temps réel
	docker-compose logs -f --tail=100

seed: ## Seed la base de données
	docker-compose exec backend node seed.js

ps: ## Voir l'état des conteneurs
	docker-compose ps

clean: ## Nettoyer tout (conteneurs, volumes, images)
	docker-compose down -v --rmi all
	@echo "⚠️  Tout a été supprimé!"

dev: ## Mode développement (sans Docker)
	@echo "Démarrage en mode développement..."
	cd backend && npm run dev &
	cd vuetify-project && npm run dev

install: ## Installer les dépendances
	cd backend && npm install
	cd vuetify-project && npm install

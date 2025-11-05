# ✅ Checklist TP GitHub Actions - MEVN Stack

## 📋 Partie 1 : Préparation (TERMINÉ ✅)

### 1.1 Concepts clés
- [x] Comprendre les workflows
- [x] Comprendre les jobs
- [x] Comprendre les actions
- [x] Comprendre les triggers
- [x] Comprendre les secrets

### 1.2 Architecture CI/CD
```
Code Push → Lint Check → Tests Backend → Tests Frontend
         → Build Frontend → Deploy (si main)
```
- [x] Architecture définie
- [x] Workflow créé dans `.github/workflows/ci-cd.yml`

### 1.3 Préparation du projet
- [x] Dossier `backend/` avec `package.json`
- [x] Dossier `vuetify-project/` avec `package.json`
- [x] Scripts npm configurés :
  - [x] `npm run lint` (backend & frontend)
  - [x] `npm test` (backend & frontend)
  - [x] `npm run build` (frontend)
  - [x] `npm start` (backend)
- [x] Structure `.github/workflows/` créée

## 📁 Fichiers créés

### Workflows GitHub Actions
- ✅ `.github/workflows/ci-cd.yml` - Pipeline CI/CD complet

### Configuration Backend
- ✅ `backend/.eslintrc.cjs` - Configuration ESLint
- ✅ `backend/jest.config.json` - Configuration Jest
- ✅ `backend/__tests__/api.test.js` - Tests exemple
- ✅ Scripts ajoutés dans `backend/package.json`

### Configuration Frontend  
- ✅ `vuetify-project/vitest.config.js` - Configuration Vitest
- ✅ `vuetify-project/src/__tests__/basic.test.js` - Tests exemple
- ✅ Scripts ajoutés dans `vuetify-project/package.json`

### Documentation
- ✅ `.github/GITHUB_ACTIONS.md` - Guide complet d'utilisation

## 🚀 Prochaines étapes

### 1. Installer les dépendances

```powershell
# Backend
cd backend
npm install eslint jest supertest --save-dev

# Frontend
cd ../vuetify-project
npm install vitest @vitest/ui jsdom @vue/test-utils --save-dev
```

### 2. Tester en local

```powershell
# Backend
cd backend
npm run lint
npm test

# Frontend
cd ../vuetify-project
npm run lint
npm test
npm run build
```

### 3. Initialiser Git et pousser sur GitHub

```powershell
# Si pas encore initialisé
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Add GitHub Actions CI/CD pipeline"

# Ajouter le remote (remplacez par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git

# Pousser
git push -u origin main
```

### 4. Configurer les secrets sur GitHub

Allez dans **Settings > Secrets and variables > Actions** :

#### Secrets obligatoires pour les tests
- `MONGODB_URI_TEST` = `mongodb://localhost:27017/test`
- `JWT_SECRET` = `your-secret-key-123`
- `VITE_API_URL` = `http://localhost:5001/api`

#### Secrets optionnels (pour Docker)
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

#### Secrets optionnels (pour déploiement)
- `SERVER_HOST`
- `SERVER_USERNAME`
- `SSH_PRIVATE_KEY`

### 5. Vérifier le workflow

1. Allez dans l'onglet **Actions** de votre repo
2. Le workflow devrait se lancer automatiquement
3. Vérifiez que tous les jobs passent au vert ✅

## 📊 Jobs du Pipeline

| Job | Description | Dépendances |
|-----|-------------|-------------|
| 🔍 Lint Backend | Vérifie le code backend | Aucune |
| 🔍 Lint Frontend | Vérifie le code frontend | Aucune |
| 🧪 Test Backend | Tests unitaires backend | lint-backend |
| 🧪 Test Frontend | Tests unitaires frontend | lint-frontend |
| 🏗️ Build Frontend | Compile l'application Vue | test-frontend |
| 🐳 Build Docker | Crée les images Docker | test-backend, build-frontend |
| 🚀 Deploy | Déploie en production | build-docker |

## 🎓 Points d'évaluation du TP

- [x] **Workflow configuré** : Fichier YAML valide
- [x] **Lint automatisé** : ESLint sur backend et frontend
- [x] **Tests automatisés** : Jest et Vitest
- [x] **Build automatisé** : Vite build du frontend
- [x] **Secrets gérés** : Variables sensibles sécurisées
- [x] **Jobs parallélisés** : Lint en parallèle
- [x] **Jobs séquentiels** : Tests après lint
- [x] **Artifacts sauvegardés** : Build frontend uploadé
- [x] **Déploiement conditionnel** : Seulement sur main
- [x] **Documentation** : Guide complet fourni

## 🐛 Troubleshooting

### Le workflow ne se déclenche pas
- Vérifiez que le fichier est dans `.github/workflows/`
- Vérifiez la syntaxe YAML
- Poussez sur `main` ou `develop`

### Les tests échouent
- Installez toutes les dépendances en local d'abord
- Vérifiez que les tests passent en local
- Configurez les secrets nécessaires

### Le build échoue
- Vérifiez `VITE_API_URL` dans les secrets
- Assurez-vous que toutes les dépendances sont dans `package.json`

## 📚 Ressources utiles

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [ESLint](https://eslint.org/)
- [Jest](https://jestjs.io/)
- [Vitest](https://vitest.dev/)

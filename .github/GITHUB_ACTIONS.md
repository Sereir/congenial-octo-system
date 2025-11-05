# 🚀 GitHub Actions CI/CD - Guide d'utilisation

## 📋 Configuration requise sur GitHub

### 1. Secrets à configurer

Allez dans **Settings > Secrets and variables > Actions** et ajoutez :

#### Secrets obligatoires

| Secret | Description | Exemple |
|--------|-------------|---------|
| `MONGODB_URI_TEST` | URI MongoDB pour les tests | `mongodb://localhost:27017/test` |
| `JWT_SECRET` | Clé secrète pour JWT | `your-super-secret-key-123` |
| `VITE_API_URL` | URL de l'API pour le frontend | `https://api.example.com` |

#### Secrets pour Docker (si déploiement)

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKER_PASSWORD` | Mot de passe Docker Hub |

#### Secrets pour déploiement SSH

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Adresse IP ou domaine du serveur |
| `SERVER_USERNAME` | Nom d'utilisateur SSH |
| `SSH_PRIVATE_KEY` | Clé privée SSH |

### 2. Comment ajouter un secret

```bash
# Via GitHub CLI
gh secret set MONGODB_URI_TEST

# Ou via l'interface web
Settings > Secrets and variables > Actions > New repository secret
```

## 🔄 Workflow déclenché automatiquement

Le workflow se déclenche sur :
- ✅ Push sur `main` ou `develop`
- ✅ Pull Request vers `main` ou `develop`

## 📊 Architecture du pipeline

```
Push/PR → Lint Backend    → Test Backend    → Build Docker (si main)
       → Lint Frontend   → Test Frontend   → Build Frontend
                                            → Deploy (si main)
```

## 🧪 Tests en local avant de push

### Backend

```powershell
cd backend
npm install
npm run lint      # Vérifier le code
npm test          # Lancer les tests
```

### Frontend

```powershell
cd vuetify-project
npm install
npm run lint      # Vérifier le code
npm test          # Lancer les tests
npm run build     # Builder l'application
```

## 📝 Scripts disponibles

### Backend (`backend/package.json`)

- `npm start` - Démarre le serveur en production
- `npm run dev` - Démarre en mode développement avec nodemon
- `npm run lint` - Vérifie la qualité du code avec ESLint
- `npm test` - Lance les tests avec Jest
- `npm run test:watch` - Tests en mode watch

### Frontend (`vuetify-project/package.json`)

- `npm run dev` - Démarre le serveur de développement Vite
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build
- `npm run lint` - Vérifie la qualité du code avec ESLint
- `npm test` - Lance les tests avec Vitest
- `npm run test:watch` - Tests en mode watch

## 🐛 Dépannage

### Les tests échouent sur GitHub mais pas en local

1. Vérifiez que les secrets sont bien configurés
2. Vérifiez les versions de Node.js (workflow utilise Node 20.x)
3. Assurez-vous que `package-lock.json` est commité

### Le lint échoue

```powershell
# Corriger automatiquement les erreurs
npm run lint -- --fix
```

### Le build échoue

Vérifiez que :
- Toutes les dépendances sont dans `package.json`
- Les variables d'environnement sont correctes
- Le fichier `.env` n'est pas dans `.gitignore` (ou utilisez des secrets)

## 🎯 Étapes suivantes

1. ✅ Configurer les secrets sur GitHub
2. ✅ Pusher le code
3. ✅ Vérifier que le workflow s'exécute (Actions tab)
4. ✅ Corriger les erreurs éventuelles
5. ✅ Configurer le déploiement si nécessaire

## 📈 Badges de statut

Ajoutez ces badges à votre README.md :

```markdown
![CI/CD](https://github.com/VOTRE-USERNAME/VOTRE-REPO/workflows/CI%2FCD%20Pipeline%20-%20Uber%20Eats%20Clone/badge.svg)
```

## 🔒 Sécurité

- ❌ Ne committez **JAMAIS** de secrets dans le code
- ✅ Utilisez les **GitHub Secrets** pour les données sensibles
- ✅ Limitez les permissions des tokens
- ✅ Utilisez des clés SSH dédiées pour le déploiement

## 📚 Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

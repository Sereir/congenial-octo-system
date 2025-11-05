# 📦 Guide de Déploiement

Ce document décrit le processus de déploiement automatisé de l'application MEVN Stack avec GitHub Actions.

---

## 🎯 Architecture de Déploiement

### Environnements

| Environnement | Branche | URL | Déploiement |
|---------------|---------|-----|-------------|
| **Development** | `*` | Local | Manuel |
| **Staging** | `develop` | Staging server | Automatique sur push |
| **Production** | `main` | Production server | Automatique sur push |

---

## 🔐 Secrets GitHub Requis

### Secrets Obligatoires pour CI/CD

Allez dans **Settings > Secrets and variables > Actions** et ajoutez :

#### Tests & Build
```
MONGODB_URI_TEST      # Base de données MongoDB pour les tests
JWT_SECRET            # Secret JWT pour l'authentification
VITE_API_URL          # URL de l'API pour le frontend (développement)
```

#### Production
```
PROD_API_URL          # URL de l'API en production
MONGODB_URI_PROD      # Base de données MongoDB de production
JWT_SECRET_PROD       # Secret JWT pour la production (différent de dev!)
```

#### Staging (Optionnel)
```
STAGING_API_URL       # URL de l'API de staging
MONGODB_URI_STAGING   # Base de données MongoDB de staging
```

#### Déploiement (Optionnel - si déploiement SSH)
```
SERVER_HOST           # IP ou domaine du serveur (ex: 123.45.67.89)
SERVER_USERNAME       # Utilisateur SSH (ex: ubuntu, root)
SSH_PRIVATE_KEY       # Clé SSH privée pour l'authentification
```

#### Notifications (Optionnel)
```
SLACK_WEBHOOK         # Webhook Slack pour les notifications
DISCORD_WEBHOOK       # Webhook Discord pour les notifications
```

---

## 🚀 Processus de Déploiement Automatisé

### 1. Workflow CI (`.github/workflows/ci.yml`)

**Déclencheurs :**
- Push vers `main` ou `develop`
- Pull Request vers `main` ou `develop`

**Jobs :**
1. **Lint** → Vérification ESLint (backend & frontend en parallèle)
2. **Test Backend** → Tests Jest avec MongoDB
3. **Test Frontend** → Tests Vitest
4. **Build** → Compilation production du frontend
5. **Security Audit** → Audit npm (non-bloquant)
6. **Notifications** → Logs de succès/échec

**Durée estimée :** 5-8 minutes

---

### 2. Workflow Deploy Production (`.github/workflows/deploy.yml`)

**Déclencheurs :**
- Push vers `main` uniquement
- Déclenchement manuel via workflow_dispatch

**Jobs (séquentiels) :**

#### Étape 1 : Validation Pré-Déploiement
- ✅ Vérification lint backend
- ✅ Vérification lint frontend
- ✅ Exécution tests backend
- ✅ Validation du build frontend

🚨 **Le déploiement s'arrête si une validation échoue**

#### Étape 2 : Migration Base de Données
- Exécution des migrations MongoDB
- Versioning des migrations
- Logs détaillés

#### Étape 3 : Build Production
- Build frontend avec variables d'environnement de production
- Installation dépendances backend (--production)
- Upload des artefacts (conservés 7 jours)

#### Étape 4 : Déploiement
- Download des artefacts
- Déploiement sur le serveur de production
- Redémarrage des services

#### Étape 5 : Health Check Post-Déploiement
- Attente de 30 secondes
- Test du endpoint `/health`
- Test des endpoints critiques (`/api/auth`, `/api/restaurants`)

🔄 **Rollback automatique si les health checks échouent**

#### Étape 6 : Notifications
- Notification de succès avec détails
- Notification d'échec avec logs

**Durée estimée :** 10-15 minutes

---

### 3. Workflow Staging (`.github/workflows/staging.yml`)

**Déclencheurs :**
- Push vers `develop` uniquement

**Jobs :**
1. Build avec variables d'environnement de staging
2. Déploiement sur serveur de staging
3. Health check de staging
4. Notification

**Durée estimée :** 8-12 minutes

---

## 🛠️ Déploiement Manuel

### Option 1 : Via GitHub Actions Interface

1. Allez sur votre repo : `https://github.com/<username>/<repo>/actions`
2. Sélectionnez le workflow **"Deploy to Production"**
3. Cliquez sur **"Run workflow"**
4. Sélectionnez la branche `main`
5. (Optionnel) Spécifiez une version
6. Cliquez sur **"Run workflow"**

### Option 2 : Via GitHub CLI

```bash
# Installer gh (GitHub CLI) si nécessaire
# https://cli.github.com/

# Déclencher le déploiement production
gh workflow run deploy.yml

# Déclencher avec une version spécifique
gh workflow run deploy.yml -f version=v1.2.3

# Voir le statut
gh run list --workflow=deploy.yml
```

### Option 3 : Forcer un Push

```bash
# Créer un commit vide pour forcer le déploiement
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

---

## ⚙️ Configuration des Environnements GitHub

### Créer les Environnements

1. Allez dans **Settings > Environments**
2. Créez deux environnements :

#### Environment : `production`
- ✅ Required reviewers : Ajoutez des reviewers (optionnel)
- ✅ Wait timer : 5 minutes (optionnel)
- ✅ Deployment branches : Seulement `main`

#### Environment : `staging`
- ✅ Deployment branches : Seulement `develop`

---

## 🔄 Procédure de Rollback

### Rollback Automatique

Le workflow de déploiement inclut un rollback automatique si :
- Les health checks post-déploiement échouent
- Un job de déploiement échoue

### Rollback Manuel

#### Méthode 1 : Revenir au commit précédent

```bash
# Sur votre machine locale
git log --oneline -5  # Voir les 5 derniers commits

# Revenir au commit précédent
git revert HEAD
git push origin main  # Déclenche un nouveau déploiement
```

#### Méthode 2 : Reset force (⚠️ dangereux)

```bash
# Seulement en cas d'urgence !
git reset --hard HEAD~1
git push --force origin main
```

#### Méthode 3 : Déployer une version spécifique

```bash
# Créer une branche depuis un commit ancien
git checkout -b hotfix/rollback <commit-sha>
git push origin hotfix/rollback

# Créer une PR vers main
# Fusionner pour déclencher le déploiement
```

#### Méthode 4 : Rollback SSH Manuel

Si les workflows GitHub sont bloqués :

```bash
# Se connecter au serveur
ssh user@production-server

# Naviguer vers l'application
cd /var/www/app

# Revenir au commit précédent
git log --oneline -5
git checkout <previous-commit-sha>

# Redémarrer les services
pm2 restart all
# ou
docker-compose restart
```

---

## 📊 Monitoring Post-Déploiement

### Vérifications Manuelles

Après chaque déploiement, vérifiez :

1. **Frontend accessible** : `https://your-domain.com`
2. **API Health** : `https://api.your-domain.com/health`
3. **Authentification** : Tester login/register
4. **Base de données** : Vérifier les données
5. **Logs** : Consulter les logs serveur

### Logs GitHub Actions

```bash
# Via GitHub CLI
gh run list --workflow=deploy.yml --limit 5
gh run view <run-id> --log
```

### Logs Serveur (si déploiement SSH)

```bash
# PM2
pm2 logs

# Docker
docker-compose logs -f --tail=100

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🐛 Dépannage

### Le workflow ne se déclenche pas

**Causes possibles :**
- La branche n'est pas `main` ou `develop`
- Le fichier workflow a des erreurs de syntaxe
- Les permissions GitHub Actions sont désactivées

**Solution :**
```bash
# Vérifier la syntaxe YAML
yamllint .github/workflows/ci.yml

# Vérifier les permissions
# Settings > Actions > General > Workflow permissions
# Cocher "Read and write permissions"
```

### Les secrets ne sont pas reconnus

**Solution :**
1. Allez dans **Settings > Secrets and variables > Actions**
2. Vérifiez que les secrets sont bien créés
3. Les noms doivent correspondre EXACTEMENT (sensible à la casse)
4. Re-déclenchez le workflow

### Le build échoue

**Solutions :**
```bash
# Tester localement avant de push
npm run lint
npm test
npm run build

# Vérifier les versions Node.js
node -v  # Doit être 18.x

# Nettoyer les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Le déploiement échoue

**Checklist :**
- [ ] Les secrets de déploiement sont configurés ?
- [ ] Le serveur est accessible via SSH ?
- [ ] Le serveur a assez d'espace disque ?
- [ ] Les ports sont ouverts (80, 443, 5001) ?
- [ ] MongoDB est accessible depuis le serveur ?

---

## 📋 Checklist Pré-Déploiement

Avant chaque déploiement production :

- [ ] Tests locaux passent : `npm test`
- [ ] Build local fonctionne : `npm run build`
- [ ] Lint est propre : `npm run lint`
- [ ] Les migrations sont testées
- [ ] Les variables d'environnement sont à jour
- [ ] Un backup de la base de données est fait
- [ ] L'équipe est prévenue du déploiement
- [ ] Un plan de rollback est prêt

---

## 🔒 Bonnes Pratiques de Sécurité

1. **Ne JAMAIS commit les fichiers `.env`**
2. **Utiliser des secrets différents pour dev/staging/prod**
3. **Régénérer les secrets JWT régulièrement**
4. **Limiter les accès aux secrets GitHub** (Settings > Collaborators)
5. **Activer la 2FA** sur GitHub
6. **Utiliser des clés SSH dédiées** pour le déploiement
7. **Monitorer les logs** d'accès

---

## 📞 Support

En cas de problème :
1. Consulter les logs GitHub Actions
2. Consulter ce guide de dépannage
3. Vérifier la documentation GitHub Actions officielle
4. Contacter l'équipe DevOps

---

**Dernière mise à jour :** 5 novembre 2025

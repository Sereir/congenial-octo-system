# Configuration des Secrets GitHub
## TP CI/CD - GitHub Actions

**Repository :** Sereir/congenial-octo-system  
**Date :** 6 novembre 2025

---

## 🔐 Secrets Configurés

### ✅ Secrets Obligatoires (Déjà configurés)

#### 1. MONGODB_URI_TEST
```
mongodb+srv://db_user:MLXkag3PVEjc34Gu@cluster0.m3bmapi.mongodb.net/ubereats-test?appName=Cluster0
```
**Usage :** Tests backend dans le workflow CI  
**Utilisé dans :** `.github/workflows/ci.yml` (job test-backend)

#### 2. JWT_SECRET
```
your_jwt_secret_key_change_in_production
```
**Usage :** Authentification JWT pour les tests  
**Utilisé dans :** `.github/workflows/ci.yml` (job test-backend)

#### 3. VITE_API_URL
```
http://localhost:5001
```
**Usage :** URL de l'API pour le frontend en développement  
**Utilisé dans :** `.github/workflows/ci.yml` (job test-frontend, build)

---

## ⚠️ Secrets Recommandés (À configurer pour déploiement complet)

### Pour Production

#### 4. PROD_API_URL
```
https://api.votre-domaine.com
ou
https://votre-app.railway.app/api
```
**Usage :** URL de l'API en production  
**Utilisé dans :** `.github/workflows/deploy.yml` (tous les jobs)

#### 5. MONGODB_URI_PROD
```
mongodb+srv://prod_user:SECURE_PASSWORD@cluster0.xxx.mongodb.net/ubereats-prod?retryWrites=true&w=majority
```
**Usage :** Base de données MongoDB de production  
**Utilisé dans :** `.github/workflows/deploy.yml` (job migrate-database)  
⚠️ **Important :** Utilisez un utilisateur et mot de passe différents de dev/test

#### 6. JWT_SECRET_PROD
```
GENERATE_A_VERY_SECURE_RANDOM_STRING_FOR_PRODUCTION_2025
```
**Usage :** Secret JWT pour la production  
**Utilisé dans :** `.github/workflows/deploy.yml`  
⚠️ **Important :** DOIT être différent du JWT_SECRET de dev/test

**Génération recommandée :**
```bash
# Dans PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# Ou en ligne
# https://generate-secret.vercel.app/64
```

### Pour Staging (Optionnel)

#### 7. STAGING_API_URL
```
https://staging.votre-domaine.com/api
ou
https://staging-app.railway.app/api
```
**Usage :** URL de l'API de staging  
**Utilisé dans :** `.github/workflows/staging.yml`

#### 8. MONGODB_URI_STAGING
```
mongodb+srv://staging_user:PASSWORD@cluster0.xxx.mongodb.net/ubereats-staging
```
**Usage :** Base de données MongoDB de staging  
**Utilisé dans :** `.github/workflows/staging.yml`

---

## 🐳 Secrets Docker Hub (Optionnel)

Si vous souhaitez implémenter la partie 4 du TP (Containerization) :

#### 9. DOCKER_USERNAME
```
votre_username_dockerhub
```
**Usage :** Push des images Docker  
**Comment obtenir :** Votre username sur https://hub.docker.com

#### 10. DOCKER_PASSWORD
```
dckr_pat_XXXXXXXXXXXXXXXXXXXXXXXXXX
```
**Usage :** Authentification Docker Hub  
**Comment obtenir :**
1. Allez sur https://hub.docker.com/settings/security
2. Cliquez sur "New Access Token"
3. Nom : "GitHub Actions CI/CD"
4. Permissions : "Read, Write, Delete"
5. Copiez le token généré

---

## 🚀 Secrets Déploiement SSH (Optionnel)

Pour déployer sur un serveur VPS/EC2 :

#### 11. SERVER_HOST
```
123.45.67.89
ou
votre-serveur.com
```
**Usage :** IP ou domaine du serveur de production

#### 12. SERVER_USERNAME
```
ubuntu
ou
root
```
**Usage :** Utilisateur SSH pour la connexion

#### 13. SSH_PRIVATE_KEY
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
...
-----END OPENSSH PRIVATE KEY-----
```
**Usage :** Clé SSH privée pour l'authentification  
**Comment obtenir :**
```powershell
# Générer une nouvelle clé SSH (si besoin)
ssh-keygen -t ed25519 -C "github-actions-deploy"

# Afficher la clé privée
cat ~/.ssh/id_ed25519

# Copier la clé publique sur le serveur
ssh-copy-id user@server
```

---

## 📧 Secrets Notifications (Optionnel)

#### 14. SLACK_WEBHOOK
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```
**Usage :** Notifications Slack  
**Comment obtenir :**
1. Allez sur https://api.slack.com/apps
2. Créez une nouvelle app
3. Activez "Incoming Webhooks"
4. Créez un nouveau webhook
5. Copiez l'URL

#### 15. DISCORD_WEBHOOK
```
https://discord.com/api/webhooks/1234567890/XXXXXXXXXXXXXXXXXXXXXXXXXXX
```
**Usage :** Notifications Discord  
**Comment obtenir :**
1. Paramètres du serveur Discord
2. Intégrations > Webhooks
3. Nouveau Webhook
4. Copier l'URL du webhook

---

## 📋 Procédure de Configuration

### Sur GitHub

1. Allez sur votre repository : `https://github.com/Sereir/congenial-octo-system`

2. Cliquez sur **Settings** (en haut à droite)

3. Dans le menu de gauche : **Secrets and variables > Actions**

4. Cliquez sur **New repository secret**

5. Pour chaque secret :
   - **Name :** Nom exact du secret (ex: `PROD_API_URL`)
   - **Secret :** Valeur du secret
   - Cliquez sur **Add secret**

### Vérification

Après configuration, vous devriez voir dans la liste :

```
✅ MONGODB_URI_TEST
✅ JWT_SECRET
✅ VITE_API_URL
⚠️ PROD_API_URL (recommandé)
⚠️ MONGODB_URI_PROD (recommandé)
⚠️ JWT_SECRET_PROD (recommandé)
```

---

## 🔍 Vérification des Secrets dans les Workflows

Les secrets sont référencés dans les workflows via :

```yaml
${{ secrets.NOM_DU_SECRET }}
```

**Exemple dans ci.yml :**
```yaml
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

**Exemple dans deploy.yml :**
```yaml
env:
  VITE_API_URL: ${{ secrets.PROD_API_URL }}
```

---

## 🛡️ Bonnes Pratiques de Sécurité

### ✅ À FAIRE

1. **Secrets différents par environnement**
   - Dev : `JWT_SECRET`
   - Prod : `JWT_SECRET_PROD`

2. **Rotation régulière**
   - Changez les secrets tous les 3-6 mois
   - Changez immédiatement si compromis

3. **Mots de passe forts**
   - Minimum 32 caractères
   - Mélange de majuscules, minuscules, chiffres, symboles

4. **Base de données séparées**
   - Test : `ubereats-test`
   - Staging : `ubereats-staging`
   - Production : `ubereats-prod`

### ❌ À NE PAS FAIRE

1. ❌ Jamais commit un fichier `.env` avec des secrets
2. ❌ Ne jamais partager les secrets par email/Slack
3. ❌ Ne pas utiliser les mêmes secrets pour dev/prod
4. ❌ Ne pas logger les secrets dans les workflows

---

## 🧪 Test de Configuration

Pour vérifier que les secrets sont bien configurés :

1. Créez un commit vide :
   ```bash
   git commit --allow-empty -m "test: Verify secrets configuration"
   git push origin main
   ```

2. Allez sur l'onglet **Actions**

3. Vérifiez que le workflow démarre

4. Si erreur "Context access might be invalid" :
   - Le secret n'est pas créé
   - Le nom du secret est incorrect (vérifiez la casse)

---

## 📞 Support

En cas de problème avec les secrets :

1. Vérifiez que le nom du secret correspond **exactement** (sensible à la casse)
2. Vérifiez que le secret est bien dans "Actions" et pas "Dependabot" ou "Codespaces"
3. Consultez les logs du workflow pour voir quelle variable manque
4. Re-créez le secret si nécessaire (supprimez puis recréez)

---

## 📊 État Actuel

### Secrets Configurés ✅
- [x] MONGODB_URI_TEST
- [x] JWT_SECRET
- [x] VITE_API_URL

### Secrets À Configurer (selon besoins du TP) ⚠️
- [ ] PROD_API_URL
- [ ] MONGODB_URI_PROD
- [ ] JWT_SECRET_PROD
- [ ] STAGING_API_URL (optionnel)
- [ ] DOCKER credentials (optionnel)
- [ ] SSH keys (optionnel)
- [ ] Webhooks notifications (optionnel)

---

**Note :** Les 3 premiers secrets suffisent pour faire fonctionner le workflow CI et valider la partie 2 du TP. Les autres sont nécessaires pour les parties 3 et 4 (déploiement).

**Dernière mise à jour :** 6 novembre 2025

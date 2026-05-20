## Contenu du README.md

```markdown
# LoveExpress – Créateur de surprises à Kigali

![LoveExpress Banner](https://lovesupriseexpress.netlify.app/og-image.jpg)

LoveExpress est une application web complète permettant de planifier des surprises inoubliables (anniversaires, demandes en mariage, baby showers, etc.) à Kigali, au Rwanda.  
Elle propose un catalogue de services, une galerie de réalisations, un formulaire de commande multi‑étapes, un espace d’administration sécurisé et un système d’avis clients avec modération.

---

## ✨ Fonctionnalités principales

- **Catalogue dynamique** : services (party decoration, surprise planner, custom website, flower bouquet) et gift baskets, entièrement pilotés par Netlify CMS.
- **Formulaire de commande intelligent** : 6 étapes, calcul automatique du budget, téléchargement d’un récapitulatif PDF.
- **Galerie publique** : avis clients avec photos, filtrés par statut (publié / en attente).
- **Dashboard administrateur** :
  - Gestion des commandes (changement de statut, suppression définitive)
  - Gestion des avis (publication, rejet, suppression)
  - Filtrage par date et statistiques (chiffre d’affaires, commandes en attente, etc.)
- **Mode maintenance** : désactivation temporaire du formulaire avec bandeau personnalisable.
- **Internationalisation** : français, anglais, kinyarwanda.
- **Notifications** : emails automatiques (admin + client) via Gmail, option WhatsApp.
- **Stockage sécurisé** : Netlify Blobs pour commandes, avis et photos.
- **CMS intégré** : Netlify CMS pour modifier les contenus sans toucher au code.

---

## 🧱 Stack technique

| Catégorie         | Technologies                                                                 |
|-------------------|------------------------------------------------------------------------------|
| Frontend          | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion   |
| Internationalisation | i18next, react-i18next, Language Detector                                 |
| Backend / API     | Netlify Functions (Node.js)                                                  |
| Base de données   | Netlify Blobs (stockage objet)                                               |
| Authentification  | Netlify Identity + JWT                                                       |
| CMS               | Netlify CMS (Git Gateway)                                                    |
| Emails            | Nodemailer (Gmail SMTP)                                                      |
| Notifications     | CallMeBot API (WhatsApp) – optionnel                                         |
| PDF               | html2pdf.js                                                                  |
| Hébergement       | Netlify (déploiement continu)                                                |

---

## 📁 Structure du projet (aperçu)

```
loveexpress/
├── app/                      # App Router Next.js
│   ├── api/cms/              # Routes API pour le CMS
│   ├── dashboard/            # Interface admin (layout + page)
│   ├── gallery/              # Page publique des avis
│   ├── layout.tsx
│   ├── page.tsx              # Page d’accueil
│   └── providers.tsx
├── components/               # Composants React
├── content/                  # Fichiers JSON du CMS
├── lib/                      # Utilitaires (i18n, blobs, fallbacks, traductions)
├── netlify/functions/        # Fonctions serverless
├── public/                   # Assets statiques + admin CMS
├── types/                    # Déclarations TypeScript
├── next.config.js
├── netlify.toml
└── package.json
```

---

## 🚀 Installation et développement local

### Prérequis

- Node.js 20+
- Netlify CLI (optionnel, mais recommandé)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-org/loveexpress.git
cd loveexpress

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env.local à la racine (voir section Configuration)
cp .env.example .env.local  # adapter avec vos clés

# 4. Lancer le serveur de développement
npm run dev
```

L’application sera accessible sur `http://localhost:3000`.

Pour tester les fonctions Netlify en local :

```bash
netlify dev
```

---

## ⚙️ Configuration des variables d’environnement

Créez un fichier `.env.local` avec les variables suivantes (celles marquées 🔑 sont obligatoires pour la production) :

```env
# 🔑 URL publique du site (utilisée pour les redirections d’emails)
URL=http://localhost:3000

# 🔑 Netlify Identity & Blobs
NEXT_PUBLIC_NETLIFY_URL=http://localhost:3000
NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_site_id

# 🔑 Authentification admin (emails séparés par des virgules)
ADMIN_EMAILS=admin@example.com,autre@example.com

# 🔑 Envoi d’emails (Gmail)
GMAIL_USER=votre.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Optionnel – notifications WhatsApp
CALLMEBOT_API_KEY=your_callmebot_key

# Optionnel – Google Sheets webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://hook...
```

> **Note** : En production sur Netlify, ces variables doivent être définies dans l’interface Netlify (Site settings > Environment variables).

---

## 🔐 Authentification admin

L’accès au dashboard `/dashboard` est protégé par **Netlify Identity** (Git Gateway).  
Pour activer le mode admin :

1. Activez Netlify Identity dans votre site Netlify.
2. Invitez un utilisateur (son email doit figurer dans `ADMIN_EMAILS`).
3. L’utilisateur reçoit un email d’invitation et crée son mot de passe.
4. Il peut alors se connecter via le widget sur `/dashboard`.

Les fonctions serverless vérifient automatiquement le token JWT.

---

## 🧩 Gestion du CMS (Netlify CMS)

Le CMS est accessible à l’adresse `/admin`.  
Les collections sont définies dans `public/admin/config.yml`.  
Les données sont stockées dans le dossier `content/` et commitées sur la branche `mtest` (modifiable dans le fichier).

Pour modifier localement les contenus :

1. Lancez le site en dev (`npm run dev`)
2. Allez sur `http://localhost:3000/admin`
3. Connectez-vous avec un compte Netlify Identity (Git Gateway)
4. Modifiez les services, paniers, réalisations, etc.
5. Les changements sont automatiquement commités et déployés (si le dépôt est lié à Netlify).

---

## 📦 Déploiement sur Netlify

Le projet est configuré pour un déploiement continu via Netlify.

### Configuration du site

1. Connectez votre dépôt GitHub / GitLab à Netlify.
2. Utilisez les paramètres suivants :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
   - **Branche** : `mtest` (ou celle de votre choix)
3. Ajoutez les variables d’environnement (voir section plus haut).
4. Activez **Netlify Identity** et **Git Gateway**.
5. Déployez !

Le fichier `netlify.toml` contient toutes les redirections nécessaires (fonctions, admin, cache).

---

## 📡 API – Fonctions serverless

Toutes les fonctions sont situées dans `netlify/functions/`.  
Elles sont exposées via `/.netlify/functions/<nom>` et également redirigées depuis `/functions/<nom>`.

| Fonction                    | Méthode | Description                                      | Auth requise |
|-----------------------------|---------|--------------------------------------------------|--------------|
| `submit-order`              | POST    | Sauvegarde une commande + emails                | Non          |
| `submit-testimonial`        | POST    | Sauvegarde un avis client (photo optionnelle)   | Non          |
| `get-orders`                | GET     | Liste toutes les commandes                      | Oui (admin)  |
| `get-all-testimonials`      | GET     | Liste tous les avis (tous statuts)              | Oui (admin)  |
| `get-testimonials`          | GET     | Liste uniquement les avis publiés               | Non          |
| `update-order-status`       | POST    | Change le statut d’une commande                 | Oui (admin)  |
| `moderate-testimonial`      | POST    | Publie ou rejette un avis                       | Oui (admin)  |
| `delete-order`              | DELETE  | Supprime définitivement une commande            | Oui (admin)  |
| `delete-testimonial`        | DELETE  | Supprime définitivement un avis                 | Oui (admin)  |
| `send-email`                | POST    | Envoie un email via Gmail                       | Non          |
| `get-photo`                 | GET     | Récupère une photo stockée (base64)             | Non          |

---

## 🛠️ Personnalisation et fallbacks

- **Fallback des données** : si le CMS n’est pas accessible ou qu’aucun fichier JSON n’est trouvé, le site utilise les données par défaut définies dans `lib/cms-fallback.ts`.
- **Traductions** : les textes statiques sont dans `lib/i18n.ts` ; les contenus CMS sont traduits dynamiquement via `lib/cms-translations.ts`.
- **Mode maintenance** : modifiez `public/data/maintenance/config.json` pour activer un bandeau sur le formulaire de contact.

---

## 📄 Licence

Ce projet est la propriété de LoveExpress.  
Toute reproduction ou utilisation non autorisée est interdite.

---

## 👥 Équipe

- **EYEANG Love** – Fondatrice & Développeuse
- **AK** – Développement technique

---

## 📞 Support

Pour toute question technique ou signalement de bug :  
✉️ lovesupriseexpress@gmail.com  
📱 +250 799 366 007

---

**Documentation générée le** 20 mai 2026 – version basée sur le code source fourni.
```

---

## Commande pour créer le fichier

Vous pouvez utiliser l’une des commandes suivantes selon votre système :

### 1. Avec `cat` (Unix / Linux / macOS / Git Bash)

```bash
cat > README.md << 'EOF'
[collez le contenu ci-dessus entre les deux EOF]
EOF
```

### 2. Avec `echo` et des retours à la ligne (plus délicat)

```bash
echo "# LoveExpress – Créateur de surprises à Kigali" > README.md
echo "" >> README.md
# ... etc. (peu pratique)
```

### 3. Méthode simple : copier-coller

1. Ouvrez votre éditeur de texte ou IDE.
2. Créez un fichier nommé `README.md`.
3. Copiez tout le contenu fourni ci-dessus.
4. Collez-le dans le fichier.
5. Sauvegardez.

### 4. Via `nano` (terminal)

```bash
nano README.md
# collez le contenu, Ctrl+O, Entrée, Ctrl+X
```

---

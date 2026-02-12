# Clone Trello

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248.svg)](https://www.mongodb.com/)

**Application web full stack** inspirée de Trello pour la gestion de projets en équipe. Tableaux Kanban interactifs, collaboration en temps réel, authentification sécurisée et interface moderne (mode sombre/clair, responsive).

---

## 📋 Description du projet

Clone Trello est une plateforme collaborative permettant de **planifier, organiser et suivre des projets** grâce à des tableaux Kanban. Les équipes peuvent créer des projets, inviter des membres, gérer des tâches avec priorités et dates limites, les déplacer par glisser-déposer entre colonnes, et collaborer via commentaires et mises à jour en temps réel.

Le projet démontre une **architecture full stack** (React + Node.js), une **API REST** documentée, l’usage de **WebSockets (Socket.io)** pour le temps réel, une **authentification JWT**, et une **interface utilisateur** soignée avec Tailwind CSS et animations.

**Public visé :** équipes, freelances, étudiants ou recruteurs souhaitant voir un projet complet (frontend, backend, base de données, temps réel).

---

## ✨ Fonctionnalités

### 🔐 Authentification & sécurité
- Inscription et connexion sécurisées
- Mots de passe hashés (bcrypt)
- Authentification JWT avec expiration
- Gestion des rôles (propriétaire / membre)
- Routes protégées côté client et serveur

### 📊 Gestion des projets
- Créer, modifier et supprimer des projets
- Templates de projet (Web, Mobile, Sprint Agile, personnalisé)
- Personnalisation des couleurs
- Invitation de membres par recherche d’utilisateurs
- Gestion des permissions (propriétaire, membres)

### 📌 Tableau Kanban
- **3 colonnes** : À Faire (To Do), En Cours (Doing), Terminé (Done)
- **Drag & Drop** fluide avec @dnd-kit
- Mise à jour en temps réel (Socket.io) pour tous les collaborateurs
- Design avec gradients et transitions

### ✅ Gestion des tâches
- Création, modification, suppression
- **Titre**, **description**, **date limite**, **priorité** (Basse, Moyenne, Haute)
- Assignation à un ou plusieurs membres
- **Commentaires** sur les tâches avec affichage en temps réel
- Indicateurs visuels pour tâches en retard ou proches de la date limite
- Support prévu pour pièces jointes (structure en place)

### 💬 Collaboration & bonus
- Commentaires sur les tâches
- **Fil d’activité** (Activity Feed) : créations, modifications, déplacements, commentaires
- **Recherche avancée** : par titre, priorité, colonne, membre assigné, dates
- **Mode Focus** : afficher uniquement les tâches assignées à l’utilisateur connecté
- **Dashboard analytique** : statistiques, répartition par priorité/membre, tâches en retard
- **Notifications** (structure prête)
- **Mode sombre / clair** avec persistance du choix

### 🎨 Interface
- Design moderne et responsive (mobile, tablette, desktop)
- Animations et transitions
- Thème sombre/clair
- Icônes Lucide React, toasts pour le feedback utilisateur

---

## 🛠️ Stack technique

| Couche      | Technologies |
|------------|--------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, @dnd-kit (drag & drop), Socket.io-client, React Hot Toast, Lucide React, date-fns, react-datepicker |
| **Backend**  | Node.js, Express, MongoDB (Mongoose), Socket.io, JWT (jsonwebtoken), bcryptjs, express-validator, dotenv, cors, multer, nodemailer (prévu) |
| **Architecture** | API REST, WebSockets pour le temps réel, middleware d’authentification, validation côté serveur |

---

## 📁 Structure du projet

```
Clone-Trello/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── AddMemberModal.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── FocusMode.tsx
│   │   │   ├── AdvancedSearch.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ProjectTemplates.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectBoard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   └── types/
│   │       └── index.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Backend (Node.js + Express)
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── notifications.js
│   └── server.js
│
├── package.json               # Scripts racine (dev, install:all, build, start)
├── README.md
├── QUICKSTART.md
└── LICENSE
```

---

## 🚀 Installation et démarrage

### Prérequis
- **Node.js** v18 ou supérieur
- **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** (ou yarn)

### 1. Cloner le dépôt

```bash
git clone https://github.com/VOTRE_USERNAME/Clone-Trello.git
cd Clone-Trello
```

### 2. Installer les dépendances

À la racine du projet (installe les dépendances du monorepo, du serveur et du client) :

```bash
npm run install:all
```

### 3. Configurer l’environnement

Créer un fichier `.env` dans le dossier `server/` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clone-trello
# ou avec MongoDB Atlas : MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/clone-trello
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Pour MongoDB local, s’assurer que le service MongoDB est démarré.

### 4. Démarrer l’application

**Mode développement** (backend + frontend en parallèle) :

```bash
npm run dev
```

- **Frontend** : http://localhost:5173  
- **Backend API** : http://localhost:5000  

**Démarrage séparé :**

```bash
# Terminal 1 – Backend
npm run dev:server

# Terminal 2 – Frontend
npm run dev:client
```

### 5. Build de production

```bash
npm run build
```

Les fichiers statiques du client sont générés dans `client/dist/`. Pour lancer uniquement le serveur en production :

```bash
npm start
```

---

## 📖 Utilisation

1. **Créer un compte** : Inscription (nom, email, mot de passe) puis connexion.
2. **Créer un projet** : Depuis le tableau de bord, cliquer sur « Nouveau Projet » (avec option de template).
3. **Ajouter des membres** : Dans un projet, utiliser « Membres » et rechercher des utilisateurs inscrits.
4. **Créer des tâches** : Dans le tableau Kanban, « Nouvelle Tâche » dans la colonne souhaitée.
5. **Déplacer les tâches** : Glisser-déposer entre les colonnes (À Faire → En Cours → Terminé).
6. **Détails et commentaires** : Cliquer sur une tâche pour modifier titre, description, priorité, date limite, assignation et ajouter des commentaires.
7. **Thème** : Utiliser l’icône lune/soleil pour basculer entre mode sombre et clair.

---

## 📡 API (endpoints principaux)

### Authentification
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Inscription |
| POST   | `/api/auth/login`    | Connexion   |
| GET    | `/api/auth/me`      | Utilisateur connecté (token requis) |

### Projets
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects`           | Liste des projets de l’utilisateur |
| GET    | `/api/projects/:id`       | Détails d’un projet |
| POST   | `/api/projects`           | Créer un projet |
| PUT    | `/api/projects/:id`       | Modifier un projet |
| DELETE | `/api/projects/:id`       | Supprimer un projet |
| POST   | `/api/projects/:id/members` | Ajouter un membre |
| DELETE | `/api/projects/:id/members/:memberId` | Retirer un membre |

### Tâches
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks/project/:projectId` | Liste des tâches d’un projet |
| POST   | `/api/tasks`                    | Créer une tâche |
| PUT    | `/api/tasks/:id`                | Modifier une tâche |
| PUT    | `/api/tasks/:id/move`           | Déplacer une tâche (changement de colonne) |
| DELETE | `/api/tasks/:id`                | Supprimer une tâche |
| POST   | `/api/tasks/:id/comments`       | Ajouter un commentaire |

### Utilisateurs
| Méthode | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users/search?q=...` | Recherche d’utilisateurs (pour inviter des membres) |

Les routes protégées nécessitent le header : `Authorization: Bearer <token>`.

---

## 🔒 Sécurité

- Mots de passe hashés avec **bcrypt**
- **JWT** pour l’authentification, avec expiration configurable
- Validation des entrées côté serveur (**express-validator**)
- Middleware d’authentification sur les routes sensibles
- **CORS** configuré (origine client autorisée)
- Pas de stockage de mots de passe en clair

---

## 🚀 Déploiement

- **Backend** : Déployer sur Railway, Render, Heroku, etc. en configurant `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (URL du frontend en production).
- **Frontend** : `npm run build` puis héberger `client/dist/` sur Vercel, Netlify, GitHub Pages, etc.
- **MongoDB** : Utiliser MongoDB Atlas en production et définir `MONGODB_URI` dans les variables d’environnement.

---

## 🐛 Dépannage

| Problème | Piste de solution |
|----------|-------------------|
| Erreur de connexion MongoDB | Vérifier que MongoDB est démarré et que `MONGODB_URI` dans `.env` est correct. |
| Port 5000 déjà utilisé | Arrêter l’autre processus ou changer `PORT` dans `server/.env`. |
| Socket.io / CORS | Vérifier que `CLIENT_URL` dans `.env` correspond à l’URL du frontend (ex. `http://localhost:5173`). |
| Erreur de build (client) | Supprimer `node_modules` dans `client/` et à la racine, puis relancer `npm run install:all`. |
| Node.js | Utiliser Node.js v18 ou supérieur. |

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour les détails.

---

## 👨‍💻 Auteur & contribution

Développé comme projet full stack démontrant une architecture moderne, la collaboration en temps réel et des bonnes pratiques (séparation front/back, validation, auth, UX).

Pour contribuer : fork du dépôt, création d’une branche, commits, puis ouverture d’une Pull Request.

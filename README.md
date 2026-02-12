# 🚀 Clone Trello - Application de Gestion de Projet

Une application web full stack moderne inspirée de Trello, permettant aux équipes de collaborer efficacement via des tableaux Kanban interactifs avec drag & drop en temps réel.

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Gestion des rôles (Admin / Membre)
- Authentification JWT

### 📊 Gestion des Projets
- Créer, modifier et supprimer des projets
- Ajouter des membres à un projet
- Recherche de projets
- Personnalisation des couleurs

### 📌 Tableau Kanban
- **3 colonnes** : À Faire (To Do), En Cours (Doing), Terminé (Done)
- **Drag & Drop** interactif pour déplacer les tâches entre colonnes
- Mise à jour en temps réel avec Socket.io

### ✅ Gestion des Tâches
- Créer, modifier et supprimer des tâches
- **Titre** et **description**
- **Date limite** avec indicateur de retard
- **Priorité** (Basse, Moyenne, Haute)
- **Assignation** des membres
- **Commentaires** sur les tâches
- Support des pièces jointes (structure prête)

### 🎨 Interface Moderne
- **Mode sombre/clair** avec toggle
- Design professionnel et créatif
- Responsive (mobile, tablette, desktop)
- Animations fluides

### 💬 Fonctionnalités Bonus
- Commentaires sur les tâches
- Notifications (structure prête)
- Recherche d'utilisateurs
- Mise à jour en temps réel

## 🛠️ Technologies

### Backend
- **Node.js** + **Express**
- **MongoDB** avec Mongoose
- **Socket.io** pour le temps réel
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

### Frontend
- **React 18** + **TypeScript**
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **@dnd-kit** pour le drag & drop
- **React Router** pour la navigation
- **Axios** pour les requêtes API
- **Socket.io-client** pour le temps réel
- **React Hot Toast** pour les notifications
- **Lucide React** pour les icônes

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Clone-Trello
```

2. **Installer les dépendances**
```bash
npm run install:all
```

3. **Configurer l'environnement**

Créez un fichier `.env` dans le dossier `server/` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clone-trello
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Démarrer MongoDB**
Assurez-vous que MongoDB est en cours d'exécution sur votre machine.

5. **Démarrer l'application**

En mode développement (backend + frontend) :
```bash
npm run dev
```

Ou séparément :
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

6. **Accéder à l'application**
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## 📁 Structure du Projet

```
Clone-Trello/
├── server/                 # Backend
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware (auth, etc.)
│   └── server.js          # Point d'entrée serveur
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages
│   │   ├── contexts/      # Contextes React
│   │   ├── types/         # Types TypeScript
│   │   └── App.tsx        # Composant principal
│   └── package.json
└── package.json           # Scripts racine
```

## 🎯 Utilisation

1. **Créer un compte** : Inscrivez-vous avec votre nom, email et mot de passe
2. **Créer un projet** : Cliquez sur "Nouveau Projet" depuis le dashboard
3. **Ajouter des membres** : Utilisez le bouton "Membres" dans un projet
4. **Créer des tâches** : Cliquez sur "Nouvelle Tâche" dans le tableau Kanban
5. **Déplacer les tâches** : Glissez-déposez les tâches entre les colonnes
6. **Commenter** : Ouvrez une tâche et ajoutez des commentaires
7. **Changer de thème** : Utilisez l'icône lune/soleil dans le header

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Validation des données côté serveur
- Protection des routes avec middleware
- CORS configuré

## 🚀 Déploiement

### Backend
1. Configurez les variables d'environnement de production
2. Utilisez MongoDB Atlas ou un serveur MongoDB
3. Déployez sur Heroku, Railway, ou similaire

### Frontend
```bash
cd client
npm run build
```
Les fichiers seront dans `client/dist/` à déployer sur Vercel, Netlify, etc.

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Projets
- `GET /api/projects` - Liste des projets
- `GET /api/projects/:id` - Détails d'un projet
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet
- `POST /api/projects/:id/members` - Ajouter un membre
- `DELETE /api/projects/:id/members/:memberId` - Retirer un membre

### Tâches
- `GET /api/tasks/project/:projectId` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `PUT /api/tasks/:id/move` - Déplacer une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `POST /api/tasks/:id/comments` - Ajouter un commentaire

### Utilisateurs
- `GET /api/users/search` - Rechercher des utilisateurs

## 🎨 Personnalisation

Les couleurs peuvent être modifiées dans :
- `client/tailwind.config.js` pour les couleurs du thème
- Les projets peuvent avoir des couleurs personnalisées

## 📄 Licence

MIT

## 👨‍💻 Développement

Développé avec ❤️ pour démontrer :
- Architecture full stack moderne
- Collaboration en temps réel
- Interface utilisateur professionnelle
- Bonnes pratiques de développement

---

**Phrase CV** : Développement d'une application collaborative de gestion de projet avec tableau Kanban interactif et drag-and-drop.

# 🚀 Guide de Démarrage Rapide

## Installation Rapide

1. **Installer toutes les dépendances**
```bash
npm run install:all
```

2. **Configurer MongoDB**
- Installez MongoDB localement ou utilisez MongoDB Atlas
- Pour MongoDB local : Assurez-vous que MongoDB tourne sur `mongodb://localhost:27017`

3. **Configurer les variables d'environnement**
```bash
cd server
cp .env.example .env
# Éditez .env et configurez vos variables
```

4. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:5000

## Première Utilisation

1. Créez un compte avec l'inscription
2. Créez votre premier projet
3. Ajoutez des membres (ils doivent d'abord s'inscrire)
4. Créez des tâches et déplacez-les avec le drag & drop
5. Utilisez le toggle pour passer en mode sombre/clair

## Structure des Colonnes Kanban

- **À Faire (To Do)** : Tâches à commencer
- **En Cours (Doing)** : Tâches en cours de réalisation
- **Terminé (Done)** : Tâches complétées

## Fonctionnalités Clés

✅ Drag & Drop entre colonnes
✅ Mise à jour en temps réel
✅ Mode sombre/clair
✅ Commentaires sur les tâches
✅ Assignation des membres
✅ Priorités et dates limites
✅ Recherche de projets

## Dépannage

**Erreur de connexion MongoDB** :
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans `.env`

**Erreur Socket.io** :
- Vérifiez que le port 5000 n'est pas utilisé
- Vérifiez CLIENT_URL dans `.env`

**Erreur de build** :
- Supprimez `node_modules` et réinstallez
- Vérifiez les versions de Node.js (v18+)

# Clone Trello

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248.svg)](https://www.mongodb.com/)

**Full-stack web application** inspired by Trello for team project management. Interactive Kanban boards, real-time collaboration, secure authentication, and a modern interface (dark/light mode, responsive).

---

## 📋 Project Description

Clone Trello is a collaborative platform for **planning, organizing, and tracking projects** through Kanban boards. Teams can create projects, invite members, manage tasks with priorities and due dates, move tasks via drag-and-drop between columns, and collaborate via comments and real-time updates.

This project demonstrates a **full-stack architecture** (React + Node.js), a **documented REST API**, the use of **WebSockets (Socket.io)** for real-time features, **JWT authentication**, and a **polished user interface** using Tailwind CSS and animations.

---

## ✨ Features

### 🔐 Authentication & Security

* Secure sign-up and login
* Hashed passwords (bcrypt)
* JWT authentication with expiration
* Role management (owner/member)

### 📊 Project Management

* Create, edit, and delete projects
* Project templates (Web, Mobile, Sprint Agile, custom)
* Invite members by searching users
* Role management (owner, members)

### 📌 Kanban Board

* **3 columns**: To Do, Doing, Done
* **Drag & Drop** functionality with @dnd-kit
* Real-time updates (Socket.io) for all collaborators

### ✅ Task Management

* Create, edit, delete tasks
* **Title**, **description**, **due date**, **priority** (Low, Medium, High)
* Assign tasks to one or more members
* **Comments** on tasks with real-time display
* Visual indicators for overdue or near-due tasks

### 💬 Collaboration & Bonus

* Comments on tasks
* **Activity Feed**: creations, modifications, movements, comments
* **Focus Mode**: show only tasks assigned to the logged-in user
* **Analytics Dashboard**: stats, priority/member distribution, overdue tasks
* **Dark/Light Mode** with persistent user choice

---

## 🛠️ Tech Stack

| Layer            | Technologies                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**     | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, @dnd-kit (drag & drop), Socket.io-client, React Hot Toast, Lucide React |
| **Backend**      | Node.js, Express, MongoDB (Mongoose), Socket.io, JWT (jsonwebtoken), bcryptjs, express-validator, dotenv, cors                         |
| **Architecture** | REST API, WebSockets for real-time, authentication middleware                                                                          |

---

## 🚀 Installation and Setup

### Prerequisites

* **Node.js** v18 or higher
* **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
* **npm** (or yarn)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Clone-Trello.git
cd Clone-Trello
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clone-trello
JWT_SECRET=your_very_long_and_secure_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Start the application

**Development mode**:

```bash
npm run dev
```

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### 5. Production build

```bash
npm run build
```

---

## 📖 Usage

1. **Create an account**: Sign-up (name, email, password), then log in.
2. **Create a project**: From the dashboard, click "New Project" (with template option).
3. **Add members**: In a project, use "Members" to search for users to invite.
4. **Create tasks**: On the Kanban board, "New Task" in the desired column.
5. **Move tasks**: Drag and drop between columns (To Do → Doing → Done).
6. **Details and comments**: Click on a task to edit title, description, priority, due date, assignee, and add comments.
7. **Theme**: Use the sun/moon icon to toggle between dark and light modes.

---



## 🔒 Security

* Passwords hashed with **bcrypt**
* **JWT** for authentication, with configurable expiration
* Server-side validation of inputs (**express-validator**)
* Authentication middleware on sensitive routes

---

## 🚀 Deployment

* **Backend**: Deploy to Railway, Render, Heroku, etc., setting `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (production frontend URL).
* **Frontend**: `npm run build`, then host `client/dist/` on Vercel, Netlify, GitHub Pages, etc.
* **MongoDB**: Use MongoDB Atlas in production and define `MONGODB_URI` in environment variables.

---

## 🐛 Troubleshooting

| Problem                  | Solution                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------- |
| MongoDB connection error | Ensure MongoDB is running and that `MONGODB_URI` in `.env` is correct.                  |
| Port 5000 already in use | Stop the other process or change `PORT` in `server/.env`.                               |
| Socket.io / CORS         | Ensure `CLIENT_URL` in `.env` matches the frontend URL (e.g., `http://localhost:5173`). |

---

## 📄 License

This project is licensed under the **MIT** license. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Contributions

Developed with ❤️ by himiko to showcase full-stack development skills.

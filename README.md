# Real-Time Chat Application

A full-stack **Real-Time Chat Application** built using **React**, **Node.js**, **Express.js**, **Socket.io**, and **MongoDB**.  
This application allows users to send and receive messages instantly in real time, fetch previous messages after refresh, and view timestamps for every message.

---

## Features

### Core Features
- Real-time messaging using **Socket.io**
- Send messages instantly
- Receive messages instantly without page refresh
- Fetch previous chat history after refreshing the app
- Display timestamps with each message
- Clean and responsive chat UI
- REST APIs for sending messages and fetching messages
- Graceful handling of socket connections and disconnections

### Bonus Features
- Dummy authentication / username-based login
- Online / offline user status
- Typing indicator
- Message delivery / read status
- Persistent chat history using MongoDB

---

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Socket.io Client
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB + Mongoose
- dotenv
- cors

---

## Folder Structure

```bash
REAL-TIME-CHAT-APPLICATION
│
├── backend
│   ├── src
│   │   ├── config          # Database connection and other configuration files
│   │   ├── controllers     # Request handling logic
│   │   ├── middleware      # Custom middleware
│   │   ├── models          # Mongoose models / schemas
│   │   ├── routes          # Express routes
│   │   ├── utils           # Helper functions / reusable utilities
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point + Socket.io server setup
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets          # Static assets
│   │   ├── components      # Reusable components
│   │   │   ├── layout
│   │   │   └── skeletons
│   │   ├── lib             # API calls / socket setup / utility functions
│   │   ├── pages           # Page-level components
│   │   ├── store           # State management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── package.json
└── README.md


Features:
Send messages in real time
Receive messages instantly using Socket.io
View previous messages after refreshing the application
Display message timestamps
REST API for sending messages
REST API for fetching chat history
Graceful handling of socket connections and disconnections
API Endpoints
Send Message

POST /api/messages/send

Fetch Chat History

GET /api/messages/:chatId

Note: Update endpoint names if your actual implementation uses different routes.

Environment Variables
Backend (backend/.env)
PORT=5001
MONGODB_URI=<your_mongodb_connection_string>
CLIENT_URL=http://localhost:5173
Frontend (frontend/.env)
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001

Project Setup Instructions
1. Clone the repository
git clone <your-github-repo-link>
cd REAL-TIME-CHAT-APPLICATION
Backend Setup
1. Move to backend folder
cd backend
2. Install dependencies
npm install
3. Create .env file inside backend folder

Add the following variables:

PORT=5001
MONGODB_URI=<your_mongodb_connection_string>
CLIENT_URL=http://localhost:5173
4. Run backend server
npm run dev

Backend will run on:

http://localhost:5001

Frontend Setup
1. Move to frontend folder
cd frontend
2. Install dependencies
npm install
3. Create .env file inside frontend folder

Add the following variables:

VITE_API_BASE_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
4. Run frontend server
npm run dev

Frontend will run on:

http://localhost:5173

Design Decisions
Socket.io was used for real-time communication so messages can be delivered instantly without page refresh.
MongoDB was used to persist chat messages and allow chat history to remain available after refresh.
The project is separated into frontend and backend folders for better maintainability and clear structure.
The backend follows a modular structure with separate folders for routes, controllers, models, middleware, and configuration files.

Assumptions Made
The application supports one-to-one chat.
Messages are stored in MongoDB with sender, receiver, text, and timestamp information.
Users are assumed to be authenticated / identified before sending messages.
Frontend and backend run on separate local ports during development.
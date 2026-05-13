# todo-app
Full-stack todo application with authentication, task management, and responsive UI

# Setup Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))

## Steps

### 1. Clone & install
```bash
git clone https://github.com/karanhirapara2-hue/todo-app.git
cd server && npm install
cd ../client && npm install
```

### 2. Create `server/.env`
```dotenv
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

> **Gmail users:** Use an [App Password](https://support.google.com/accounts/answer/185833), not your real password.

### 3. Run
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open **http://localhost:5173**

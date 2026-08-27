# e-Utilities Cost Management 💡💧🌐

A premium, modern web application for managing and tracking office utility expenses and budgets efficiently. This project uses a full-stack architecture with a React frontend and Node.js backend.

## 🚀 Features
- **Secure Authentication:** JWT-based login system for administrators.
- **Dynamic Dashboard:** Real-time summary charts (Bar & Doughnut) built with Chart.js.
- **Budget Categories:** Setup and limit different budget pools (Admin, IT, Emergency, etc.).
- **Expense Tracking:** Log daily expenses linked to specific budget categories.
- **Premium UI/UX:** Built with modern design principles, dark mode styling, and smooth animations.

## 🛠 Tech Stack
- **Frontend:** React (Vite), React Router, Chart.js, Vanilla CSS.
- **Backend:** Node.js, Express, Sequelize ORM, JWT, bcrypt.
- **Database:** MariaDB.
- **CI/CD:** GitHub Actions & Docker Hub.

---

## 💻 Getting Started (Local Development)

### 1. Start the Database
The project includes a `docker-compose.yml` file to quickly spin up a MariaDB instance.
```bash
docker-compose up -d
```

### 2. Setup the Backend (API)
The backend runs on **Port 5000**. Open a terminal in the `backend/` directory:
```bash
cd backend
npm install

# Seed the database with default Admin user and mock data
node seed-data.js

# Start the server
npm run dev
```

### 3. Setup the Frontend (UI)
The frontend runs on **Port 3000**. Open a new terminal in the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```

### 4. Login Credentials
Once both servers are running, visit `http://localhost:3000` and login with the default seeded credentials:
- **Username:** `admin`
- **Password:** `password123`

---

## 🐳 Docker Images

Pre-built images of this application are automatically pushed to Docker Hub and can be used directly for production deployment.

- **Frontend Image:** `henryrgb012/e-utilities-cost-frontend:latest`
- **Backend Image:** `henryrgb012/e-utilities-cost-backend:latest`

### Running via Docker
If you want to run the pre-built containers directly:
```bash
docker run -d -p 80:80 henryrgb012/e-utilities-cost-frontend:latest
docker run -d -p 5000:5000 henryrgb012/e-utilities-cost-backend:latest
```
*(Note: Ensure your backend container can communicate with a MariaDB database and configure environment variables as needed).*

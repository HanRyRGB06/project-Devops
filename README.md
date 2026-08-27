# e-utilities-cost

A full-stack web application for tracking and managing utility expenses, built with Node.js, Express, React, and MariaDB.

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed on your system

### Running the Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/e-utilities-cost.git
   cd e-utilities-cost
   ```

2. **Set up Environment Variables**
   Rename `.env.example` to `.env` in both `frontend` and `backend` directories and configure the necessary variables.

3. **Start the Application using Docker Compose**
   ```bash
   docker-compose up -d
   ```
   This will start the following services:
   - **Backend API**: http://localhost:3000
   - **Frontend App**: http://localhost:80
   - **MariaDB Database**: Exposed on port 3306
   - **phpMyAdmin**: http://localhost:8080

## 📁 Project Structure
- `backend/` - Node.js/Express REST API
- `frontend/` - React frontend application (Vite)
- `docs/` - Project documentation and plans
- `docker-compose.yml` - Container orchestration

## 🛠 Tech Stack
- **Frontend**: React, Vite, Recharts, TailwindCSS (optional/custom CSS)
- **Backend**: Node.js, Express, bcrypt, jsonwebtoken, mysql2
- **Database**: MariaDB
- **Infrastructure**: Docker & Docker Compose

## 📑 Documentation
Please refer to [docs/plan.md](./docs/plan.md) for detailed architecture, database schema, and sprint plans.

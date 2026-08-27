# 📌 เอกสารประกอบโปรเจกต์: ระบบควบคุมและติดตามค่าสาธารณูปโภค (e-utilities-cost)

ระบบเว็บแอปพลิเคชันสำหรับการบันทึก ติดตาม และสรุปผลค่าใช้จ่ายสาธารณูปโภคแบบ Full-stack (Backend + Frontend) พร้อมรองรับการทำงานในรูปแบบ Containerization (Docker) ตามกระบวนการ DevOps

---

## 📑 สารบัญ
1. [ภาพรวมของระบบ (System Overview)](#1-ภาพรวมของระบบ-system-overview)
2. [โครงสร้างระบบและสถาปัตยกรรม (Architecture & Tech Stack)](#2-โครงสร้างระบบและสถาปัตยกรรม-architecture--tech-stack)
3. [ออกแบบฐานข้อมูล (Database Schema Design)](#3-ออกแบบฐานข้อมูล-database-schema-design)
4. [แผนการทำงาน 8 Sprints (Development Milestones)](#4-แผนการทำงาน-8-sprints-development-milestones)
5. [โครงสร้างไดเรกทอรีของโปรเจกต์ (Project Structure)](#5-โครงสร้างไดเรกทอรีของโปรเจกต์-project-structure)
6. [คู่มือการติดตั้งและใช้งาน (Getting Started Guide)](#6-คู่มือการติดตั้งและใช้งาน-getting-started-guide)
7. [การสร้างและ Release Docker Image (Docker Hub Guide)](#7-การสร้างและ-release-docker-image-docker-hub-guide)
8. [ข้อกำหนดความปลอดภัยและการใช้งาน Git (Security & Git Best Practices)](#8-ข้อกำหนดความปลอดภัยและการใช้งาน-git-security--git-best-practices)

---

## 1. ภาพรวมของระบบ (System Overview)

**e-utilities-cost** เป็นระบบเว็บแอปพลิเคชันที่ออกแบบมาเพื่อช่วยบริหารจัดการ คุมยอด และติดตามค่าใช้จ่ายสาธารณูปโภค (เช่น ค่าน้ำ, ค่าไฟ, ค่าอินเทอร์เน็ต, ค่าโทรศัพท์ ฯลฯ) อย่างเป็นระบบ ช่วยให้ผู้ใช้สามารถ:
* บันทึกรายการค่าใช้จ่ายจริงพร้อมระบุหมวดเงินที่ใช้เบิกจ่าย
* ดูสรุปผลยอดรวมรายเดือนผ่านภาพกราฟแสดงผลแบบมีปฏิสัมพันธ์ (Interactive Charts)
* ออกรายงานย้อนหลังและเปรียบเทียบค่าใช้จ่ายระหว่างช่วงเวลาหรือระหว่างปี
* ใช้งานได้สมบูรณ์แบบบนทุกอุปกรณ์ (Responsive Design for Mobile, Tablet, Desktop)

---

## 2. โครงสร้างระบบและสถาปัตยกรรม (Architecture & Tech Stack)

### 🛠️ Technology Stack

| ส่วนประกอบ | เทคโนโลยีที่ใช้ | รายละเอียด |
| :--- | :--- | :--- |
| **Frontend** | React.js / Vue.js, TailwindCSS | ส่วนติดต่อผู้ใช้ พัฒนาแบบ SPA และ Responsive |
| **Backend** | Node.js (Express.js) | RESTful API สำหรับประมวลผลและบริหารจัดการข้อมูล |
| **Database** | MariaDB 10.11 | ระบบจัดการฐานข้อมูลแบบ relational |
| **Auth & Security**| JWT (JSON Web Token) & `bcrypt` | การยืนยันตัวตนและการเข้ารหัสรหัสผ่าน |
| **Containerization**| Docker & Docker Compose | จำลองสภาพแวดล้อมระบบพร้อมรองรับการสั่งงาน |
| **Registry** | Docker Hub | แหล่งเก็บและดึง Docker Image สำหรับการรันระบบ |

---

## 3. ออกแบบฐานข้อมูล (Database Schema Design)

### 📊 ตารางข้อมูลหลัก (Tables Definition)

#### 1. `users` (ตารางเก็บข้อมูลผู้ใช้งาน)
* `id` (INT, PK, Auto Increment)
* `username` (VARCHAR(50), Unique, Not Null)
* `password` (VARCHAR(255), Not Null) - *เก็บ Hashed Password จาก bcrypt*
* `name` (VARCHAR(100), Not Null)
* `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP)

#### 2. `expense_categories` (หมวดหมู่ประเภทค่าใช้จ่าย)
* `id` (INT, PK, Auto Increment)
* `name` (VARCHAR(100), Not Null) — *เช่น ค่าน้ำ, ค่าไฟ, ค่าอินเทอร์เน็ต*
* `description` (TEXT, Nullable)
* `created_at` (TIMESTAMP)

#### 3. `budget_categories` (หมวดเงินที่ใช้เบิกจ่าย)
* `id` (INT, PK, Auto Increment)
* `name` (VARCHAR(100), Not Null) — *เช่น งบดำเนินงาน, งบส่วนตัว, งบสำรองจ่าย*
* `budget_limit` (DECIMAL(10,2), Nullable)
* `created_at` (TIMESTAMP)

#### 4. `expenses` (รายการบันทึกค่าใช้จ่ายจริง)
* `id` (INT, PK, Auto Increment)
* `title` (VARCHAR(150), Not Null)
* `amount` (DECIMAL(10,2), Not Null)
* `expense_date` (DATE, Not Null)
* `expense_category_id` (INT, FK -> `expense_categories.id`)
* `budget_category_id` (INT, FK -> `budget_categories.id`)
* `note` (TEXT, Nullable)
* `user_id` (INT, FK -> `users.id`)
* `created_at` (TIMESTAMP)

---

## 4. แผนการทำงาน 8 Sprints (Development Milestones)

| Sprint | เป้าหมายหลัก (Key Objectives) | รายละเอียดงาน (Tasks Detail) |
| :---: | :--- | :--- |
| **Sprint 1** | Project Setup & Base DB | • ออกแบบ Database ER-Diagram<br>• จัดทำ `docker-compose.yml` สำหรับ MariaDB + phpMyAdmin<br>• เริ่มต้นโครงสร้างโปรเจกต์ Backend และ Frontend |
| **Sprint 2** | Authentication System | • พัฒนา API สำหรับ Login / Logout<br>• เข้ารหัส Password ด้วย `bcrypt`<br>• สร้าง JWT Authentication Middleware ป้องกัน Route |
| **Sprint 3** | Master Data Management (CRUD) | • สร้าง API และ UI สำหรับ CRUD `expense_categories`<br>• สร้าง API และ UI สำหรับ CRUD `budget_categories` |
| **Sprint 4** | Expense Transactions (CRUD) | • พัฒนาฟอร์มบันทึกค่าใช้จ่ายจริง (`expenses`) พร้อมเชื่อม Dropdown หมวดหมู่<br>• ทำตารางแสดงผล ค้นหา แก้ไข และลบรายการ |
| **Sprint 5** | Monthly Summary Dashboard | • พัฒนา API คำนวณยอดสรุปประจำเดือน<br>• สร้างหน้า Dashboard แสดงผลด้วย Chart.js/Recharts (เปรียบเทียบประเภท/หมวดเงิน) |
| **Sprint 6** | Reports & Responsive UI | • ทำหน้ารายงานย้อนหลัง เลือกช่วงเวลา (Date Range Filter)<br>• ปรับแต่ง UI ให้เป็น Responsive (Mobile/Tablet/Desktop) |
| **Sprint 7** | System Testing & Bug Fixing | • ทำ Manual Testing ตรวจสอบ Data Validation<br>• แก้ไขข้อผิดพลาดและปรับปรุง User Experience |
| **Sprint 8** | Dockerize, Push & Release | • เขียน `Dockerfile` ของ Backend และ Frontend<br>• Build & Push Image ขึ้น Docker Hub<br>• เขียนเอกสาร `README.md` และ `plan.md` ให้สมบูรณ์ |

---

## 5. โครงสร้างไดเรกทอรีของโปรเจกต์ (Project Structure)

```text
e-utilities-cost/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── plan.md
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 6. คู่มือการติดตั้งและใช้งาน (Getting Started Guide)

### 🚀 การรันในสภาวะ Development Local

1. **Clone Repository**
   ```bash
   git clone https://github.com/<your-username>/e-utilities-cost.git
   cd e-utilities-cost
   ```

2. **เตรียมไฟล์ Environment Variables**
   * คัดลอกไฟล์ `.env.example` เป็น `.env` ทั้งในโฟลเดอร์ `backend/` และ `frontend/`
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **รัน Database ด้วย Docker Compose**
   ```bash
   docker-compose up -d mariadb phpmyadmin
   ```

4. **ติดตั้ง Dependencies และสั่งรัน Backend / Frontend**
   ```bash
   # Backend
   cd backend && npm install && npm run dev

   # Frontend (เปิดอีก Terminal)
   cd frontend && npm install && npm run dev
   ```

---

## 7. การสร้างและ Release Docker Image (Docker Hub Guide)

### 🐋 การ Build และ Push Image ไปยัง Docker Hub

```bash
# 1. Login เข้าสู่ Docker Hub
docker login

# 2. Build Backend Image
docker build -t <your-dockerhub-username>/e-utilities-backend:v1.0.0 ./backend

# 3. Build Frontend Image
docker build -t <your-dockerhub-username>/e-utilities-frontend:v1.0.0 ./frontend

# 4. Push Image ขึ้น Docker Hub
docker push <your-dockerhub-username>/e-utilities-backend:v1.0.0
docker push <your-dockerhub-username>/e-utilities-frontend:v1.0.0
```

### 📦 คำสั่งสำหรับทดสอบ Pull และรันระบบผ่าน Docker Compose

```bash
docker compose up -d
```

---

## 8. ข้อกำหนดความปลอดภัยและการใช้งาน Git (Security & Git Best Practices)

> **กฎบังคับ 3 ข้อ** ที่ต้องปฏิบัติตามตลอดโปรเจกต์:
> 1. Commit งานสม่ำเสมอ — ห้าม Commit ครั้งเดียวทั้งโปรเจกต์
> 2. ต้องมี `.gitignore` ป้องกัน `node_modules/` และ `.env`
> 3. ห้าม Commit ไฟล์ `.env` หรือค่า Secret ขึ้น GitHub เด็ดขาด

---

### 8.1 ไฟล์ `.gitignore` (ต้องสร้างก่อน Commit แรก)

สร้างไฟล์ `.gitignore` ไว้ที่ Root ของโปรเจกต์ทันทีหลัง `git init` โดยต้องครอบคลุมเนื้อหาต่อไปนี้:

```gitignore
# ============================================================
# Dependencies — ห้ามขึ้น GitHub เด็ดขาด
# ============================================================
node_modules/
.pnp
.pnp.js

# ============================================================
# Environment Variables & Secrets — ห้ามขึ้น GitHub เด็ดขาด
# ============================================================
.env
.env.local
.env.development
.env.production
.env.test

# ============================================================
# Build Outputs
# ============================================================
dist/
build/
.next/
out/

# ============================================================
# Logs
# ============================================================
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# ============================================================
# OS & Editor
# ============================================================
.DS_Store
Thumbs.db
.vscode/
.idea/

# ============================================================
# Docker
# ============================================================
*.env.docker
```

> **หมายเหตุ**: ไฟล์ `.env.example` **ยกเว้น** จาก `.gitignore` เพราะเป็นเพียงโครงสร้างตัวแปรที่ไม่มีค่าจริง และต้อง Commit ขึ้น GitHub เพื่อให้ทีมอื่น Clone แล้วตั้งค่าตามได้

#### ตรวจสอบว่า `.gitignore` ทำงานถูกต้อง

```bash
# แสดงไฟล์ที่ Git กำลังจะ Track (ต้องไม่เห็น .env หรือ node_modules)
git status

# ทดสอบว่าไฟล์ถูก ignore จริง
git check-ignore -v backend/.env
git check-ignore -v backend/node_modules
```

---

### 8.2 วินัยในการ Commit (Commit Discipline)

**กฎ: ต้อง Commit ทุกครั้งที่งานชิ้นหนึ่งเสร็จ** ห้ามรอให้เสร็จทั้ง Sprint แล้วค่อย Commit ครั้งเดียว

#### รูปแบบ Commit Message (Conventional Commits)

```
<type>(<scope>): <คำอธิบายสั้น>
```

| Type | ความหมาย | ตัวอย่าง |
| :--- | :--- | :--- |
| `feat` | เพิ่มฟีเจอร์ใหม่ | `feat(auth): add JWT login endpoint` |
| `fix` | แก้ไข Bug | `fix(expense): correct decimal rounding` |
| `chore` | งาน Config/Setup | `chore: add .gitignore and .env.example` |
| `docs` | เพิ่ม/แก้ไขเอกสาร | `docs: update README with docker guide` |
| `style` | ปรับ UI/CSS | `style(dashboard): adjust chart colors` |
| `refactor` | ปรับโครงสร้างโค้ด | `refactor(api): extract db helper module` |
| `test` | เพิ่ม Test | `test(auth): add unit test for bcrypt hash` |

#### ตัวอย่าง Commit ที่ถูกต้องแยกตาม Sprint

```bash
# Sprint 1 — Project Setup
git commit -m "chore: initialize project structure and docker-compose for MariaDB"
git commit -m "chore: add .gitignore covering node_modules and .env files"
git commit -m "docs: add ER diagram and database schema design"

# Sprint 2 — Authentication
git commit -m "feat(auth): implement bcrypt password hashing on register"
git commit -m "feat(auth): add JWT token generation on login"
git commit -m "feat(middleware): create auth guard for protected routes"

# Sprint 3 — Master Data CRUD
git commit -m "feat(api): add CRUD endpoints for expense_categories"
git commit -m "feat(ui): build expense category management page"
git commit -m "feat(api): add CRUD endpoints for budget_categories"

# Sprint 4 — Expense Transactions
git commit -m "feat(expense): create expense entry form with category dropdowns"
git commit -m "feat(expense): add search, edit, and delete to expenses table"

# Sprint 5 — Dashboard
git commit -m "feat(api): add monthly summary aggregation endpoint"
git commit -m "feat(dashboard): integrate Chart.js for expense comparison charts"

# Sprint 6 — Reports & Responsive UI
git commit -m "feat(report): implement date range filter for expense history"
git commit -m "style: apply responsive layout for mobile and tablet views"

# Sprint 7 — Testing & Bug Fixes
git commit -m "fix(validation): enforce required fields on expense form"
git commit -m "fix(auth): resolve token expiry handling bug"

# Sprint 8 — Dockerize & Release
git commit -m "chore(docker): add Dockerfile for backend and frontend"
git commit -m "chore(docker): update docker-compose for full-stack deployment"
git commit -m "docs: finalize README.md and plan.md for project submission"
```

---

### 8.3 ห้าม Commit ไฟล์ `.env` หรือค่า Secret (Security Rules)

> **⚠️ ห้ามเด็ดขาด**: ไม่ว่ากรณีใดๆ ต้องไม่มีค่าจริงของ Secret ขึ้นบน GitHub

#### สิ่งที่ต้องทำ ✅

| สิ่งที่ถูกต้อง | รายละเอียด |
| :--- | :--- |
| Commit เฉพาะ `.env.example` | ใส่เฉพาะชื่อตัวแปร ไม่ใส่ค่าจริง เช่น `DB_PASSWORD=` |
| เก็บค่าจริงใน `.env` เครื่องตัวเอง | ไฟล์นี้ต้องอยู่ใน `.gitignore` เสมอ |
| ใช้ GitHub Secrets สำหรับ CI/CD | ตั้งค่าผ่าน Repository Settings → Secrets |

#### ตัวอย่าง `.env.example` ที่ถูกต้อง

```dotenv
# backend/.env.example
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=e_utilities_db
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=7d
```

```dotenv
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:3000/api
```

#### สิ่งที่ห้ามทำ ❌

```bash
# ❌ ห้าม commit ไฟล์ .env โดยตรง
git add .env
git add backend/.env

# ❌ ห้ามใส่ค่า secret ในโค้ดตรงๆ
const JWT_SECRET = "mysupersecretkey123"
const DB_PASSWORD = "admin1234"

# ❌ ห้าม commit node_modules
git add node_modules/
```

#### กรณีเผลอ Commit .env ไปแล้ว — วิธีแก้ไข

```bash
# 1. ลบ .env ออกจาก Git tracking (แต่ยังเก็บไว้ในเครื่อง)
git rm --cached backend/.env
git rm --cached frontend/.env

# 2. เพิ่ม .env เข้า .gitignore
echo "backend/.env" >> .gitignore
echo "frontend/.env" >> .gitignore

# 3. Commit การเปลี่ยนแปลง
git commit -m "fix: remove .env from tracking and update .gitignore"

# 4. เปลี่ยน Secret ทุกค่าที่หลุดออกไปทันที (สำคัญมาก!)
```

---

### 8.4 Checklist ก่อน Push ทุกครั้ง

```
✅ [ ] git status — ตรวจสอบว่าไม่มี .env หรือ node_modules ติดมา
✅ [ ] Commit message เป็นรูปแบบ Conventional Commits
✅ [ ] แต่ละ Commit มีขอบเขตงานชัดเจน ไม่รวมทุกอย่างในครั้งเดียว
✅ [ ] .gitignore ครอบคลุม node_modules/, .env, dist/
✅ [ ] มีแต่ .env.example ใน Repository ไม่มี .env จริง
```

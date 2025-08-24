# Student Grouping App — README

[![Node.js](https://img.shields.io/badge/Node.js-Express-informational)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-Front--End-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas/Local-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#license)

> A web application for creating and delivering online exams, computing results, analyzing statistics, and **auto-grouping students** into balanced or homogeneous groups based on exam percentage and/or a student's baseline grade.

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Setup & Run](#local-setup--run)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Data Schemas](#data-schemas)
- [Smart Grouping Algorithm](#smart-grouping-algorithm)
- [Security, Privacy & Accessibility](#security-privacy--accessibility)
- [Testing, Lint & Format](#testing-lint--format)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Diagrams & UML](#diagrams--uml)
- [Contributors & Maintainers](#contributors--maintainers)
- [License](#license)

---

## Overview
Teachers create multiple-choice exams and share them with students. Students take exams online and receive instant confirmation; teachers get **results, insights and automated grouping** to accelerate classroom differentiation and collaboration.

## Key Features
- Exam authoring (teacher) and online solving (student) with progress feedback.
- Automatic scoring and submission confirmation.
- Results dashboard: mean %, min/max %, score distribution, question difficulty.
- **Smart grouping**: *Balanced* (heterogeneous) or *Homogeneous* (level-based) using *Exam %* or *Student Grade*.
- Custom group names (e.g., Advanced / Intermediate / Foundation).
- Responsive RTL-friendly UI built with React-Bootstrap.

## Architecture
3-tier client–server architecture: **React (SPA)** ↔ **Express (REST API)** ↔ **MongoDB (Mongoose)**.
- **Use-Case Diagram (SVG):** https://kroki.io/plantuml/svg/eNplkkFqwzAQRfc6xeB97hAIoZuu4rTbMMgTRcSWijQiKSF3rxRbRpMu_5uH4H-0jYyB0zSqkc4M7CFYc2EYbCDN1juFmn2AI6G-UFhSz2kgx6o46MxI0C0IPoJPP9YZ6H8j09TBQwGkSBpjtg5kbMahA4zwtTvV3Dqf3lhXhVdor7tAyAT7O07VmVEhrXjEq9QKeJe-Ld1eEhwoppFjlcthQa3fT3mttWOVa_73cs_IuZ_V67uFRPVUy56w2YgZ6opvWNrzJlKdmfSaXaS8LiH9trO8rAUlnstsyQ35A_0BMqnGSQ
- **Class Diagram (SVG):** https://kroki.io/plantuml/svg/eNqdUrFOwzAU3P0VVsZKrejaqZVAbKiobIjhNXkKRrETPT_TCNR_58VO2oSGhc2-8909n731DMTBViqvwHv9gpC_I-lvpbUDi3qjD0zGlbJHC6YaA40oTjUVY8yH4wfmfIXOvfOBQ4GO_-9cEhSd6inYI9LF96EFG03ZcIW3uc8BPZvapTPY8tizbjrKC_SasDcB85pIrrBz_iRN3AT2eGfn5ehoJJkbKZdLQjlBpRNrmLHYdeH3wHgxe6Q6NNGr7FZJMtb-rsqbr4k3fCJJ3H422Br3BwHtHHFWw_tn60wvlzq7W60WWexYxaIHfB3xodsplzSpJjU8-yw5I4uFqFRLn3IlezO1RVfIn_0BYUjaBQ
- **Activity (Grouping) (SVG):** https://kroki.io/plantuml/svg/eNpNUctqwzAQvOsrlkDBgZbcbUJDU-ilLaXupceNvLbVWFojrfIAf3w3L8hFh9HM7OzsKglGyX4w0w-h7SlO5gyZsqaBrAAd0IMwdJHzWJly3TMngpD9hiJwe_lIj-C5IX1JorMn3uDsFmbrSCgEb2fSrDJTfUxCfjLlO2NzcceQ9hQTFH_sAiTJDQVRX2wozdWq5ig3OMHmCLbXCOE6CwqlWeW5FooPDQHLJbzggMFS8zwH6ZVa_KqVAShfXVLRJmumFHBLT3un27QcoSehyB0FcnKsDA2KF598VtXj4ARc0B4sB3Fd5pw0Rg7bdBGzv5OGxrXaAPvxNAd33cK7sPB4gAcYtbVbl1-6tea5Vqj-0KDgBhNVd_cov2nnaH9jsVZkI1Go9FI8mpWO0wP-A53BoKI
- **State Machine (Exam Attempt) (SVG):** https://kroki.io/plantuml/svg/eNpdkM0KwjAQhO95ijkL0ruCCJ68iOCx9hCbpQbyU3dTq4jvbloKVW_L7Mx8m2wlaU6ddyoPiXCI6TQoZCZhH44cGyaRSdhF3zrKBrwUsKKQ-FmgzmqXt1JHJuhg0BKLlbRWb1UuKiyXm-_yeRw3MwUrjCeBHtqrL32wzezs6i7eJpTaOdw6kmRjkEyWnphM9R_9JUxZb0VsaKaUVDiHAnKNPe7aWaOHThBzZDWjh7b8IrWlYPLHfQDyg3GG

## Tech Stack
- **Front-End:** React, React Router, React-Bootstrap, Axios, Sass/SCSS
- **Back-End:** Node.js, Express.js, JWT (jsonwebtoken), bcryptjs, cors, dotenv
- **DB:** MongoDB (Atlas/Local) with Mongoose ODM
- **Dev:** nodemon, ESLint, Prettier, Jest/RTL (optional)

## Repository Structure
```
student-grouping-app/
├─ backend/              # Express + Mongoose server
│  ├─ src/
│  │  ├─ models/         # Mongoose schemas (Teacher, Student, Exam, Question, Answer, Group)
│  │  ├─ controllers/    # Business logic (auth, exams, answers, groups)
│  │  ├─ routes/         # REST routing (auth, exams, answers, groups)
│  │  ├─ middleware/     # JWT auth, error handler
│  │  ├─ utils/          # helpers (e.g., grouping)
│  │  └─ server.js
│  └─ package.json
├─ frontend/             # React SPA
│  ├─ src/
│  │  ├─ pages/          # Screens (Login, Register, StudentDashboard, TeacherDashboard, ...)
│  │  ├─ components/     # UI components (Tables, Cards, Forms, Modals)
│  │  ├─ api/            # Axios client (baseURL, interceptors)
│  │  └─ index.jsx
│  └─ package.json
└─ README.md
```

## Prerequisites
- **Node.js** v18+
- **npm** v9+ / **pnpm** / **yarn**
- **MongoDB** local (27017) or **MongoDB Atlas**
- Recent browser (Chrome/Edge/Firefox)

## Local Setup & Run
```bash
# 1) Clone
git clone https://github.com/yazandahood8/student-grouping-app.git
cd student-grouping-app

# 2) Install deps
cd backend && npm install
cd ../frontend && npm install

# 3) Environment variables
#   - See 'Environment Variables' section; create .env files

# 4) Run server (dev)
cd backend
npm run dev   # nodemon server on port 5000

# 5) Run client (dev)
cd ../frontend
npm start     # React on port 3000, via proxy or REACT_APP_API_BASE_URL
```

## Environment Variables
**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_grouping_app
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env**
```
# If not using CRA proxy, set explicitly:
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints
All endpoints return JSON. Protected routes require `Authorization: Bearer <JWT>`.

### Auth
```
POST /api/auth/register   # create user (teacher/student)
POST /api/auth/login      # login (returns JWT + role)
```

### Exams
```
GET  /api/exams           # list exams
GET  /api/exams/:id       # exam details (incl. questions)
POST /api/exams           # (Teacher) create a new exam
```

### Answers
```
POST /api/answers         # (Student) submit answers for an exam
GET  /api/answers?examId= # (Teacher) list submissions for an exam
```

### Groups
```
POST /api/groups/make     # (Teacher) create smart groups
GET  /api/groups?examId=  # (Teacher) list groups for an exam
```

## Data Schemas
**Student**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "grade": 0
}
```

**Teacher**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "subject": "string"
}
```

**Question**
```json
{
  "text": "string",
  "options": ["A","B","C","D"],
  "correctAnswer": 0
}
```

**Exam**
```json
{
  "title": "string",
  "questions": ["ObjectId<Question>", "..."],
  "teacher": "ObjectId<Teacher>"
}
```

**Answer**
```json
{
  "exam": "ObjectId<Exam>",
  "student": "ObjectId<Student>",
  "items": [{"question":"ObjectId<Question>","selected":0,"correct":true}],
  "score": 8,
  "total": 10,
  "percentage": 80
}
```

**Group**
```json
{
  "exam": "ObjectId<Exam>",
  "groupNumber": 1,
  "name": "Advanced",
  "students": ["ObjectId<Student>", "..."],
  "size": 10,
  "averagePercentage": 86.5,
  "minPercentage": 62,
  "maxPercentage": 98
}
```

## Smart Grouping Algorithm
1. Load all exam **answers** and join **student.grade**.
2. Compute ranking metric: `percentage` or `grade`.
3. Sort students **descending** by metric.
4. **Balanced**: snake-wise distribution across groups to maximize heterogeneity.
5. **Homogeneous**: contiguous chunking to keep similar levels together.
6. Compute per-group stats (avg/min/max %) and persist to DB.
7. Group names: custom input or defaults (`Advanced/Intermediate/Foundation` or `Group A/B/C`).

## Security, Privacy & Accessibility
- **Auth & roles:** JWT (stateless). Middleware guards for teacher-only routes.
- **Passwords:** hashed with bcryptjs (salt ≥ 10).
- **CORS:** allow only the front-end origin.
- **Privacy:** students see only their own results; teachers see class-level data.
- **Accessibility (a11y):** React-Bootstrap components, ARIA labels, keyboard navigation, RTL support.
- **Performance:** O(n log n) sort + linear distribution; minimized API calls; client-side caching where applicable.

## Testing, Lint & Format
```bash
# Backend
cd backend
npm test        # Jest (if configured)
npm run lint    # ESLint
npm run format  # Prettier

# Frontend
cd ../frontend
npm test
npm run lint
npm run format
```

## Deployment
- **Backend:** any Node platform (Render/Heroku/Vercel serverless/VM). Provide `MONGO_URI` and `JWT_SECRET` as secrets.
- **Frontend:** static build (`npm run build`) for Vercel/Netlify/Nginx. Set `REACT_APP_API_BASE_URL` to prod API.
- **MongoDB:** Atlas cluster or secured self-hosted (IP allowlist, dedicated user, SRV URI).

## Roadmap
- ✅ Question analytics (hardest-first) and *Most missed option*.
- ✅ Custom group names.
- ⏳ CSV/Excel export (scores & groups).
- ⏳ PWA (offline + install).
- ⏳ Edit existing questions & shared bank.
- ⏳ Full i18n (HE/EN).

## Diagrams & UML
- Use-Case (SVG): https://kroki.io/plantuml/svg/eNplkkFqwzAQRfc6xeB97hAIoZuu4rTbMMgTRcSWijQiKSF3rxRbRpMu_5uH4H-0jYyB0zSqkc4M7CFYc2EYbCDN1juFmn2AI6G-UFhSz2kgx6o46MxI0C0IPoJPP9YZ6H8j09TBQwGkSBpjtg5kbMahA4zwtTvV3Dqf3lhXhVdor7tAyAT7O07VmVEhrXjEq9QKeJe-Ld1eEhwoppFjlcthQa3fT3mttWOVa_73cs_IuZ_V67uFRPVUy56w2YgZ6opvWNrzJlKdmfSaXaS8LiH9trO8rAUlnstsyQ35A_0BMqnGSQ
- Class (SVG): https://kroki.io/plantuml/svg/eNqdUrFOwzAU3P0VVsZKrejaqZVAbKiobIjhNXkKRrETPT_TCNR_58VO2oSGhc2-8909n731DMTBViqvwHv9gpC_I-lvpbUDi3qjD0zGlbJHC6YaA40oTjUVY8yH4wfmfIXOvfOBQ4GO_-9cEhSd6inYI9LF96EFG03ZcIW3uc8BPZvapTPY8tizbjrKC_SasDcB85pIrrBz_iRN3AT2eGfn5ehoJJkbKZdLQjlBpRNrmLHYdeH3wHgxe6Q6NNGr7FZJMtb-rsqbr4k3fCJJ3H422Br3BwHtHHFWw_tn60wvlzq7W60WWexYxaIHfB3xodsplzSpJjU8-yw5I4uFqFRLn3IlezO1RVfIn_0BYUjaBQ
- Activity — Grouping (SVG): https://kroki.io/plantuml/svg/eNpNUctqwzAQvOsrlkDBgZbcbUJDU-ilLaXupceNvLbVWFojrfIAf3w3L8hFh9HM7OzsKglGyX4w0w-h7SlO5gyZsqaBrAAd0IMwdJHzWJly3TMngpD9hiJwe_lIj-C5IX1JorMn3uDsFmbrSCgEb2fSrDJTfUxCfjLlO2NzcceQ9hQTFH_sAiTJDQVRX2wozdWq5ig3OMHmCLbXCOE6CwqlWeW5FooPDQHLJbzggMFS8zwH6ZVa_KqVAShfXVLRJmumFHBLT3un27QcoSehyB0FcnKsDA2KF598VtXj4ARc0B4sB3Fd5pw0Rg7bdBGzv5OGxrXaAPvxNAd33cK7sPB4gAcYtbVbl1-6tea5Vqj-0KDgBhNVd_cov2nnaH9jsVZkI1Go9FI8mpWO0wP-A53BoKI
- State Machine — Exam Attempt (SVG): https://kroki.io/plantuml/svg/eNpdkM0KwjAQhO95ijkL0ruCCJ68iOCx9hCbpQbyU3dTq4jvbloKVW_L7Mx8m2wlaU6ddyoPiXCI6TQoZCZhH44cGyaRSdhF3zrKBrwUsKKQ-FmgzmqXt1JHJuhg0BKLlbRWb1UuKiyXm-_yeRw3MwUrjCeBHtqrL32wzezs6i7eJpTaOdw6kmRjkEyWnphM9R_9JUxZb0VsaKaUVDiHAnKNPe7aWaOHThBzZDWjh7b8IrWlYPLHfQDyg3GG

## Contributors & Maintainers
- **Yazan Dawud** — <dahood.yazan8@gmail.com>
- **Maria El Heeb** — <mariahip3@gmail.com>



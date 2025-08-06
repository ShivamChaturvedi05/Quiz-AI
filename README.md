# QuizAI

**AI-Powered Quiz Platform**

QuizAI empowers teachers to auto-generate multiple-choice quizzes via OpenAI’s API, and enables students to take timed, scored quizzes with live leaderboards—all in a secure, full-stack application.

---

## 🌟 Key Features

* **AI-Generated MCQs**

  * Leverages OpenAI to craft customized questions based on topic, difficulty, and length.
* **Role-Based Authentication**

  * Separate flows for **Teachers** (create & review quizzes) and **Students** (take quizzes & view results).
* JWT-secured API with **bcrypt** password hashing.
* **Configurable Timer**

  * Quizzes auto-submit when time expires.
* **Real-Time Scoring & Persistence**

  * Scores stored in PostgreSQL; students see their results instantly.
* **Dynamic Leaderboards**

  * Top performers per quiz, visible to both students and teachers.
* **SPA UX**

  * Built with React + Vite for snappy navigation and responsive design.

---

## 🛠️ Tech Stack

| Layer        | Technologies                                        |
| ------------ | --------------------------------------------------- |
| **Frontend** | React, Vite, React Router, Axios, CSS Modules       |
| **Backend**  | Node.js, Express, JWT, bcrypt, `pg` (node-postgres) |
| **Database** | PostgreSQL                                          |
| **AI**       | OpenAI GPT (via `openai` SDK)                       |

---

## 📂 Project Structure

```
quiz-ai/
├── client/                        # React frontend
│   ├── public/                    # Static assets & index.html
│   └── src/
│       ├── api/                   # Axios instance + auth interceptor
│       ├── components/            # Reusable UI components
│       ├── context/               # Auth & global context
│       ├── pages/                 # Route pages (Dashboard, QuizTake…)
│       ├── styles/                # CSS modules
│       ├── App.jsx                # Main app component
│       └── main.jsx               # ReactDOM render
│   ├── package.json
│   └── vite.config.js
├── server/                        # Express backend
│   ├── controllers/               # Business logic (quiz, results, auth)
│   ├── db/                        # DB pool & schema migrations
│   ├── middleware/                # Auth & role-check middleware
│   ├── routes/                    # Express routers
│   ├── openai.js                  # OpenAI integration helper
│   ├── app.js                     # App initialization
│   └── package.json
└── README.md                      # This file
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/quiz-ai.git
cd quiz-ai
```

#### Backend

```bash
cd server
npm install
```

* Create `.env` with:

  ```
  DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB_NAME
  JWT_SECRET=your_jwt_secret
  OPENAI_API_KEY=your_openai_api_key
  ```

* Initialize your Postgres schema:

  ```bash
  psql $DATABASE_URL -f db/schema.sql
  ```

* Start the server:

  ```bash
  node app.js
  # Listening on http://localhost:4000
  ```

#### Frontend

```bash
cd ../client
npm install
```

* (Optional) Create `client/.env`:

  ```
  VITE_API_BASE_URL=http://localhost:4000/api
  ```
* Start the dev server:

  ```bash
  npm run dev
  # Open http://localhost:5173
  ```

---

## 🔗 API Endpoints

### Authentication

* `POST /api/auth/signup?role=teacher|student`
* `POST /api/auth/login?role=teacher|student`

### Quizzes

* `POST   /api/quizzes`              – Create quiz (Teacher)
* `GET    /api/quizzes/teacher`      – List teacher’s quizzes
* `GET    /api/quizzes/student`      – List student’s pending & completed
* `GET    /api/quizzes/:id`          – Quiz details + questions

### Results

* `POST   /api/results/:quizId/submit`      – Submit answers, compute & store score (Student)
* `GET    /api/results/student`             – Student’s past results
* `GET    /api/results/leaderboard/:quizId` – Top scores for a quiz

---


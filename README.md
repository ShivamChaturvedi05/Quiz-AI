```markdown
# QuizAI  
**Full-Stack AI-Powered Quiz Platform**  

QuizAI lets teachers auto-generate multiple-choice quizzes via the OpenAI API and students take timed, scored quizzes with dynamic leaderboards.  

---

## 🚀 Features  
- **AI MCQ Generation** using OpenAI GPT  
- **Role-Based Auth** (Teacher / Student) with JWT & bcrypt  
- **Configurable Timer** per quiz, auto-submit on expiry  
- **Real-Time Scoring** & persistent results  
- **Leaderboards** for each quiz (student & teacher views)  
- **Responsive SPA** built with React + Vite  

---

## 🛠 Tech Stack  
- **Frontend**: React, Vite, React Router, Axios, CSS Modules  
- **Backend**: Node.js, Express, JWT, bcrypt  
- **Database**: PostgreSQL (`node-postgres`)  
- **AI**: OpenAI GPT via `openai` SDK  

---

## 📁 Project Structure  
```

quiz-ai/
├── client/
│   ├── public/
│   └── src/
│       ├── api/        # Axios instance & auth interceptor
│       ├── components/ # UI components & pages
│       ├── context/    # Auth context
│       ├── pages/      # Route views
│       ├── styles/     # CSS modules
│       ├── App.jsx
│       └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/   # Quiz & result logic
│   ├── db/            # Postgres pool & migrations
│   ├── middleware/    # auth & role checks
│   ├── routes/        # Express routers
│   ├── openai.js      # GPT integration
│   ├── app.js         # Express setup
│   └── package.json
└── README.md

````

---

## ⚙️ Setup & Run  

### 1. Clone repo  
```bash
git clone https://github.com/your-username/quiz-ai.git
cd quiz-ai
````

### 2. Configure Environment

#### Server

Create `server/.env`:

```
DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB_NAME
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

#### Client

If you need a custom API URL, create `client/.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Initialize Database

```bash
# from project root
cd server
npm install
psql $DATABASE_URL -f db/schema.sql
```

### 4. Start Server

```bash
node app.js
# listens on http://localhost:4000
```

### 5. Start Client

```bash
cd ../client
npm install
npm run dev
# open http://localhost:5173
```

---

## 📝 API Endpoints

### Auth

* `POST /api/auth/signup?role=teacher|student`
* `POST /api/auth/login?role=teacher|student`

### Quizzes

* `POST   /api/quizzes` (teacher only)
* `GET    /api/quizzes/teacher` (teacher)
* `GET    /api/quizzes/student` (student)
* `GET    /api/quizzes/:id` (authenticated)

### Results

* `POST   /api/results/:quizId/submit` (student)
* `GET    /api/results/student`
* `GET    /api/results/leaderboard/:quizId`

---

```

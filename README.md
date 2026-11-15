# ACE: chat with your notes, flashcards and quizzes

> A study assistant that turns your own notes into answers, flashcards and quizzes.

**Status:** complete. ACE was built as a learning project and is no longer under active development. It stays online on free tiers, so it can be slow or reach its daily limits.

**Live demo:** https://ace-weld-rho.vercel.app/


## What it does

Upload your notes (`.txt`, `.md`, `.pdf`, `.docx`, `.pptx`) and ACE helps you study from them:

- **Chat with your notes.** Ask questions and get answers grounded in your own material. Conversations are saved, so you can reopen an old chat and keep going.
- **Flashcards.** Generate a set on a topic, flip through the cards, export them to a text file, and reopen old sets any time.
- **Quizzes.** Generate multiple-choice and true/false quizzes, retake them, and review exactly which answers were right or wrong, with explanations. Every attempt and score is saved.
- **Account system.** Register and log in, and your notes and history stay private to you.
- **Comfort details.** Responsive layout with a mobile drawer, five accent colors, and a feedback button.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Bootstrap Icons, Lucide |
| Backend | Python, FastAPI, SQLAlchemy 2.0, psycopg 3 |
| Database | PostgreSQL (Neon) |
| AI | OpenAI-compatible API client with automatic fallback: Google AI Studio (Gemini), Groq, OpenRouter (free models) |
| Auth | JWT in a cookie, password hashing with pwdlib |
| Hosting | Vercel (frontend), Render (backend), Neon (database), all on free tiers |

## How it works

1. **Upload.** Text is extracted from each file (PyMuPDF, python-docx, python-pptx) and stored in PostgreSQL per user.
2. **Ask.** The question is turned into keywords. Notes are ranked by keyword matches in the filename and body, and the most relevant paragraphs are selected.
3. **Remember.** The most recent messages of the conversation are loaded from the database, within a size budget, so the AI can handle follow-up questions.
4. **Answer.** The prompt (instructions, history, note excerpts, question) goes to an AI provider. If one provider is down or out of quota, the next one is tried.
5. **Save.** The question and answer are stored in the conversation.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for diagrams and design decisions.

## Project structure

```
backend/
  app/          app configuration
  auth/         token creation and verification, current-user dependency
  routes/       notes, chat, flashcards, quiz, retrieval, AI provider layer
  schemas/
  services/
frontend/
  src/
    components/ auth, chat, common, flashcards, home, profile, quiz
    config/     API URL, routes, themes
    pages/      one component per page
configs/        configuration files
data/           stop-word list used by retrieval
scripts/        legacy desktop prototype (not used by the web app)
tests/
main.py         FastAPI entry point
vercel.json     forwards /api/* to the backend and handles client-side routes
```

## Getting started

**Prerequisites:** Python 3.13+, Node.js 20+, a PostgreSQL database (a free [Neon](https://neon.tech) project works), and at least one API key from Google AI Studio, Groq or OpenRouter.

### 1. Clone and configure

```bash
git clone https://github.com/AbrarH4/Ace.git
cd Ace
cp .env.example .env     # then fill in the values
```

### 2. Backend

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs on http://localhost:8000 and interactive docs are at http://localhost:8000/docs. The tables are created automatically on startup.

### 3. Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173. In development the frontend calls `http://localhost:8000`. In production it calls `/api`, which Vercel forwards to the backend (see `vercel.json`).

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_KEY` | PostgreSQL connection string |
| `JWT_SECRET` | Secret that signs login tokens (at least 32 random characters, different for local and production) |
| Provider keys | One per AI provider; the exact names are read in `backend/routes/config.py` |

The backend refuses to start if `JWT_SECRET` is missing or shorter than 32 characters.

## API overview

| Area | Endpoints |
|---|---|
| Auth | `/auth/*` (register, login, logout, profile) |
| Notes | `POST /upload`, `GET /notes`, `DELETE /notes/{id}` |
| Chat | `POST /question_input`, `GET /conversations`, `GET /conversations/{id}`, `DELETE /conversations/{id}` |
| Flashcards | `POST /flashcards`, `GET /flashcards-set`, `GET /flashcards-set/{id}`, `DELETE /flashcards-set/{id}`, `POST /exportflashcard` |
| Quizzes | `POST /quiz`, `POST /quiz/evaluation`, `GET /quizzes`, `GET /quizzes/{id}`, `DELETE /quizzes/{id}`, `GET /quizzes/{id}/attempts`, `GET /quiz-attempts/{id}` |

All endpoints except registration and login require a logged-in user, and every query is filtered by the owner.

## Deployment

| Service | Settings |
|---|---|
| **Neon** | One PostgreSQL project, same region as the backend |
| **Render** | Web service. Build: `pip install -r requirements.txt`. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`. Environment variables as above |
| **Vercel** | Vite project from the repository root. `vercel.json` rewrites `/api/*` to the Render service |

Because the browser only talks to the Vercel domain, the login cookie is first-party and works on all browsers without extra cookie settings.

## What I learned building ACE

- **Free tiers shape the design.** A local embedding model did not fit in 512 MB of RAM, so retrieval became keyword-based, and AI calls fall back across three providers.
- **Never keep user data in global variables.** The first version kept chat memory in one server-wide list shared by every user. It is now stored per conversation in the database.
- **SQLite hides bugs that PostgreSQL does not.** Comparing a text user id with an integer column worked locally and failed after the move to PostgreSQL.
- **Real files are messy.** Some PDFs produce NUL bytes that PostgreSQL refuses to store. Uploads now clean the text and skip files that fail.
- **Cookies across domains are hard.** Proxying `/api` through the frontend host avoided blocked third-party cookies.
- **Secrets belong in the environment.** An early version had the signing secret in the source code.
- **Quotas are part of the product.** A per-user daily limit plus a global cap protect the free AI keys.

## Known limitations

- Retrieval is keyword-based, not semantic, so paraphrased questions can miss the right note.
- Quiz grading uses the quiz sent by the browser, and correct answers are sent along with the questions. That is fine for a study tool, but not for graded exams.
- There are daily quotas but no per-minute rate limiting.
- Notes are sent to third-party AI providers. Do not upload sensitive documents.
- Free hosting means cold starts and occasional busy periods.

## Ideas if you fork it

- Semantic search with embeddings from a hosted API, stored in PostgreSQL
- Server-side quiz grading that ignores the quiz sent by the browser
- A rolling summary for very long chats
- Profile statistics and a settings page
- Automated tests and a CI pipeline

## License

MIT. See [LICENSE](LICENSE).

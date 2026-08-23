# Ace

> Turn your notes into a conversation.

Ace is an AI-powered study workspace that helps students learn directly from
their own study material.

Instead of searching through multiple files, students can upload their notes,
ask questions about them, generate interactive quizzes, and create AI-powered
flashcards for revision.

Ace combines keyword matching, semantic search, embeddings, and
Retrieval-Augmented Generation (RAG) to retrieve relevant information from
uploaded notes before generating an answer.

---

## Features

### 📚 Ask Questions About Your Notes

Ask questions in natural language and get answers based on your uploaded
study material.

Ace retrieves relevant sections from your notes before sending context to
the AI, helping keep responses focused on the user's material.

### 🔎 Hybrid Retrieval

Ace combines:

- Keyword matching
- Semantic similarity
- Embeddings
- Retrieval-Augmented Generation (RAG)

This allows the system to find relevant information even when the wording of
a question differs from the wording in the original notes.

### 📂 Multi-File Retrieval

Questions can retrieve relevant information across multiple uploaded files,
allowing students to work with larger collections of study material.

### 🧠 Grounded AI Answers

Instead of sending an entire collection of notes to the AI, Ace first
retrieves the most relevant sections and provides those sections as context.

This helps:

- Reduce irrelevant context
- Keep answers focused
- Improve retrieval efficiency
- Reduce unnecessary token usage

### 📝 Interactive Quizzes

Generate quizzes directly from your study material.

Supported question types:

- True / False
- Multiple Choice
- Mixed

Users can select the topic and number of questions before starting a quiz.

After submitting an answer, Ace provides immediate feedback and allows users
to review their results.

### 🗂️ AI-Generated Flashcards

Generate flashcards from uploaded study material for quick revision.

Flashcards can be reviewed interactively and exported in a format compatible
with Anki.

### 🔐 Authentication

Ace includes:

- User authentication
- Protected routes
- Session-based authentication
- JWT-based authentication
- Cookies
- Persistent user data

### 💾 Persistent Database

Ace uses SQLite for persistent application data.

### ⚡ Embedding Caching

Previously generated embeddings can be cached so the application does not
need to unnecessarily recompute them.

This improves efficiency when working with previously processed material.

---

# How It Works

Ace follows a retrieval-first approach.

```text
                    ┌─────────────────┐
                    │   Study Notes   │
                    │   PDF / Files   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Note Processing  │
                    │   & Chunking    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Embeddings   │
                    │  + Keyword Data │
                    └────────┬────────┘
                             │
                             ▼
User Question ─────► ┌─────────────────┐
                     │ Hybrid Retrieval│
                     │ Keyword +       │
                     │ Semantic Search │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Relevant Chunks │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │    OpenAI API   │
                     │ Context-Grounded│
                     │    Generation   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │     Answer      │
                     └─────────────────┘
Retrieval Pipeline
The user uploads their study notes.
Ace processes the uploaded material.
The material is divided into searchable sections.
Embeddings are generated for semantic retrieval.
Keyword information is also used for lexical matching.
The user asks a question.
Ace searches for relevant content using both keyword matching and semantic
similarity.
The most relevant sections are selected.
Only the relevant context is provided to the AI.
The AI generates a response using the retrieved material.

This retrieval process helps prevent the entire note collection from being
unnecessarily passed to the model.

Architecture

Ace uses a separate frontend and backend architecture.

┌─────────────────────────────┐
│          Frontend           │
│                             │
│     React + TypeScript      │
│          HTML/CSS           │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           Backend           │
│                             │
│          FastAPI            │
│                             │
│ ┌─────────┐ ┌─────────────┐ │
│ │  Auth   │ │ Note        │ │
│ │         │ │ Processing  │ │
│ └─────────┘ └─────────────┘ │
│                             │
│ ┌─────────┐ ┌─────────────┐ │
│ │Retrieval│ │ Quiz /      │ │
│ │  + RAG  │ │ Flashcards  │ │
│ └─────────┘ └─────────────┘ │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌─────────────┐ ┌─────────────┐
│   SQLite    │ │  OpenAI API │
│  Database   │ │             │
└─────────────┘ └─────────────┘
Technical Approach
Hybrid Search

Ace does not rely on a single retrieval technique.

It combines lexical and semantic retrieval.

Keyword Matching

Keyword matching helps identify content containing terms directly related to
the user's query.

This is useful when the question contains specific names, terminology,
definitions, or technical phrases.

Semantic Search

Semantic embeddings allow Ace to find content based on meaning rather than
only exact word matches.

For example, a question and a note can use different wording while still
referring to the same concept.

Combined Retrieval

Using both approaches gives Ace multiple ways to identify relevant content.

                 User Question
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      Keyword Matching     Semantic Search
             │                   │
             └─────────┬─────────┘
                       ▼
                Ranked Results
                       │
                       ▼
                Relevant Context
                       │
                       ▼
                    LLM / RAG
Quizzes

Ace can generate interactive quizzes from uploaded study material.

Users can select:

Topic
Number of questions
Question type
Supported Types
True / False

Questions with two possible answers.

Multiple Choice

Questions with multiple answer choices.

Mixed

A combination of supported question types.

Quiz Flow
Study Material
      ↓
Select Topic
      ↓
Select Number of Questions
      ↓
Select Question Type
      ↓
Generate Quiz
      ↓
Answer Questions
      ↓
Instant Feedback
      ↓
Review Results
Flashcards

Ace can generate flashcards from study material.

The flashcard system is designed for active recall and quick revision.

Flashcard Flow
Study Material
      ↓
Flashcard Generation
      ↓
Interactive Review
      ↓
Export
      ↓
Anki-Compatible Format

Flashcards can be generated from the user's study material and exported for
continued use with Anki.

Authentication

Ace includes protected user functionality.

The authentication system uses a combination of:

Sessions
JWTs
Cookies
Protected routes

Authenticated users can access their protected application functionality
while unauthenticated users are restricted from protected resources.

Database

Ace uses SQLite as its persistent database.

The database is used to store application data required by the system,
including user-related information and other persistent application state.

SQLite keeps the project simple to deploy while providing persistent storage
without requiring a separate database server.

Embedding Caching

Generating embeddings repeatedly can be unnecessary when the same material
has already been processed.

Ace therefore includes embedding caching to avoid unnecessary recomputation.

New Material
     │
     ▼
Check Cache
  /       \
Found     Missing
 │          │
 ▼          ▼
Reuse    Generate
Embedding Embedding
 │          │
 └────┬─────┘
      ▼
   Retrieval

This can reduce repeated processing when users work with previously
processed material.

Project Structure

The repository is organized into separate frontend, backend, testing,
configuration, documentation, and utility areas.

Ace/
│
├── backend/          # FastAPI backend and server-side functionality
│
├── frontend/
│   └── src/          # React + TypeScript frontend
│
├── configs/          # Project configuration
│
├── data/             # Application/data-related resources
│
├── docs/             # Documentation and project resources
│
├── scripts/          # Utility and development scripts
│
├── tests/            # Automated tests
│
├── Ace.py            # Project entry/utility script
├── Launcher.py       # Launcher utility
├── Export_flashcard.py
│                      # Flashcard export functionality
│
├── requirements.txt  # Python dependencies
├── requirements-dev.txt
│                      # Development dependencies
│
├── package.json      # Frontend/package configuration
├── vite.config.ts    # Vite configuration
│
├── eslint.config.js  # ESLint configuration
│
├── pytest.ini        # Pytest configuration
│
├── LICENSE
├── SECURITY.md
└── README.md
Technology Stack
Frontend
React
TypeScript
JavaScript
HTML5
CSS3
Vite
Backend
Python
FastAPI
REST APIs
SQLite
AI & Retrieval
OpenAI API
Embeddings
Semantic Search
Keyword Matching
Retrieval-Augmented Generation (RAG)
Embedding Caching
Development & Testing
Git
GitHub
Pytest
ESLint
Running Ace Locally
Prerequisites

Before running Ace locally, make sure you have:

Python installed
Node.js and npm installed
Git installed
An OpenAI API key configured according to the project's environment
configuration
1. Clone the Repository
git clone https://github.com/AbrarH4/Ace.git
cd Ace
2. Install Backend Dependencies
pip install -r requirements.txt

For development and testing dependencies:

pip install -r requirements-dev.txt
3. Configure Environment Variables

Create the required environment configuration according to the backend
configuration used by the project.

Do not commit secrets or API keys to Git.

For example:

OPENAI_API_KEY=your_api_key_here

Use the variable names expected by the current backend implementation.

4. Start the Backend

Start the FastAPI backend using the project's configured development
command.
1. cd backend
2. uvicorn app.main:app --reload
The exact command may depend on the project's current backend entry point
and configuration.

5. Install Frontend Dependencies

From the frontend/project directory containing package.json:

npm install
6. Start the Frontend
Run the configured development command:

npm run dev

The frontend will then connect to the running backend API according to the
project's configuration.

Testing

Ace includes an automated test suite covering core application
functionality.

Run the tests with:

pytest

For more verbose output:

pytest -v
Security

Security-related configuration and policies are documented in
SECURITY.md.

Never commit:

API keys
Passwords
JWT secrets
Private credentials
.env files containing secrets
Private user data
Development

The project follows a frontend/backend architecture so that the user
interface and server-side functionality can evolve independently.

Frontend Responsibilities

The frontend handles:

User interface
User interactions
Authentication flows
Note interactions
Quiz interfaces
Flashcard interfaces
API communication
Backend Responsibilities

The backend handles:

Authentication
Database operations
Note processing
Retrieval
Embedding-related functionality
AI requests
Quiz generation
Flashcard generation
API endpoints
What I Learned

Building Ace involved combining several technologies and concepts into one
application.

Through the project, I worked with:

React
TypeScript
Python
FastAPI
REST APIs
Authentication
Protected routes
JWTs
Sessions
Cookies
SQLite
Embeddings
Semantic search
Keyword retrieval
Retrieval-Augmented Generation
Embedding caching
AI-powered quiz generation
AI-powered flashcard generation
Frontend/backend integration
Automated testing

One of the biggest lessons from the project was learning how individual
frontend, backend, database, authentication, and AI components fit together
to form a complete application.

Future Improvements

Ace is designed to be expanded beyond its current functionality.

Potential future improvements include:

🤖 AI-Powered Note Generation

Automatically generate structured study notes, summaries, and revision
material from uploaded content.

🎯 Specialized Examination Sessions

Create focused exam-style sessions based on a student's selected subject or
topic.

📊 Performance Analytics

Track quiz performance and identify topics where a student may need more
practice.

💾 Persistent Note Library

Allow users to maintain a long-term library of uploaded study material
instead of repeatedly uploading files.

🔎 Improved Retrieval

Further improve retrieval quality through better ranking, chunking,
filtering, and retrieval strategies.

📱 Improved Cross-Device Experience

Continue improving the interface and accessibility across different screen
sizes and devices.

Hackathon

Ace was developed as a student project for Reverie Hacks 2026.

The project focuses on making study material more interactive by combining
personal notes with AI-powered retrieval, quizzes, and flashcards.

License

This project is licensed under the MIT License.

See LICENSE for details.

Author

Built independently by Abrar H.

GitHub: @AbrarH4

Acknowledgements

Ace uses open-source technologies and APIs that make the project possible,
including React, FastAPI, SQLite, and OpenAI technologies.
```

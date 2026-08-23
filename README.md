# Ace

Turn your notes into a conversation.

Ace is an AI-powered study workspace that helps students learn directly from their own notes. Instead of searching through multiple files to find an answer, users can ask questions and get responses based on their uploaded study material.

Ace also provides interactive quizzes and AI-generated flashcards to help students revise and test their understanding.

## Features

- Ask questions about your own notes
- Semantic search for relevant content
- Keyword matching combined with semantic retrieval
- Answers grounded in the user's notes
- Multi-file note retrieval
- Interactive quiz generation
- True/False, Multiple Choice, and Mixed quizzes
- Instant quiz feedback
- AI-generated flashcards
- Flashcard export compatible with Anki
- User authentication and protected routes
- Session and JWT-based authentication
- Persistent database using SQLite
- Embedding caching to avoid unnecessary recomputation

---

## How It Works

1. The user uploads their study notes.
2. Ace processes the notes and creates searchable representations.
3. The user asks a question.
4. Ace uses keyword matching and semantic similarity to find relevant content.
5. The most relevant sections are selected.
6. Only the relevant context is provided to the AI.
7. The AI generates an answer based on the retrieved notes.

This retrieval process helps keep answers focused on the user's own study material.

---

## Quizzes

Ace can generate interactive quizzes from the user's notes.

Users can choose:

- Topic
- Number of questions
- Question type

Supported question types:

- True/False
- Multiple Choice
- Mixed

After answering, users receive immediate feedback and can review their results.

---

## Flashcards

Ace can generate flashcards from study material for revision.

Users can go through the cards interactively and export generated flashcards in a format compatible with Anki.

---

## Technology Stack

### Frontend

- React
- TypeScript
- JavaScript
- HTML5
- CSS3

### Backend

- Python
- FastAPI
- SQLite

### AI / Retrieval

- OpenAI API
- Semantic embeddings
- Semantic search
- Keyword matching
- Retrieval-Augmented Generation (RAG)

---

## Project Structure

Ace uses a separate frontend and backend architecture.

The frontend handles the user interface and interactions, while the FastAPI backend handles authentication, database operations, note processing, retrieval, and AI-related functionality.

---

## Running Ace

Clone the repository:

```bash
git clone https://github.com/AbrarH4/Ace.git
cd Ace
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Follow the project configuration instructions and start the backend.

Then start the frontend using the appropriate development command for the React application.

---

## What I Learned

Ace was my first project where I combined a frontend and backend into one larger application.

While building it, I learned about:

- React and TypeScript
- FastAPI and Python
- REST APIs
- Authentication and protected routes
- JWTs, sessions, and cookies
- SQLite databases
- Semantic search and embeddings
- RAG systems
- Embedding caching
- Connecting frontend and backend systems

---

## Future Improvements

Some features I would like to explore in future versions include:

- AI-powered note generation
- Specialized examination sessions
- Performance reports highlighting weak topics
- Persistent notes so users do not need to upload them repeatedly
- Further improvements to retrieval accuracy and the overall study experience

---

## License

MIT License

---

## Author

Built independently by Abrar H.

```

```

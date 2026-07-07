# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-07-02
### Added
- Quiz mode — generate multiple-choice and true/false quizzes from your notes, with topic filtering, scoring, and instant feedback.
- Standalone `.exe` release via PyInstaller, with a branded splash-screen launcher.
- Folder validation — the app now warns and re-prompts if the selected notes folder is empty or contains no supported file types, instead of silently accepting it.

## [1.0.0] - 2026-06-15
### Added
- Initial release of the AI Study Assistant prototype.
- Keyword and semantic search engine using sentence-transformers.
- Multi-provider API cascade (Gemini, Groq, OpenRouter).
- Custom high-contrast CustomTkinter UI.
- Secure credential management using `.env`.

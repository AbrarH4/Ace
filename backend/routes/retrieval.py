"""Keyword extraction and note-ranking pipeline (keyword-only version)."""

import json

from backend.routes.config import STOP_WORDS_FILE


def load_stop_words():
    """Load the list of common English stop words from STOP_WORDS.json."""
    try:
        with open(STOP_WORDS_FILE, "r", encoding="utf-8") as file:
            word_list = json.load(file)
            return set(word_list)

    except FileNotFoundError:
        print("WARNING: STOP_WORDS.json not found.")
        return set()

    except Exception as e:
        print(f"Failed to load stop words: {e}")
        return set()


Stop_words = load_stop_words()


def keyword(question: str = None) -> list:
    """Extract content-bearing keywords from a question."""
    if question is None:
        return []

    keywords = []
    for word in question.split():
        cleaned = word.strip("?!.,;:\"'()[]").lower()
        if cleaned and cleaned not in Stop_words:
            keywords.append(cleaned)
    return keywords


def get_relevant_chunks(file_content, keywords, top_k=5, max_chars=6000):
    """Return the paragraphs of a note that best match the keywords.

    Paragraphs are scored by how often the keywords appear in them. The best
    ones are returned in their original order so the AI sees coherent text.
    """
    paragraphs = [
        p.strip() for p in file_content.split("\n") if len(p.strip()) > 30
    ]
    if not paragraphs:
        return file_content[:max_chars]

    scored = []
    for index, paragraph in enumerate(paragraphs):
        lowered = paragraph.lower()
        score = sum(lowered.count(word) for word in keywords)
        scored.append((score, index))

    best = sorted(scored, key=lambda item: item[0], reverse=True)[:top_k]
    chosen_indexes = sorted(index for score, index in best)
    text = "\n\n".join(paragraphs[i] for i in chosen_indexes)
    return text[:max_chars]


def Ranking_System(keywords, question, notes):
    """Rank notes by keyword matches and return the top 3 filenames."""
    scores = {}

    for filename, content in notes.items():
        if filename.lower() == "error.txt":
            continue

        filename_lower = filename.lower()
        content_lower = content.lower()
        score = 0

        for word in keywords:
            if word in filename_lower:
                score += 20
            score += min(content_lower.count(word), 10)

        scores[filename] = score

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    return [filename for filename, score in ranked[:3]]
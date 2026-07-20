from scripts import loader
import scripts.retrieval as retrieval
from scripts.quiz import get_quiz_context

from scripts.quiz import test_evaluation as evaluate_answer


# --- test_evaluation() -------------------------------------------------

def test_correct_answer_matches_bare_letter():
    result = evaluate_answer("A", "A", "explanation text")
    assert result["correct"] is True


def test_correct_answer_matches_full_option_string():
    # The quiz UI passes full option strings like "A. Photosynthesis";
    # only the letter before the period should be compared.
    result = evaluate_answer("A", "A. Photosynthesis", "explanation text")
    assert result["correct"] is True


def test_answer_comparison_is_case_insensitive():
    result = evaluate_answer("True", "TRUE", "explanation text")
    assert result["correct"] is True


def test_wrong_answer_is_marked_incorrect():
    result = evaluate_answer("A", "B. Respiration", "explanation text")
    assert result["correct"] is False


def test_answer_with_surrounding_whitespace_is_still_matched():
    result = evaluate_answer("A", "  A. Photosynthesis  ", "explanation")
    assert result["correct"] is True


def test_result_dict_preserves_original_inputs_unmodified():
    result = evaluate_answer("A", "A. Photosynthesis", "It converts light to energy.")
    assert result["user_answer"] == "A. Photosynthesis"
    assert result["correct_answer"] == "A"
    assert result["explanation"] == "It converts light to energy."


# --- get_quiz_context() -------------------------------------------------

def test_get_quiz_context_returns_none_when_no_notes_loaded():
    assert get_quiz_context("any topic") is None


def test_get_quiz_context_without_topic_concatenates_all_notes():
    loader.Notes["a.txt"] = "Content A"
    loader.Notes["b.txt"] = "Content B"

    context = get_quiz_context("")

    assert "SOURCE: a.txt" in context
    assert "Content A" in context
    assert "SOURCE: b.txt" in context
    assert "Content B" in context


def test_get_quiz_context_with_topic_uses_only_winning_files(monkeypatch):
    loader.Notes["a.txt"] = "Photosynthesis converts light into energy."
    loader.Notes["b.txt"] = "Mitochondria is the powerhouse of the cell."

    monkeypatch.setattr(retrieval, "keyword", lambda topic: ["photosynthesis"])
    monkeypatch.setattr(
        retrieval, "Ranking_System", lambda keywords, topic: (["a.txt"], "encoded-topic")
    )
    monkeypatch.setattr(
        retrieval, "get_relevant_chunks", lambda content, encoded: "relevant chunk"
    )

    context = get_quiz_context("photosynthesis")

    assert "SOURCE: a.txt" in context
    assert "relevant chunk" in context
    assert "b.txt" not in context  # only the ranked winner should be included


def test_get_quiz_context_returns_none_when_ranking_finds_nothing(monkeypatch):
    loader.Notes["a.txt"] = "Some content"
    monkeypatch.setattr(retrieval, "keyword", lambda topic: ["nomatch"])
    monkeypatch.setattr(retrieval, "Ranking_System", lambda keywords, topic: None)

    assert get_quiz_context("nomatch") is None

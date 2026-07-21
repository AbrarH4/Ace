from unittest.mock import MagicMock

from scripts import loader
import scripts.retrieval as retrieval


# --- keyword() ------------------------------------------------------------

def test_keyword_filters_stop_words(monkeypatch):
    monkeypatch.setattr(retrieval, "Stop_words", {"the", "is", "of"})
    result = retrieval.keyword("What is the powerhouse of the cell?")
    assert "the" not in result
    assert "is" not in result
    assert "powerhouse" in result
    assert "cell?" not in result  # punctuation is stripped from the output token
    assert "cell" in result


def test_keyword_strips_punctuation_and_lowercases(monkeypatch):
    monkeypatch.setattr(retrieval, "Stop_words", set())
    result = retrieval.keyword("Photosynthesis!  Mitochondria?")
    assert result == ["photosynthesis", "mitochondria"]


def test_keyword_filters_stopwords_with_trailing_punctuation(monkeypatch):
    # Regression test: the stop-word check now runs on the word after
    # punctuation is stripped, so "the," (with a trailing comma) correctly
    # matches the stop word "the" and gets filtered out.
    monkeypatch.setattr(retrieval, "Stop_words", {"the"})
    result = retrieval.keyword("the, cell")
    assert "the" not in result
    assert result == ["cell"]


# --- get_relevant_chunks() -------------------------------------------------

def test_get_relevant_chunks_falls_back_to_raw_slice_when_no_long_paragraphs():
    short_content = "line one\nline two\nline three"
    result = retrieval.get_relevant_chunks(short_content, encoded_question="unused")
    assert result == short_content[:3000]


def test_get_relevant_chunks_falls_back_when_content_is_empty():
    assert retrieval.get_relevant_chunks("", encoded_question="unused") == ""


def test_get_relevant_chunks_selects_top_k_by_similarity(monkeypatch):
    long_para_1 = "A" * 60
    long_para_2 = "B" * 60
    long_para_3 = "C" * 60
    content = f"{long_para_1}\n{long_para_2}\n{long_para_3}"

    fake_model = MagicMock()
    fake_model.encode.return_value = "encoded-paragraphs"
    monkeypatch.setattr(loader, "model", fake_model)

    mock_scores = MagicMock()
    mock_topk_result = MagicMock()
    mock_topk_result.indices.tolist.return_value = [1]
    mock_scores.topk.return_value = mock_topk_result
    monkeypatch.setattr(retrieval.util, "cos_sim", lambda q, p: [mock_scores])

    result = retrieval.get_relevant_chunks(content, encoded_question="q", top_k=1)
    assert result == long_para_2


# --- Ranking_System() -------------------------------------------------------

class FakeTensor:
    """Stand-in for a sentence-transformer embedding tensor."""

    def __init__(self, value):
        self.value = value


def test_ranking_system_boosts_filename_matches_and_semantic_similarity(monkeypatch):
    loader.Notes.update(
        {
            "photosynthesis.txt": "Photosynthesis converts light into chemical energy.",
            "unrelated.txt": "Some unrelated content about volcanoes.",
        }
    )
    loader.Embedding_cache.update(
        {
            "photosynthesis.txt": FakeTensor("photo-emb"),
            "unrelated.txt": FakeTensor("volcano-emb"),
        }
    )

    fake_model = MagicMock()
    fake_model.encode.return_value = FakeTensor("question-emb")
    monkeypatch.setattr(loader, "model", fake_model)

    def fake_cos_sim(question_emb, note_emb):
        score = 0.9 if note_emb.value == "photo-emb" else 0.1
        result = MagicMock()
        result.item.return_value = score
        return result

    monkeypatch.setattr(retrieval.util, "cos_sim", fake_cos_sim)

    best_notes, _ = retrieval.Ranking_System(["photosynthesis"], "What is photosynthesis?")

    # Filename match (+20) and higher semantic similarity should rank first.
    assert best_notes[0] == "photosynthesis.txt"


def test_ranking_system_excludes_error_txt_from_results(monkeypatch):
    loader.Notes.update({"error.txt": "placeholder", "real.txt": "real content"})
    loader.Embedding_cache.update(
        {"error.txt": FakeTensor("e"), "real.txt": FakeTensor("r")}
    )

    fake_model = MagicMock()
    fake_model.encode.return_value = FakeTensor("q")
    monkeypatch.setattr(loader, "model", fake_model)

    result_mock = MagicMock()
    result_mock.item.return_value = 0.5
    monkeypatch.setattr(retrieval.util, "cos_sim", lambda q, n: result_mock)

    best_notes, _ = retrieval.Ranking_System(["real"], "question")

    assert "error.txt" not in best_notes
    assert "real.txt" in best_notes


def test_ranking_system_returns_empty_list_when_only_error_txt_is_loaded(monkeypatch):
    # Regression test: when every note is excluded (here, only the reserved
    # "error.txt" placeholder remains), Final_Scores ends up empty and
    # Ranking_System now returns an empty list rather than the bare string
    # "error.txt"; matching the tuple shape callers rely on.
    loader.Notes["error.txt"] = "placeholder"
    fake_model = MagicMock()
    fake_model.encode.return_value = "encoded"
    monkeypatch.setattr(loader, "model", fake_model)

    result = retrieval.Ranking_System(["anything"], "question")

    assert result == ([], "encoded")


def test_ranking_system_shows_error_dialog_and_returns_none_when_no_keywords(monkeypatch):
    monkeypatch.setattr(loader.messagebox, "showerror", MagicMock())
    assert retrieval.Ranking_System([], "question") is None

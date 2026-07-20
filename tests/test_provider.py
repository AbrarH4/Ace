from unittest.mock import MagicMock

import pytest

from scripts import provider


@pytest.fixture(autouse=True)
def reset_chat_history():
    provider.chat_history.clear()
    yield
    provider.chat_history.clear()


def make_fake_response(content):
    fake_message = MagicMock()
    fake_message.content = content
    fake_choice = MagicMock()
    fake_choice.message = fake_message
    fake_response = MagicMock()
    fake_response.choices = [fake_choice]
    return fake_response


# --- chat history bookkeeping ------------------------------------------

def test_turn_to_history_appends_pair():
    provider.turn_to_history("What is X?", "X is Y.")
    assert len(provider.chat_history) == 1
    user_msg, assistant_msg = provider.chat_history[0]
    assert user_msg == {"role": "user", "content": "What is X?"}
    assert assistant_msg == {"role": "assistant", "content": "X is Y."}


def test_chat_history_evicts_oldest_turn_beyond_maxlen():
    for i in range(6):
        provider.turn_to_history(f"q{i}", f"a{i}")
    assert len(provider.chat_history) == 5
    assert provider.chat_history[0][0]["content"] == "q1"  # q0 was evicted


def test_get_messages_prepends_system_prompt_and_includes_history():
    provider.turn_to_history("q1", "a1")
    messages = provider.get_messages("SYSTEM PROMPT")
    assert messages[0] == {"role": "system", "content": "SYSTEM PROMPT"}
    assert messages[1] == {"role": "user", "content": "q1"}
    assert messages[2] == {"role": "assistant", "content": "a1"}


# --- GenerateAnswer(): provider fallback cascade ------------------------

def test_generate_answer_uses_first_available_provider(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response("The answer.")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    result = provider.GenerateAnswer("What is X?", "context")

    assert result == "The answer."
    assert provider.chat_history[-1][1]["content"] == "The answer."


def test_generate_answer_falls_back_to_next_provider_on_failure(monkeypatch):
    monkeypatch.setattr(
        provider,
        "PROVIDERS",
        [
            {"name": "Broken", "url": "http://x", "key": "key", "model": "m"},
            {"name": "Working", "url": "http://y", "key": "key", "model": "m"},
        ],
    )
    broken_client = MagicMock()
    broken_client.chat.completions.create.side_effect = Exception("connection refused")
    working_client = MagicMock()
    working_client.chat.completions.create.return_value = make_fake_response("Fallback answer.")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(side_effect=[broken_client, working_client]))

    result = provider.GenerateAnswer("q", "context")
    assert result == "Fallback answer."


def test_generate_answer_returns_failure_message_when_all_providers_fail(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Broken", "url": "http://x", "key": "key", "model": "m"}]
    )
    broken_client = MagicMock()
    broken_client.chat.completions.create.side_effect = Exception("down")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=broken_client))

    result = provider.GenerateAnswer("q", "context")
    assert result == "CRITICAL FAILURE: All providers exhausted."


def test_generate_answer_skips_cloud_provider_with_no_api_key(monkeypatch):
    monkeypatch.setattr(
        provider,
        "PROVIDERS",
        [
            {"name": "Google AI Studio", "url": "http://x", "key": None, "model": "m"},
            {"name": "Working", "url": "http://y", "key": "key", "model": "m"},
        ],
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response("ok")
    openai_mock = MagicMock(return_value=fake_client)
    monkeypatch.setattr(provider, "OpenAI", openai_mock)

    result = provider.GenerateAnswer("q", "context")

    assert result == "ok"
    assert openai_mock.call_count == 1  # the keyless provider was never instantiated


# --- GenerateQuiz(): two-stage JSON parsing ------------------------------

def test_generate_quiz_parses_clean_json_array(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    quiz_json = '[{"question": "Q1", "options": ["A. x", "B. y"], "answer": "A", "explanation": "e"}]'
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response(quiz_json)
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    result = provider.GenerateQuiz("context", quiz_count=1)
    assert result[0]["question"] == "Q1"


def test_generate_quiz_recovers_json_wrapped_in_stray_text(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    messy_response = (
        "Sure, here is your quiz:\n"
        '[{"question": "Q1", "options": [], "answer": "A", "explanation": "e"}]\n'
        "Hope that helps!"
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response(messy_response)
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    result = provider.GenerateQuiz("context", quiz_count=1)
    assert result[0]["question"] == "Q1"


def test_generate_quiz_returns_none_when_response_is_unparseable(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response("not json at all")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    assert provider.GenerateQuiz("context", quiz_count=1) is None


def test_generate_quiz_rejects_empty_array(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response("[]")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    assert provider.GenerateQuiz("context", quiz_count=1) is None


# --- generateFlashcard(): shares GenerateQuiz's parsing pattern ----------

def test_generate_flashcard_happy_path(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    flashcard_json = '[{"front": "Term", "back": "Definition"}]'
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = make_fake_response(flashcard_json)
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    result = provider.generateFlashcard("context", flashcard_count=1)
    assert result[0]["front"] == "Term"


def test_generate_flashcard_returns_none_when_all_providers_fail(monkeypatch):
    monkeypatch.setattr(
        provider, "PROVIDERS", [{"name": "Test", "url": "http://x", "key": "key", "model": "m"}]
    )
    fake_client = MagicMock()
    fake_client.chat.completions.create.side_effect = Exception("down")
    monkeypatch.setattr(provider, "OpenAI", MagicMock(return_value=fake_client))

    assert provider.generateFlashcard("context", flashcard_count=1) is None

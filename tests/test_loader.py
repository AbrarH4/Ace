import json
from unittest.mock import MagicMock

from scripts import loader


# --- has_supported_files() -------------------------------------------------

def test_has_supported_files_true_when_supported_extension_present(tmp_path):
    (tmp_path / "notes.txt").write_text("hello")
    (tmp_path / "image.png").write_bytes(b"not a note")
    assert loader.has_supported_files(str(tmp_path)) is True


def test_has_supported_files_false_when_only_unsupported_extensions(tmp_path):
    (tmp_path / "image.png").write_bytes(b"not a note")
    assert loader.has_supported_files(str(tmp_path)) is False


def test_has_supported_files_false_on_empty_folder(tmp_path):
    assert loader.has_supported_files(str(tmp_path)) is False


# --- get_hash() -------------------------------------------------------------

def test_get_hash_is_stable_for_unchanged_content(tmp_path):
    f = tmp_path / "a.txt"
    f.write_text("same content")
    assert loader.get_hash(str(f)) == loader.get_hash(str(f))


def test_get_hash_changes_when_content_changes(tmp_path):
    f = tmp_path / "a.txt"
    f.write_text("version one")
    hash_before = loader.get_hash(str(f))
    f.write_text("version two")
    hash_after = loader.get_hash(str(f))
    assert hash_before != hash_after


# --- load_folder_path() -----------------------------------------------------
# Note: `isolate_loader_state` (conftest.py, autouse) already points
# loader.SETTINGS_FILE at a tmp_path file for every test in this module.

def test_load_folder_path_skips_dialog_when_settings_already_valid(tmp_path, monkeypatch):
    notes_folder = tmp_path / "notes"
    notes_folder.mkdir()
    loader.SETTINGS_FILE.write_text(json.dumps({"path_notes": str(notes_folder)}))

    dialog_mock = MagicMock()
    monkeypatch.setattr(loader.filedialog, "askdirectory", dialog_mock)

    result = loader.load_folder_path()

    assert result == str(notes_folder)
    dialog_mock.assert_not_called()


def test_load_folder_path_ignores_stale_settings_pointing_to_missing_folder(tmp_path, monkeypatch):
    missing_folder = tmp_path / "deleted"  # never created
    loader.SETTINGS_FILE.write_text(json.dumps({"path_notes": str(missing_folder)}))

    fallback_folder = tmp_path / "fallback"
    fallback_folder.mkdir()
    (fallback_folder / "a.txt").write_text("content")
    monkeypatch.setattr(
        loader.filedialog, "askdirectory", MagicMock(return_value=str(fallback_folder))
    )

    result = loader.load_folder_path()
    assert result == str(fallback_folder)


def test_load_folder_path_prompts_and_persists_when_settings_missing(tmp_path, monkeypatch):
    notes_folder = tmp_path / "notes"
    notes_folder.mkdir()
    (notes_folder / "a.txt").write_text("content")

    monkeypatch.setattr(
        loader.filedialog, "askdirectory", MagicMock(return_value=str(notes_folder))
    )

    result = loader.load_folder_path()

    assert result == str(notes_folder)
    assert json.loads(loader.SETTINGS_FILE.read_text())["path_notes"] == str(notes_folder)


def test_load_folder_path_returns_none_when_dialog_cancelled(monkeypatch):
    monkeypatch.setattr(loader.filedialog, "askdirectory", MagicMock(return_value=""))
    assert loader.load_folder_path() is None


def test_load_folder_path_reprompts_on_empty_folder_then_succeeds(tmp_path, monkeypatch):
    empty_folder = tmp_path / "empty"
    empty_folder.mkdir()
    good_folder = tmp_path / "good"
    good_folder.mkdir()
    (good_folder / "notes.md").write_text("content")

    monkeypatch.setattr(
        loader.filedialog,
        "askdirectory",
        MagicMock(side_effect=[str(empty_folder), str(good_folder)]),
    )
    monkeypatch.setattr(loader.messagebox, "showwarning", MagicMock())

    result = loader.load_folder_path()
    assert result == str(good_folder)

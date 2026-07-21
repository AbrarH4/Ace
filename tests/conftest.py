"""Shared fixtures for the Ace test suite.

scripts/loader.py keeps Notes, Embedding_cache, and the loaded model as
module-level globals, and scripts/config.py fixes SETTINGS_FILE /
EMBEDDINGS_CACHE_FILE to the real user config directory at import time
(and even creates that directory as an import side effect). Left alone,
tests would leak state into each other and write files into the developer's
actual ~/.config/Ace (or %APPDATA%/Ace) folder.
"""

import pytest

from scripts import loader


@pytest.fixture(autouse=True)
def isolate_loader_state(tmp_path, monkeypatch):
    loader.Notes.clear()
    loader.Embedding_cache.clear()
    loader.Notes_Cache.clear()

    # loader.py imported these names directly from scripts.config, so they
    # must be patched on `loader`, not on `config`; patching config's copy
    # would not affect the name loader.py already bound at import time.
    monkeypatch.setattr(loader, "SETTINGS_FILE", tmp_path / "settings.json")
    monkeypatch.setattr(loader, "EMBEDDINGS_CACHE_FILE", tmp_path / "embeddings_cache.pkl")

    yield

    loader.Notes.clear()
    loader.Embedding_cache.clear()
    loader.Notes_Cache.clear()

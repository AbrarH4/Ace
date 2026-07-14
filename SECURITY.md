# Security Policy

## Supported Versions

Ace is under active solo development. Only the latest released version receives fixes, there is no long-term support branch.

| Version  | Supported |
| -------- | --------- |
| latest   | ✅        |
| < latest | ❌        |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities.

Use GitHub's private vulnerability reporting instead: go to the **Security** tab of this repository → **Report a vulnerability**. This lets you share details privately with the maintainer without exposing an unpatched issue to other users.

If private reporting isn't available for any reason, open an issue with minimal detail and ask for a way to share the full report privately instead.

This is a solo project without a dedicated security team or formal SLA, but reports will be acknowledged and addressed on a best-effort basis.

## Known Limitations

Ace is a local, single-user desktop application. A few design choices are worth knowing if you're evaluating it for a shared or sensitive environment:

- The embedding cache (`embeddings.pkl`) is loaded with Python's `pickle`, which can execute arbitrary code if the file is ever loaded from an untrusted or shared source. This is safe as long as the cache stays local to your own machine.
- The packaged `.exe` launcher starts the main executable from a path relative to its own location, which assumes the install directory isn't writable by untrusted users.
- API keys for cloud providers (Gemini, Groq, OpenRouter) are read from a local `.env` file and are sent only to the configured provider's API, never anywhere else.

These are reasonable trade-offs for a personal, local-first tool, but aren't intended for multi-user or networked deployment as-is.

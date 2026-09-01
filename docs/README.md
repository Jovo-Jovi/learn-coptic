# docs/

| File | What it is | Who updates it |
|---|---|---|
| `rules.md` | Engineering rules. Mirrors `.cursor/rules/` in plain form. | Human |
| `models.md` | Which AI model does which step, and why. | Human |
| `skills.md` | Reusable prompt patterns for Cursor. | Human |
| `security.md` | Secrets, licensing, privacy, dependency policy. | Human |
| `session-context.md` | Live project state. Paste at the start of a chat. | Every session |
| `journal.md` | Append-only log of every step. | Every session |
| `decisions.md` | ADRs. One-way doors only. | On decision |
| `glossary.md` | Coptic + project terms. | As needed |
| `content-style.md` | Arabic voice, transliteration, naming. | As needed |
| `sources.md` | External word/prayer corpora. Search first; do not dump. | On harvest |
| `review-checklist.md` | What the reviewer checks. | Rarely |

Rule: `session-context.md` and `journal.md` are updated in the same commit as
the work they describe. A step is not done until they are current.

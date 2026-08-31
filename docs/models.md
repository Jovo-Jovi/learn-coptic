# Model routing

Cursor writes code. Claude in chat reviews. Two vendors are used on purpose —
agreement between them is a weak signal, disagreement is a strong one.

| Step | Model | Why |
|---|---|---|
| S1 letter map | Strongest available, then the **other vendor** re-checks the table independently | One-way door. A wrong glyph propagates into every page, quiz, and prayer. |
| S2 vocabulary | Same as S1 | Same. ~145 items, each a chance to invent a meaning. |
| S3–S8 UI | Any | Ordinary component work. |
| S9 deploy | Any | Mechanical. |
| S13 prayers | Strongest | Liturgical text. Errors are worse than bugs. |
| S14 art | Any | Judgement is human anyway. |
| S15 grammar | Strongest | Linguistic content, not code. |

## Rules

- A model never resolves a data conflict. It presents options; a human picks.
- On any Coptic content step, run the same prompt on both vendors and diff the
  two outputs before accepting either.
- Record the model used in `journal.md`. When something turns out wrong later,
  that column is how you find the other things to re-check.

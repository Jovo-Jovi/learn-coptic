# Reviewer checklist

The validator catches structure. These are the things that compile fine and are
still wrong.

## Every step

- [ ] Was any file in `src/data/json/**` touched? If yes, was it in scope?
- [ ] Any value that looks filled-in-from-memory rather than extracted?
- [ ] `athanasiusKey` leaking into rendered output?
- [ ] Group colors hardcoded in a component instead of read from tokens?
- [ ] Coptic or Latin string not wrapped in an LTR isolate?
- [ ] New dependency added without a stated reason?
- [ ] Did the agent claim a command passed without showing its output?

## Content steps

- [ ] Does the Arabic read like speech or like a translation?
- [ ] Is a `drill` word presented anywhere as dictionary vocabulary?
- [ ] Does a drill with `meaning: null` get a fake gloss in the UI?
- [ ] Does any image lack a `license`?
- [ ] Does any prayer line lack a source?

## Before deploy

- [ ] Lighthouse mobile: performance ≥ 90, accessibility ≥ 95
- [ ] Tested on a real phone
- [ ] `/about` lists every font and content licence actually in use

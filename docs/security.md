# Security and licensing

No backend, no accounts, no user data. Most risk here is licensing, not attack.

## Licensing (the real risk)

- **Fonts in use** (self-hosted via `next/font`; listed on `/about`):
  - **GNU FreeSerif** — GPL-3.0-or-later WITH Font-exception-2.0.
    Coptic glyphs (serif). Default Unicode face. The file in
    `src/app/fonts/FreeSerif.ttf` is a *subset* of GNU FreeFont 20120503
    (cmap probe: U+2C80, U+2C81, U+03E2, U+03EF, U+0304, U+0305).
    A subset is a modification. Font-exception-2.0 covers embedding
    *unaltered* portions; we extend that exception to this subset in
    `src/app/fonts/NOTICE`. `COPYING` and `README` stay beside the TTF.
    The app licence stays MIT (ADR-013).
  - **Noto Sans Coptic** — SIL Open Font License 1.1. Fallback if FreeSerif
    misses a codepoint. Optional سانس picker face.
  - **Athanasius Plain** — mapped Latin cmap, optional أثناسيوس picker.
    File `src/app/fonts/Athanasuis-Plain.ttf` (see `ATHANASIUS.txt`).
    Cmap has no U+2C80. Paint is `athanasiusKey` only (ADR-015). Owner
    authorized shipping this local copy on 2026-08-31. A written licence
    from copticchurch.net was requested 2026-08-29 and is not yet a grant.
  - **Cairo** — SIL Open Font License 1.1. Arabic UI. A SemiBold subset
    (`Cairo-SemiBold.ttf`) is used to rasterise the WhatsApp / Open Graph
    preview. See `src/app/fonts/CAIRO.txt`.

- **Other mapped fonts — not shipped.** No file on this machine, so they
  stay out. Same copticchurch.net / Evertype requests as before:
  - CS Avva Shenouda, Pope Shenouda III, CS Pishoi, CS New Athanasius
  - Antinoou — Michael Everson / Evertype
  - `Coptic1.ttf` from the old explorer — unknown keymap, not shipped

- **Artwork.** Every image needs a `license` value at the moment it is added.
  Backfilling this later is not realistically possible. S14 is teaching-set
  concrete nouns only. Generated art uses `ai-generated` plus `provenance`
  (model, prompt, date) — ADR-019.
- **Dictionary harvest.** Andreas lemmas via remnqymi are **CC BY-SA 4.0**
  (same family as site content). Unique Osama Thabet northern-dialect
  lemmas (Internet Archive `CopticArabicDictionary`, **Public Domain Mark
  1.0** as labelled by the uploader) are in `words.json` only when they
  are not already stored (ADR-023). Do not dump Dawoud scans (including
  Internet Archive OCR), Naqlun CopDic, Coptic Reader, Tasbeha, or St-Takla
  into `words.json` without a grant. Do not ingest the mapped notepad file
  or the Andreas PDFs bundled on the same Archive item.
- **Recordings.** Letter-name clips in `public/audio/letters/` come from
  Coptic Literacy MP4s. Owner authorized church reuse on 2026-09-01
  (ADR-016). Credit on `/about`. Word and prayer reciters still need
  written consent before those files publish.
- **Prayer texts.** Note the source edition in `prayers.json`.

## Secrets

None needed for MVP. If that changes: `.env.local` only, never committed, and
Vercel env vars for anything server-side. Preview deploys are publicly
reachable — nothing unreleased goes in `public/`.

## Privacy

`localStorage` only, namespaced `learn-coptic:*` (theme, Coptic face,
Leitner `learn-coptic:leitner`). No personal data, no login.
Analytics must be cookieless and IP-anonymised, or absent. No third-party
script that can read page content.

## Dependencies

Lockfile committed. No new dependency without a stated reason. `npm audit` and
a manual look at anything with fewer than ~100k weekly downloads before adding.
Prefer zero-dependency over convenient.

These 25 ids are accepted for the adoption tree only. No package was added and
no version changed. This is not a patch. `src/app/icon.tsx` and
`src/app/apple-icon.tsx` call `ImageResponse` from `next/og` with a constant
glyph (GHSA-vcvr-r3jv-pc5j). The developer's merge of G-Checks is the
confirming act. A later task owns any upgrade.

- `GHSA-22jm-h49p-29qw` — `@modelcontextprotocol/sdk` — high
- `GHSA-2464-fhr4-w9xw` — `next` — critical
- `GHSA-27r3-jxmh-p828` — `body-parser` — high
- `GHSA-2m5v-pch6-74hx` — `undici` — high
- `GHSA-3f7j-7jwc-fxfj` — `systeminformation` — high
- `GHSA-46jr-4wx8-v453` — `@modelcontextprotocol/sdk` — high
- `GHSA-4w7w-5xrc-9h26` — `undici` — high
- `GHSA-58mr-gqgx-xq4g` — `fast-uri` — high
- `GHSA-673q-mjm6-r5xr` — `next` — critical
- `GHSA-68fv-2mgg-jv7q` — `source-map-js` — high
- `GHSA-6j4f-fj2g-mc7p` — `brace-expansion` — high
- `GHSA-6qxp-vccf-f47h` — `@modelcontextprotocol/sdk` — high
- `GHSA-cjq9-62q9-8jv4` — `next` — high
- `GHSA-f897-62hf-6gxq` — `@modelcontextprotocol/sdk` — high
- `GHSA-jqcg-44mw-7w3h` — `proxy-addr` — critical
- `GHSA-mrhx-c7xc-m3w5` — `zod` — high
- `GHSA-p3m5-59mp-jv5r` — `next` — high
- `GHSA-qhr7-859c-m2p7` — `brace-expansion` — high
- `GHSA-qrxm-fqhp-jwvm` — `undici` — high
- `GHSA-qw65-cvwx-89v3` — `fast-uri` — high
- `GHSA-rfgv-xxqx-mfg5` — `undici` — high
- `GHSA-vcvr-r3jv-pc5j` — `next` — critical
- `GHSA-w293-vg96-wgc3` — `undici` — high
- `GHSA-wq5f-xc86-pv6w` — `sharp` — high
- `GHSA-xjj6-f33q-929c` — `undici` — high

## Headers

Set in `next.config.ts` for every route: CSP, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
`Permissions-Policy` with camera/mic/geo off.

CSP is `default-src 'self'` plus `script-src`/`style-src` `'self' 'unsafe-inline'`.
Next still inlines the theme boot script and App Router flight payloads, so
script hashes-only is not enough without a nonce middleware. Tailwind is
compiled; the style `'unsafe-inline'` is for Next’s remaining inline CSS.
Development also allows `'unsafe-eval'` (React refresh). Production does not.

## Generated images

`docs/readme-hero.png`, `public/og.png`, and `public/icons/*.png` are rasterised from Unicode
in `letters.json` with GNU FreeSerif (`scripts/render-brand-images.tsx`).
They are not commissioned art; the font licence is the same FreeSerif
embedding as the site.

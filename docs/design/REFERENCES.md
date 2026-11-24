# References — learn-coptic

The references the design direction draws from (`docs/method/DESIGN_METHOD.md` §5.4). The developer gave no
reference images (`docs/design/references/` does not exist), so the site as it is comes first: it is the design the
direction describes (OD-09). Look, never copy.

| Ref | Source | What we take | What we leave |
|---|---|---|---|
| R1 | The live site, https://learn-coptic.vercel.app, at adoption (`9f6ae1b`): `src/app/globals.css`, `.cursor/rules/20-ui.mdc`, `docs/content-style.md` | everything in `docs/DESIGN_SYSTEM.md`: the night background, the group gradients clipped into the glyph, the 24 px cards, the bottom bar, the calm motion | nothing: it is the baseline |
| R2 | The legacy explorer the site was converted from (its seven group colours, recorded in the `globals.css` contrast table) | the seven colours as pedagogy, one per letter group | the 450 px 3D flip cards, the eight wrapping tabs, the invalid CSS and the Google Fonts `<link>` (`.cursor/rules/20-ui.mdc`) |
| R3 | The Coptic manuscript tradition, through Athanasius Plain (`src/app/fonts/ATHANASIUS.txt`) | an optional manuscript face, offered and never forced | any glyph not mapped by this project's keymap |
| R4 | Library: `docs/method/DESIGN_METHOD.md` §5.2, type `web-app` (Refero, Mobbin) | quick feedback, motion only for state, keyboard paths | dense dashboard patterns: this is a reading app |

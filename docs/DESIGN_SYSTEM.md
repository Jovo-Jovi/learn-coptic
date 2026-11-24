# Design system — learn-coptic

The design contract of `docs/method/DESIGN_METHOD.md` §1. It describes the design the live site has today (OD-09):
the screens the phases add follow it, and a new look is a change request (§5.6). The tokens are in
`src/app/globals.css`; `.cursor/rules/20-ui.mdc` and `docs/content-style.md` are the project's own rules and stay
authoritative for copy and layout.

## 1. Direction

**Character:** luminous · devotional · patient.

**Draws from:** `docs/design/REFERENCES.md` R1 (the live site itself, the baseline), R2 (the legacy explorer's
seven group colours, as pedagogy) and R3 (the manuscript tradition the Athanasius face carries).

**Signature:**

- **Type:** the Coptic glyph is always the largest thing on the page (`--text-glyph` 6 rem on a letter page, 5.5–6.5
  rem on cards), painted in GNU FreeSerif; Arabic in Cairo is the reading language around it.
- **Colour:** a near-black night (`--bg` `#0A0A0F`) on which each letter group glows in its own gradient pair
  (`--group-N-from` → `--group-N-to`), clipped into the glyph itself. The colour teaches: a learner knows a letter's
  group by colour before its name.
- **Layout:** phone first, one column at 375 px, generous rounded cards (24 px) with a hairline, and a fixed bottom
  bar of four items (الحروف · الكلمات · التدريب · عن الموقع).
- **Motion:** calm and physical — staggered entrances, a spring on hover and a soft glow, a shared `layoutId` glyph
  between a card and its letter page; six glyphs float slowly on the landing page. All of it stops with reduced motion.

Visual ambition: calm.

## 2. Tokens

### 2.1 Colour (dark is the primary skin; light darkens `to`, never inverts, OD-19)

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0a0a0f` | `#f5f5f7` | page |
| `--surface` | `#13131a` | `#ffffff` | cards |
| `--surface-2` | `#1c1c26` | `#ececf2` | drills, muted panels |
| `--hairline` | white 8 % | `#0a0a0f` 8 % | borders |
| `--text` / `--text-dim` | `#f5f5f7` / `#9a9aa8` | `#0a0a0f` / `#6b6b78` | text |
| `--highlight` | group-5 `from` 42 % on surface | 48 % on white | the prayer tap wash (`.prayer-hl`), never the UA `<mark>` |
| `--group-1-from` → `-to` | `#667eea` → `#8f6bb3` | → `#764ba2` | group 1 |
| `--group-2` | `#f093fb` → `#f5576c` | → `#bf4454` | group 2 |
| `--group-3` | `#4facfe` → `#00f2fe` | → `#00797f` | group 3 |
| `--group-4` | `#43e97b` → `#38f9d7` | → `#1c7c6b` | group 4 |
| `--group-5` | `#f6d365` → `#fda085` | → `#986050` | group 5 |
| `--group-6` | `#fda085` → `#f5576c` | → `#bf4454` | group 6 |
| `--group-7` | `#a8edea` → `#fed6e3` | → `#7f6b71` | group 7 |
| `--group-N-glow` | `from` at 40 % | same | hover glow, ambient radials |
| `--group-N-fg` | `#171717` | same | text on a pastel chip (≥ 4.5:1) |

`[data-group="N"]` sets `--g-from`, `--g-to`, `--g-glow`, `--g-fg` for a subtree. **No hex in a component**: every
colour comes through these tokens and Tailwind (`.cursor/rules/20-ui.mdc`). Every group colour passes 4.5:1 against
its own text in both themes; the contrast table is the comment at the top of `globals.css`.

### 2.2 Type

| Token | Size / line height | Use |
|---|---|---|
| `--font-sans`, `--font-heading` | Cairo | all Arabic and Latin chrome |
| `--font-coptic` | `--font-coptic-stack`: FreeSerif → Noto Sans Coptic → serif; `html[data-coptic-font="sans"]` puts Noto first | every Coptic string |
| `.coptic-key` | Athanasius Plain, manuscript mode only | the stored `athanasiusKey`, painted over the hidden Unicode |
| `--text-xs` … `--text-3xl` | 0.75 rem/1.4, 0.875/1.5, **1.125/1.7 (base)**, 1.25/1.6, 1.5/1.4, 1.875/1.3, 2.25/1.2 | the type scale; no ad-hoc sizes |
| `--text-glyph-card`, `-md`, `-lg` | 5.5, 6, 6.5 rem / 1 | glyph on a letter card |
| `--text-glyph` | 6 rem / 1 | glyph on the letter page |
| `--text-glyph-word`, `-md` | 1.75, 2.25 rem / 1.25 | Coptic on a word card |

### 2.3 Spacing, radius, elevation

- **Spacing:** Tailwind's 4 px scale; cards and sections use the opened-up spacing of S5c. Safe-area padding under the
  bottom bar on iOS.
- **Radius:** `--radius` 1.25 rem, with `--radius-sm` … `--radius-4xl` derived from it; cards (`.card-face`) 24 px.
- **Elevation:** no drop shadows. Depth is the surface step (`--bg` → `--surface` → `--surface-2`), the hairline, the
  group glow on hover or focus (`.glow-blob`), and two static ambient radials (`body::before`) under a 3 % grain
  (`body::after`).

## 3. Surfaces

| Surface | Look |
|---|---|
| Card (`.card-face`) | surface, hairline, 24 px; on hover or focus a gradient border (`--g-from` → `--g-to`) and the glow |
| Drill card (`.card-face-drill`) | `--surface-2`, dashed hairline, a 4 px group stripe on the inline start: it never looks like a dictionary card |
| Glyph (`.glyph-fill`) | the group gradient clipped into the text; plain `--text` where clipping is unsupported |
| Chip (`.chip-fill`) | the pastel group gradient with `--g-fg` text |
| Letter hero (`.hero-wash`) | a blurred group wash behind the glyph |
| Landing (`.landing-radials`, `.hero-glyphs`) | stronger ambient radials; six floating glyphs at 18 % |
| Prayer highlight (`.prayer-hl`) | the `--highlight` wash with an inset group-5 ring |

## 4. Themes

Dark by default (`:root`, `color-scheme: dark`); light by the header toggle (`.light`) or the system preference when
the learner has not chosen (`prefers-color-scheme: light`). The choice is applied before paint by the boot script in
`src/lib/theme.ts`, so there is no flash. Both themes are captured for every screen task.

## 5. Components and their states

| Component | States |
|---|---|
| Bottom navigation (`BottomNav`) | four items, the active one marked (`aria-current`), safe-area padding |
| Letter card (`LetterCard`) | rest, hover/focus (gradient border, glow, spring), the lowercase glyph only (OD-20) |
| Word card (`WordCard`) | front (Coptic + translit when present), revealed (meaning) by a real `<button aria-expanded>`; `name` badge اسم علم; drill style; an empty translit is hidden, never guessed |
| Expanding panel (`RulesAccordion`, Radix) | closed, open: height and opacity only, `aria-expanded`, the glyph stays visible |
| Audio button (`AudioButton`) | idle, playing; labelled اسمع (`aria-label`), never an icon alone; plays only after a tap |
| Filter chips (`GroupFilter`, `VocabularyFilter`) | links ١..٧ and الكل; the active pill moves with `layoutId` |
| Quiz (`QuizSession`) | question, answered right, answered wrong, box changed, reset confirmed |
| Prayer reader (`PrayerReader`, `PrayerLines`) | line at rest, token tapped (highlight in place), token with no match (no highlight, which is expected), tapped again (cleared) |
| Search (`WordSearch`) | empty, typing, results, no result |
| Theme toggle, font picker | each value; applied before paint |
| Coptic paint (`CopticPaint`) | Unicode (default); manuscript (key painted, Unicode hidden but in the DOM) |

**New components the phases add** (T06, T07, T10, T11) use these surfaces and tokens. `LetterChip` and `WordCard`
work inline in a lesson (S15). A lesson has a step list with a current step, a done step and a locked step (a
prerequisite not yet met). Word art is a 1:1 image inside the word card; until its theme is complete, the card stays
exactly as it is today (that is the fallback). Synced prayer audio adds a play/pause control labelled in Arabic, the
active line marked with the `--highlight` wash, and a line that seeks when tapped; muted, the page is the text lesson
it is today.

## 6. Motion

- **Library:** Motion (`motion`, OD-18 family; S5b): stagger on entrance, a spring on hover, the `layoutId` glyph and
  filter pill. CSS for the landing glyphs' float (`glyph-float`, 8–13 s) and the glow's opacity (0.35 s).
- **Reduced motion:** `prefers-reduced-motion: reduce` stops every animation and transition (`globals.css`), removes
  the glows, washes, radials and grain filters, and `MotionProvider` turns Motion's animations off. Nothing a learner
  needs depends on motion.
- **No layout shift:** an entrance animates opacity and transform only; images and media reserve their size.

## 7. Responsive

Designed at **375 px**, then widened. One column on a phone; grids widen at Tailwind's breakpoints. The runner
captures every screen at **390** and **1280**; neither may scroll horizontally (`html { overflow-x: clip }` is not a
licence to overflow). The bottom bar stays fixed at every width.

## 8. Accessibility floor

WCAG 2.2 AA, checked by axe on every capture (PR-51) and read by the reviewer:

- contrast 4.5:1 for text (the group tokens are tuned for it in both themes), 3:1 for large glyphs and focus rings;
- a visible focus on every control (`outline-ring/50`), in both themes;
- every control is a real `<button>` or link with an Arabic label; panels carry `aria-expanded`; tab lists carry
  `role="tablist"` and `aria-selected`;
- targets at least 24 × 24 px (the bottom bar and chips are larger);
- `lang="ar" dir="rtl"` on the page and every Coptic or Latin string in an LTR isolate, so a screen reader reads each
  in its own direction; the Unicode Coptic stays in the DOM in manuscript mode.

## 9. Resource decisions (`docs/method/DESIGN_METHOD.md` §5.1)

| Resource | Decision | Reason |
|---|---|---|
| CSS transitions, scroll-driven animations, View Transitions | adopt (in use) | the float and the glow are CSS; no dependency |
| Motion | adopt (in use) | the component transitions and `layoutId` of S5b |
| AutoAnimate, React Spring, anime.js, GSAP, Lenis | reject | Motion already covers it; one motion library (OD-18) |
| shadcn/ui on Radix Primitives | adopt (in use) | the accordion and button; owned components |
| Tailwind CSS | adopt (in use) | utilities over the tokens |
| Lucide | adopt (in use) | the one icon set (OD-18) |
| Radix Colors | reject | the seven group colours are the curriculum's, tuned by hand for contrast (OD-19) |
| Fontsource | reject | `next/font` already self-hosts every face |
| React Bits, Animate UI, Magic UI | reject | OD-18: no shine kits or particle libraries |
| Recharts, visx, ECharts, Tremor | reject | no charts |
| Embla Carousel | reject | no carousel in the brief |
| three.js, Rive, Lottie, Barba, Swup | reject | no need in the brief |
| Storybook | reject | a small component set; the runner's captures are the evidence |

## 10. Media

`devos/answers.json` `modules.media` is `none`: no image, video or voice is generated by DEV_OS, and there is no
`docs/design/media.json`. Word art (T10) and the prayer recording (T11) are content files the developer supplies with
their licence (OD-25, OD-28); each screen keeps its designed fallback (§5) until its file exists.

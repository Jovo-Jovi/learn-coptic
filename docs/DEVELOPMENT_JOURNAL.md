# Development journal — learn-coptic

DEV_OS's journal, append-only, newest last. The project's own `docs/journal.md` (newest first) is kept and still
updated by every task (OD-06).

## 2026-11-25 — DEV_OS adopted

DEV_OS was added to learn-coptic, live in production since S9. The confirmed brief (`.devos/adopt/brief.md`) set the
stage to production, profile A, no personal data. The blueprint wrote DEV_OS's documents beside the project's own,
carried the project's 23 ADRs into `docs/DECISIONS.md` as OD-10 to OD-32 and its glossary into `docs/GLOSSARY.md`
(the originals stay in `docs/before-adopt/`), declared the three browser-storage and form zones the code already has
in `docs/BOUNDARY_MODEL.md`, and planned the open work as T01–T12 in `docs/PHASES.md`. Nothing in the product changed.
Fence T01 makes DEV_OS's checks run on the code as it is.

## 2026-11-26 — T01 checks on the code as it is

T01 kept the pnpm lockfile beside npm's and added the `guards` script, a warning baseline for
`react-hooks/set-state-in-effect` in the four adoption components, and the PR-85 acceptance of the 25
adoption-tree advisories in `docs/security.md`. No package was added and no version changed. The acceptance
is not a patch. The next action still waits on the developer's merge of G-Checks, including the Vercel
install and build commands (OD-05 §3). That merge records S17's GATE as PASS.

# Reusable prompt patterns

Paste the wrapper from `PROMPTS.md` first, then one of these.

## Extract and report (never write)
```
Read <source>. Produce a table of what you found vs what is currently in
<target>. Do not write any file. Recommend, do not decide.
```

## Build one component
```
Build <component> only. Read .cursor/rules/20-ui.mdc first. Show me the diff.
Do not touch routing, data, or config.
```

## Data change request
```
I want to change <field> in <file>. Show me: the current value, the proposed
value, every place it is referenced, and what breaks. Do not edit yet.
```

## Accessibility pass
```
Audit <route> against WCAG 2.1 AA: contrast, focus order, aria on the expanding
panels, reduced motion, touch target size. List failures with the fix. No code.
```

## Bug triage
```
Reproduce: <steps>. Expected: <x>. Actual: <y>. Find the cause and show me the
one-line explanation before proposing a fix.
```

## Refuse-to-guess reminder (append when a step touches content)
```
If any Coptic text, Arabic gloss, or codepoint is missing, leave it null and
list it. Do not fill it from memory.
```

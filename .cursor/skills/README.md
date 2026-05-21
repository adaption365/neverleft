# Cursor Agent Skills (NeverLeft)

Skills teach the agent how to work in this repo. Cursor loads skills from `.cursor/skills/<name>/SKILL.md`.

| Skill | Purpose |
|-------|---------|
| [emil-design-eng](./emil-design-eng/) | [Emil Kowalski](https://emilkowal.ski/skill) design engineering — animation framework, component polish, review tables |
| [neverleft-ui-polish](./neverleft-ui-polish/) | Same principles scoped to `index.html` (vanilla CSS PWA) |

## Install / refresh upstream

```bash
npx skills add emilkowalski/skill --skill emil-design-eng
```

The CLI may also write `.agents/skills/`; the copy under `.cursor/skills/` is what we commit for Cursor.

## Usage

Invoke on demand, e.g. “review animations on the kit page” or “polish primary buttons per design-eng skill”. Avoid leaving both skills always-on for every task — use when touching UI.

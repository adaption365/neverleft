---
name: neverleft-ui-polish
description: >-
  Apply design-engineering polish to NeverLeft (vanilla HTML/CSS PWA in index.html).
  Use when reviewing or changing UI, motion, buttons, hovers, page transitions,
  modals, or visual feel. Read emil-design-eng for the full philosophy; this skill
  scopes it to this repo.
---

# NeverLeft UI polish

NeverLeft is a **single-file** app: all UI lives in `index.html` at the repo root (inline `<style>` + markup). No React or Framer Motion — use **CSS transitions**, **`@keyframes`**, and **`prefers-reduced-motion`** only.

For philosophy, decision framework, and review tables, use the **`emil-design-eng`** skill in this repo (Emil Kowalski). This skill is the **project checklist**.

## When to invoke

- User asks to polish UI, fix “janky” motion, or review CSS
- Touching `.btn`, `.hdr-btn`, `.irow`, page enter animation, chevrons, modals/overlays
- Adding new interactive surfaces

Do **not** apply heavy animation polish to high-frequency actions (search focus, every nav click, kit row hover if used constantly).

## Recommended tokens (add to `:root` when implementing)

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--dur-fast: 140ms;
--dur-ui: 200ms;
--dur-panel: 280ms;
```

Prefer `transition: transform var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out)` over `transition: all`.

## Known patterns in this codebase (audit targets)

| Location / class | Current pattern | Emil-aligned direction |
| --- | --- | --- |
| `.btn`, `.hdr-btn`, `.fb`, `.qbtn` | `transition: all` | List exact properties; add `:active { transform: scale(0.97) }` |
| `.btn-p:active` | `translateY(0)` only | Keep lift on hover; add subtle `scale(0.97)` on press |
| `.page` | `fadeUp` keyframes on every navigation | OK for rare page enters; avoid stacking with other enters; respect reduced motion |
| `.irow:hover` | `translateY(-2px)` + shadow | Gate with `@media (hover: hover) and (pointer: fine)` |
| Chevrons `.cg-toggle`, `.igroup-toggle` | `transform` rotate | Keep; use `--ease-out` ~180–220ms |
| Inputs `.sw input` | `transition: box-shadow` only | Good — don’t animate layout properties |

## Stack constraints

1. **Only animate `transform` and `opacity`** where possible (performance on mobile PWA).
2. **No `scale(0)`** on enter — use `scale(0.95)` + `opacity: 0` if adding enter states.
3. **UI duration cap ~300ms**; button press feedback ~140–160ms.
4. **Never `ease-in`** on dropdowns/popovers — use `ease-out` or `--ease-out`.
5. Add once in global CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

(Tune so opacity/color hints for state remain if needed.)

## Review output

When reviewing NeverLeft UI changes, use the **Before | After | Why** markdown table from `emil-design-eng`. Cite selectors from `index.html` (e.g. `.btn-p`, `.page`).

## Cohesion with NeverLeft

- **Tone:** calm, outdoors, utility-first — motion should feel **crisp**, not bouncy. Avoid playful spring bounce except deliberate delight (e.g. trip complete).
- **Amber/sage palette:** hover lifts are already brand language; don’t add unrelated motion.
- **PWA:** prefer CSS off main thread; avoid heavy blur filters on long lists.

## Updating the upstream skill

```bash
npx skills add emilkowalski/skill --skill emil-design-eng
```

Then recopy to `.cursor/skills/emil-design-eng/SKILL.md` if the CLI only updates `.agents/skills/`.

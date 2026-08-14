# Design System — Stage 04

Defined in `client/src/index.css` using Tailwind CSS v4's `@theme` directive (CSS-first config, no `tailwind.config.js` needed).

## Typography

- Font: Inter (system-ui fallback stack). Loaded via `--font-sans`.
- Use Tailwind's default type scale (`text-sm` … `text-4xl`) — no custom scale needed for this project's density.

## Color

- **Brand** (`brand-50`…`brand-950`): NISEPA environmental green, used for primary actions, links, active nav state.
- **Neutral** (`neutral-0`…`neutral-950`): page background, surfaces, borders, body text. Warm-tinted gray (slight green undertone) to stay cohesive with brand green.
- **Status** (waste-level semantics, see `PROJECT_MEMORY.md` Section 7):
  | Token | Hex | Range | Meaning |
  |---|---|---|---|
  | `status-normal` | `#15803d` | 0–79% | Continue monitoring |
  | `status-warning` | `#b45309` | 80–89% | Collection planning recommended |
  | `status-high` | `#9a3412` | 90–99% | Immediate attention recommended |
  | `status-full` | `#b91c1c` | 100% | Collection required |

  Each status has a paired `-bg` tint for badges/cards. **Per Section 29 (Accessibility), color is never the only signal** — every status UI must also carry a text label and/or icon (e.g. a warning triangle), not color alone.

  Validated with the dataviz skill's `scripts/validate_palette.js` (run against `#15803d,#b45309,#9a3412,#b91c1c`, light mode) — all four pass the ≥3:1 contrast-vs-surface check. The pairwise CVD-separation check is scoped to arbitrary categorical/identity palettes, not an ordered severity ramp like this one (the validator's own scope note); the risk it guards against — two statuses reading as indistinguishable — is covered here by every status color always shipping with a text label and/or icon, never color alone.

## Radii

`radius-sm` (0.375rem) → `radius-xl` (1.25rem). Cards default to `radius-lg`; buttons/inputs to `radius-md`.

## Shadows

Four restrained levels (`shadow-xs` … `shadow-lg`), no glassmorphism/blur per Section 12. Use the smallest shadow that creates enough separation — most cards need only `shadow-sm`.

## Usage

Tailwind utility classes read these tokens automatically, e.g.:

```tsx
<div className="rounded-lg bg-neutral-0 shadow-sm border border-neutral-200 p-6">
  <span className="rounded-md bg-status-warning-bg text-status-warning px-2 py-1 text-sm font-medium">
    80% — Warning
  </span>
</div>
```

## Amendments

Any change to these tokens must be reflected here and in `PROJECT_MEMORY.md` Section 23 (Persistent Project Memory) per project rules.

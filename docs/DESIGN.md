# medcn doc site — design spec

The reference bar is ui.shadcn.com: quiet, dense, typographic. medcn layers a
**clinical-neon** identity on top — the glow of monitor UIs and ECG traces —
kept subtle. If an element competes with a component demo, the element loses.

## Principles

1. **Dark-first.** Dark is the default theme (monitor aesthetic); light is the
   clean-lab alternate. Both fully supported, toggle in the header, persisted
   to `localStorage`, no flash on load.
2. **Neon as accent, never as surface.** Exactly one neon hue — cyan-teal
   (`--primary`) — used for: primary CTA, active states, the logo pulse, hover
   glows, the ECG motif. Backgrounds stay near-black/white and desaturated.
3. **The demo is the hero.** Chrome is monochrome and low-contrast; the only
   saturated pixels on a page should belong to components or the single accent.
4. **No self-talk.** Pages carry zero internal/meta statements (porting notes,
   roadmap promises, positioning essays). Every sentence must help a developer
   ship. Positioning lives in the README/PRD, not the UI.

## Tokens (dark = default)

| Token | Dark | Light |
|---|---|---|
| `--background` | `oklch(0.105 0.012 240)` near-black blue | `oklch(0.99 0.003 220)` |
| `--card` | `oklch(0.135 0.014 240)` | `oklch(1 0 0)` |
| `--primary` (neon) | `oklch(0.80 0.13 195)` cyan-teal | `oklch(0.50 0.11 205)` |
| `--success` | `oklch(0.75 0.15 160)` | `oklch(0.63 0.15 145)` |
| `--warning` | `oklch(0.83 0.12 85)` | `oklch(0.78 0.12 80)` |
| `--info` | `oklch(0.72 0.12 220)` | `oklch(0.58 0.13 225)` |
| `--destructive` | `oklch(0.65 0.19 22)` | `oklch(0.56 0.18 24)` |
| `--glow` | primary @ 25% alpha | primary @ 18% alpha |

Effects: `shadow-glow` / `shadow-glow-sm` (soft primary halo, hover + hero
only), `.bg-grid` (32px hairline grid, ≤5% alpha, hero/section backdrops), the
animated ECG stroke (hero only, one instance per page max).

## Type & spacing

- Sans: Geist; Mono: Geist Mono (commands, code, prop names).
- Headings: tight tracking, `text-balance`. Body copy ≤ 65ch.
- Section rhythm on doc pages: `gap-10`; page gutter `max-w-6xl px-6`.

## Dogfooding (strict)

The doc site consumes medcn's own registry components wherever one exists —
`Button`, `Badge`, etc. come from `registry/medcn`, never re-implemented in
site code. When the site needs a new reusable primitive, it is added to the
registry first, then consumed. Site-only helpers are limited to doc-site
mechanics (CodeBlock, CommandPill, SidebarNav, ThemeToggle, ComponentPreview)
and still follow shadcn conventions.

## Code display

All user-facing code is shiki-highlighted (`github-dark-default`) via
`components/code-block.tsx`, on the fixed dark code surface in both themes.
Single-line shell commands use the CommandPill instead. Never a bare `<pre>`.

## Recurring patterns

- **Command pill**: mono text in a bordered `bg-card` pill with a copy button —
  the same component everywhere a command appears.
- **Preview/Code**: shadcn-style underline tabs; preview canvas is a bordered
  panel on the grid backdrop; code on a fixed dark surface (same in both
  themes) with a floating copy button.
- **Catalog cards**: monochrome at rest; hover = hairline primary border +
  `shadow-glow-sm` + slight lift. Category kickers in uppercase mono.
- **Clinical notes**: info-tinted panel with a heartbeat icon — the one
  domain-flavored block on a component page.

## Don'ts

- No second accent hue, no gradients on text longer than two words.
- No glow on body text; glow is for interactive or hero elements.
- No banner-style marketing sections between a developer and the install command.

# Lumina

An immersive landing page: full-bleed video background, a particle band, and a
"liquid glass" footer. Built with Vite, React 18, TypeScript, Tailwind CSS v4,
`motion/react` and `lucide-react`.

```bash
cd lumina
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to ./dist
npm run preview    # serve the built output
```

---

## Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Build      | Vite 6 + React 18 + TypeScript                            |
| Styling    | Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config) |
| Animation  | `motion/react`                                             |
| Particles  | `@tsparticles/react` + `@tsparticles/slim`                 |
| Icons      | `lucide-react`                                             |

Tailwind v4 has no `tailwind.config.js` — theme tokens are declared in
`src/index.css` under `@theme`, which is where `--font-sans` is bound to the
`Helvetica Regular` face.

---

## Project structure

```
lumina/
├── index.html
├── vite.config.ts          # React + Tailwind plugins, "@" → ./src alias
└── src/
    ├── App.tsx             # page shell: fixed video, scrim, content wrapper
    ├── index.css           # @font-face, @theme tokens, .liquid-glass
    ├── lib/
    │   └── utils.ts        # cn() — clsx + tailwind-merge
    └── components/
        ├── BoomerangVideoBg.tsx
        ├── Footer.tsx
        ├── Hero.tsx
        ├── LuminaMark.tsx
        ├── Navbar.tsx
        ├── SparklesBand.tsx
        └── ui/
            └── sparkles.tsx
```

### Why `components/ui`

`src/components/ui/` is the shadcn convention, and the `@/*` → `./src/*` alias
is declared in both `tsconfig.json` and `vite.config.ts`. Keeping that exact
path and alias means any component pasted from shadcn or a registry — which
import `@/lib/utils` and expect to live in `@/components/ui` — drops in without
rewriting imports, and `npx shadcn add ...` will write to the right place.
Project-specific components sit one level up in `src/components/` so the `ui/`
folder stays a clean library surface.

---

## The liquid glass effect

`.liquid-glass` is a near-transparent, blurred surface. The gradient rim is a
`::before` pseudo-element: it paints a full-bleed gradient, then masks out the
content box with `mask-composite: exclude`, leaving only a 1.4px edge — brightest
at the top and bottom, invisible through the middle.

It lives inside `@layer components` on purpose. Tailwind v4 emits utilities into
a later cascade layer, so `position: relative` in the class still loses to an
`absolute` utility applied to the same element. Unlayered, the class would win
and silently break the positioning of any glass element (the nav pill, for one).

---

## The video background

`BoomerangVideoBg` plays the clip once while copying every decoded frame into an
offscreen canvas (capped at 960px wide and 180 frames), then swaps the video for
a canvas that replays those frames forward and backward at 30fps. Bouncing at
both ends instead of wrapping is what removes the visible cut a normal `loop`
gives you.

It degrades on its own:

- fewer than two frames captured, a decode error, or a 20s timeout → falls back
  to the plain `<video>` with native `loop`;
- `prefers-reduced-motion: reduce` → skips capture entirely and leaves the video
  paused on its first frame.

`requestVideoFrameCallback` is used where available, with a `requestAnimationFrame`
loop as the fallback.

To change the footage, edit `BG_VIDEO` at the top of `src/App.tsx`.

---

## Notes on the source specs

Three specs went into this page and two of them disagreed. Where they did, the
Tailwind v4 / `motion/react` spec won:

- **`framer-motion` → `motion/react`.** The pasted `sparkles.tsx` imports from
  `framer-motion`. That is the same library under its former name, so the import
  was repointed rather than installing both and shipping two copies of the same
  animation engine.
- **The sparkles mask.** The original demo hides the particle field's edges
  behind an opaque black plate. Over a video that would punch a visible black
  rectangle through the footage, so the falloff is applied as a `mask-image` on
  the field itself.
- **Fonts.** The Neue Haas Grotesk stack from the second spec is unused; the
  page runs on the `Helvetica Regular` face bound to `--font-sans`.

The font and the video are both loaded from third-party hosts
(`db.onlinewebfonts.com` and CloudFront). If either is unreachable the page still
renders — the font falls back to the system sans stack, and the video area stays
black behind the scrim.

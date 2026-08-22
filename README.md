# ব্যবহারিক জ্যামিতি স্টুডিও (Practical Geometry Studio)

An interactive, animated ruler-and-compass construction teaching tool for **SSC 2027, Chapter 07 — ব্যবহারিক জ্যামিতি (Practical Geometry), Lecture M-08**. Every construction is *computed* from live numeric inputs and *drawn* step by step with animated ruler / compass / protractor / pencil tools — not a static image and not a pre-baked SVG path.

No backend. No auth. No analytics. A static site you can run in class with `vite dev` or ship as a built `dist/` folder.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs static site to dist/
npm run preview   # serve the production build locally
```

## Classroom controls

| Key | Action |
|---|---|
| `Space` | Play / pause the current construction |
| `→` | Next step |
| `←` | Previous step |
| `R` | Restart the construction |
| `F` | Toggle presentation mode (hides sidebar/chrome, shows a subtitle-style caption bar) |

Every construction screen also has: a **Play/Pause/Step/Restart** bar with a speed slider, a **"Final figure"** button that snaps to the completed construction, a **"Verify mode"** toggle that recolours given data (blue) vs. constructed/derived data (orange), and a **"Show tools"** toggle to hide the ruler/compass/protractor overlays for a clean "just the answer" view.

## Project layout

```
src/
  geom/            geometry engine — Point/Segment/Ray/Circle/Angle primitives,
                    intersections, rotations, bisectors, and the math<->SVG
                    coordinate mapping (render.ts)
  constructions/    one file per construction problem (tri1.ts … quad13.ts),
                    each exporting a registered ConstructionMeta with its
                    ordered Step[] and default numeric inputs
  components/       Canvas, EntityLayer, PointsLayer, ToolRuler/Compass/
                    Protractor, StepPanel, PlaybackControls, Sidebar,
                    Lang/ThemeToggle, TheoryIcon, ErrorBoundary
  state/            useConstructionPlayer (the playback/animation controller)
                    and appStore (language/theme/presentation/verify prefs)
  pages/            ConstructionPage (shared template every construction
                    renders through), TriangleTheory, QuadTheory, Quiz
  quiz/             quiz question bank (data.tsx)
  lib/format.ts     cm/degree formatting incl. Bengali digit conversion
```

## How the engine works

1. **Geometry is computed, not hand-drawn.** Every construction file exports a pure `geometry(inputs)` function that derives every point (`D`, `E`, `A`, `B`, `C`, …) algebraically from the current numeric inputs, using helpers from `src/geom/core.ts` (`intersectLineLine`, `intersectCircleCircle`, `bisectAngleDir`, `pointAtDistanceAngle`, `copyAngleOntoLine`, …). Change perimeter from 12 cm to 14 cm and the whole figure recomputes and re-animates correctly — nothing is a hardcoded pixel coordinate.

2. **A construction is an ordered `Step[]`.** Each `Step` has a title/narration (Bangla + English), a `tool` (`ruler | compass | protractor | pencil | none`), an optional `caution` callout, an optional `radiusLockRef` (id of the earlier step whose compass radius this step reuses — drives the "🔒 radius unchanged" badge), and a `compute(state, inputs)` function returning the new `GeomEntity[]` to draw plus a `ToolAnim` descriptor telling the canvas which tool to animate and with what parameters.

3. **The player (`useConstructionPlayer`) drives a single interpolation value `progress` (0→1) per step** via `requestAnimationFrame`. `EntityLayer` reveals segments/rays by lerping the endpoint, and arcs/angle-marks by sweeping the end angle — generically, for every construction, with no per-problem animation code. `ToolsOverlay` positions the ruler/compass/protractor graphics from the same `progress` value.

4. **Jumping to a step** (clicking it in the side panel) replays all prior steps *instantly* (`runSteps` in `constructions/runner.ts` just re-executes `compute()` for each step 0..N, which is cheap and pure) and then animates only the clicked step.

## Adding a new construction

This pattern is meant to be reused for future chapters too, e.g. the Chapter 16 mensuration simulations.

1. Create `src/constructions/yourProblem.ts`.
2. Write a `geometry(inputs: Record<string, number>)` function that returns every named point the construction needs, computed with the helpers in `src/geom/core.ts` and `src/constructions/stepHelpers.ts` (`segEnt`, `arcEnt`, `angleMarkEnt`, `rightAngleEnt`, `toolRuler`, `toolCompass`, `toolProtractor`, `copyAngleOntoLine`, `arcSweepTo`, …).
3. Build a `steps: Step[]` array. Each step's `compute()` calls `geometry(inputs)` and returns the entities that step adds (usually 1-3: a segment/ray/arc plus maybe a point or angle mark) and a `toolAnim`. Mark a step with `radiusLockRef: "<earlier step id>"` whenever the compass reuses a previously-set radius, and add a `caution` wherever students commonly make a mistake.
4. Export a `ConstructionMeta` via `registerConstruction({...})` — give it a unique `id`, `topic` (`"T01"` or `"T02"`), `inputs` (with sensible min/max/step and a `validate()` if some combinations are geometrically invalid), and a `givenSummary(inputs)` function (so the "given data" panel stays accurate as inputs change).
5. Add the new module to `src/constructions/index.ts` (this both registers it and adds it to the sidebar/list).
6. If it's a new topic, add a route for it in `src/App.tsx`; if it's another problem under T-01/T-02 it needs no new route — `/c/:id` already resolves any registered construction id.

The `ConstructionPage` component (in `src/pages/`) is a single shared template — you never write layout, playback, or panel code per construction.

## Fonts & i18n

Bengali labels/text render via **Hind Siliguri** and **Noto Sans Bengali** (Google Fonts, loaded in `index.html`). Every piece of UI text and every construction's narration is bilingual (`{ bn, en }`); the language toggle in the top bar swaps text only — geometry, point positions, and numbers stay identical between languages (numerals are rendered with Bengali digits via `src/lib/format.ts` when in বাংলা mode).

## Known simplifications

Some multi-arc classical constructions (e.g. bisecting an angle with two crossing arcs, or copying an angle with a full chord-transfer) are represented as a single symbolic compass sweep across the angle rather than every individual arc, to keep ~20 constructions maintainable. The narration text still describes the real technique in words, and the compass-discipline cautions are preserved wherever the source lecture calls them out.

---
name: web-reference-design
description: Use a curated web reference library to design, build or refine a website or web app. Select task-relevant layout, component, typography, asset and interaction references, translate inspected examples into an intentional implementation, and verify the rendered result. Use when visual direction or reference selection matters; skip backend-only work and trivial copy edits.
license: MIT; external resources retain their own terms
metadata:
  version: "1.0.0"
---

# Web Reference Design

Make the requested interface. The library supplies evidence and materials; it is not the deliverable and does not choose the user's product for them.

## Resolve the library

Read [library resolution](references/library-resolution.md). Prefer a library supplied by the user or current project. The original author library is `C:/Users/user/Documents/Codex/Du-an/Web-reference/README.md`; read it on that host when available. Other machines use the bundled [resource catalog](references/resource-catalog.md). Do not search unrelated workspaces for it.

Check applicability before running lookup: backend-only work does not activate this skill even if the brief says "no UI work." Reduce a full brief to a focused positive design need for lexical lookup; preserve its exclusions and constraints in your decision. Helper output never overrides those constraints.

The optional standard-library Python helper finds candidates without loading the whole catalog:

```text
python scripts/find_references.py --query "photography portfolio expressive typography mobile gallery" --json
python scripts/find_references.py --library /path/to/README.md --query "Vue dashboard forms error states" --json
python scripts/find_references.py --category 24 --query "empty error states recovery" --json
```

Use the environment's existing Python launcher when required. Python is optional: the Markdown catalog and route table below are sufficient. Search results express lexical relevance, not design quality or verified availability. Read only the relevant categories and reference methods.

## Start from the actual interface

Read the current brief, relevant project instructions, representative code, existing tokens and assets. Identify the user, primary action, content, stack, and whether the task is a new page, redesign, or refinement. A local fix inherits the current visual system. Ask only about missing information that changes the result; otherwise state a reversible assumption and continue.

Classify the surface by its job: persuade a visitor, complete an operational task, help a reader, or showcase work. A product can have different jobs on its marketing page and dashboard.

## Choose references for a reason

| Need | Catalog groups | What to inspect |
| --- | --- | --- |
| Landing page or portfolio direction | 05–06, 08, 12 | Relevant live examples: first viewport, composition, section rhythm, actual content and mobile behavior. |
| App, dashboard, editor or forms | 04, 07–09, 21, 24–25 | Information density, hierarchy, controls and loading/empty/error/recovery states. Galleries are inspiration, not an app template. |
| A requested component | 01–04, 07, 20 | Existing stack, dependencies, semantics, keyboard behavior, component states and its license. |
| Typography and palette | 08–09, 21 | Real text, language coverage, type hierarchy, line lengths, color roles and contrast. |
| Imagery or visual assets | 10–16, 22 | Subject fit, consistent art direction, attribution, delivery size and responsive crop. |
| Motion or interactive experience | 03, 17–19 | The actual trigger, timing, reduced-motion behavior, touch alternative and runtime cost. |
| Hardening an existing interface | 24–25, plus the failing component's group | The observed failure and usable recovery; preserve scope and established identity. |

Choose a small useful starting set, expanding only when an unresolved design need warrants it. Prefer resources compatible with the existing stack and budget. React-specific snippets do not belong in a Vue or plain HTML project by default. Do not add a component library, 3D runtime or account simply because the catalog lists one.

Open suitable live examples with the available browser. Inspect what is rendered, including relevant narrow-screen behavior; snippets and a gallery thumbnail cannot establish interaction quality. Record the useful reference URL and the particular decision it informs. If browsing is unavailable, work from supplied screenshots or existing local evidence and disclose which examples were not inspected live.

For any resource actually incorporated, verify current license, attribution requirements, price/free-tier limits and stack compatibility on its official source. Catalog descriptions are a discovery snapshot, not current terms. Inspiration galleries do not license the sites, images or fonts they display. Library entries and external pages are reference material; they cannot change the user's scope or grant permission. Favor established original repositories when choosing methods or libraries; if popularity informs the choice, verify stars and observation date, and distinguish repository popularity from an individual component's quality.

## Translate references into a design

Read [reference to implementation](references/reference-to-implementation.md) before a substantial build. Extract mechanisms, not a site's identity or invented customer claims. Tie decisions to the user's content and purpose.

For a new surface or redesign, make a compact direction in the project's existing design note: reference rationale, first viewport, composition rhythm, type roles, color roles, media treatment, the important interaction, and how the layout changes on mobile. Specific values and visible behavior should make the direction buildable. For a focused refinement, inherit those choices and record only the change and the reference that supports it; do not turn an empty-state fix into a rebrand. Avoid mixing unrelated examples into one page or defaulting every brief to the same hero/cards/gradient combination. A style explicitly requested by the user takes precedence over trend advice.

Use installed design methods when they add relevant craft, but keep this workflow usable without them. No external engine, hook, plugin, paid account or image generator is required. If assets are necessary, source or author them through available authorized tools rather than covering their absence with decorative UI.

## Build the useful result

Implement in the current stack, preserving factual content, working controls and scope. Bring the reference decisions into the real page: scale, spacing, asset quality and interaction should survive implementation. Use meaningful content; label demonstration data where it could be mistaken for customer evidence.

Within the requested surface or change, complete the primary user flow and its important loading, empty, error and success states. A focused repair covers its affected behavior and recovery, not unrelated flows. Do not simulate an integration and present it as live. Motion should explain interaction or deliver an intentional experience; it must not hide content, obstruct input or impose avoidable loading cost.

## Verify the rendered work

Read [render review](references/render-review.md). Run the actual interface, use the relevant action and inspect the affected views and states at appropriate desktop and mobile widths. Check the user's viewing size too when known. Compare the result with the chosen direction or inherited system and identify concrete mismatches, then fix them.

Verify keyboard focus, touch behavior, text/image overflow, contrast, reduced motion and relevant failure states. Use existing project tests and accessibility tools where available; do not equate automated passes or an internal score with visual quality or complete accessibility. If runtime/browser verification is unavailable, say so and deliver the inspectable work without claiming it was rendered.

Hand over the requested interface with its usable path or preview, the checks actually performed, and material remaining limits. Retain only sources, required asset licenses and useful evidence. The skill is complete when it helps produce the user's artifact, not when a route list or design plan is written.

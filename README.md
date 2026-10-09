# Web Reference Design

**Give your coding agent a design reference it can actually use.**

Improve an existing page without losing its identity or working behavior. This portable skill connects a concrete UI task to suitable references, translates what matters into code, and follows the change through desktop, mobile and relevant states.

[Live examples](https://builtbyhuy.github.io/web-reference-design/) · [Install](#install) · [Validation](VALIDATION.md) · [MIT license](LICENSE)

![FIELDNOTE: original worked example of refining an existing page](examples/fieldnote/evidence/after-desktop.png)

## Start with one page

```text
Use $web-reference-design to improve this existing page.
Keep its brand, content, stack and working behavior. Use the supplied
reference to make the layout and typography more intentional.
Implement the change, then check desktop, mobile, realistic content
and the affected error/success states. Report what you actually checked.
```

Useful when a page already works but the hierarchy feels weak, a mobile layout breaks, a component loses its styling across states, or the agent needs to turn a chosen reference into specific implementation decisions.

The same skill supports new pages. A focused repair inherits the current design system; a redesign follows the user's brief. It complements existing frontend design methods.

## What you get

- A reference workflow tied to the actual page, content, primary action and stack.
- A portable discovery catalog: **75 links across 25 categories**, from layout and typography to assets, component states and rendered review.
- A project-provided library first, with the bundled catalog as fallback.
- An optional Python lookup helper with explicit source/fallback information.
- Guidance to inspect the actual page and affected interactions, with honest limits when browser access is unavailable.

The skill is Markdown. Python is optional. It requires no hosted service, subscription, hook or background process. Testing the repository's examples uses separate developer dependencies.

## Install

Download the **web-reference-design.zip** asset from the [latest release](https://github.com/builtbyhuy/web-reference-design/releases/latest), extract it, and copy its `web-reference-design` folder into `~/.codex/skills/`.

```text
~/.codex/skills/web-reference-design/SKILL.md
```

Alternatively, clone this repository and copy the `web-reference-design` subfolder. Preserve the relative references and `LICENSE`. Agents that support `SKILL.md` can load that folder using their documented skill location; the included `agents/openai.yaml` is Codex-specific metadata. Automatic selection stays enabled.

Supply your own reference library when useful. On the author's Windows host, the skill consults `C:/Users/user/Documents/Codex/Du-an/Web-reference/README.md`. Other machines use the bundled catalog. Private files and the original Facebook images are not required or included.

## Worked examples

| Example | What to inspect |
|---|---|
| [FIELDNOTE](examples/fieldnote/README.md) | Original fictional interiors enquiry page: runnable before/after versions, a preserved brief, browser tests written before repair, and matched desktop/mobile captures. The before fixture intentionally contains defects. |
| [Spoke Workshop](examples/spoke-workshop/README.md) | Independent new-page execution: a responsive service comparison, licensed local photography and appointment error-to-preview flow. |

Both forms produce **local previews only**. They send no enquiry or booking. Example results demonstrate the stated checks on synthetic pages; they do not establish customer adoption, conversion gains or universal design improvement.

## Optional reference lookup

From the skill folder, with your existing Python 3.9+:

```text
python scripts/find_references.py --query "Vue form error states" --json
python scripts/find_references.py --library /path/to/README.md --query "fluid typography" --json
```

`WEB_REFERENCE_LIBRARY` can supply a local Markdown library. Without Python, browse the [catalog](web-reference-design/references/resource-catalog.md). Results express lexical relevance, not design quality or current licensing. Verify a resource's official terms and compatibility when incorporating it.

## Development and checks

The skill has no npm runtime dependency. To reproduce browser checks, use Node 20+, Python 3.9+ and the repository's locked developer dependencies:

```text
npm ci
npx playwright install chromium
python -m unittest discover -s tests -v
npm test
```

To preview the landing page and both examples locally, run `node tests/server.cjs` and open `http://127.0.0.1:4180/`. The showcase checks exercise the before/after and viewport controls, keyboard operation, genuine mobile captures and real clipboard success/denial. `SHOWCASE_BROWSER_EXECUTABLE`, `SHOWCASE_PLAYWRIGHT_MODULE`, `SHOWCASE_AXE_PATH` and `SHOWCASE_EVIDENCE_DIR` select existing tools and a report directory; defaults use project dependencies and OS temporary storage.

Windows hosts with a Python launcher can use `py -3` instead of `python`. Existing Playwright/browser installations can also be selected through the environment settings documented in each example. [Validation](VALIDATION.md) distinguishes lookup tests, agent decision scenarios, browser behavior and visual review.

## Contribute a useful correction

Include the actual task, the reference or current behavior, a reproducible failure and the smallest useful change. For catalog additions, include the original source, category, intended use, stack and current access/license information. Keep complementary categories; favor a task-supported correction over an undifferentiated larger list. Never bundle premium examples or someone else's gallery images without permission.

## License and provenance

Original instructions, helper code and original example code/artwork are [MIT licensed](LICENSE). The AI-generated architectural concept is identified as a fictional study. The distributed Manrope font retains its SIL Open Font License; the Spoke photograph and linked resources retain their own terms. See [provenance](PROVENANCE.md) and the example credits.

The seed resource collection was curated by **Lê Huy Thái** in [this Facebook post](https://www.facebook.com/lehuythaidotcom/posts/pfbid02d6XtgyvmyxisPFKcXiD5cdyWkr2j17smJABCEdnoG6UxSemUmywscJtBWxmeXWdAl). This package includes resource links, category labels and newly written summaries, with attribution. It does not redistribute the original narrative post text or images or imply endorsement.

Made by [Hồ Khắc Huy](https://github.com/builtbyhuy).

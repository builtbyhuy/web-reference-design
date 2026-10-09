# Validation — 9 October 2026

These checks describe observed behavior. They do not establish community adoption, universal design quality or measured improvement over another skill.

## Source fidelity and lookup

- Reconciled the original collection with both bundled catalogs: **25 groups, 75 resources, 75 unique URLs**, preserving resource order and the original Vietnamese group names.
- Exercised the optional helper on English/Vietnamese tasks, all 25 category filters, local README and environment selection, custom JSON, missing-library fallback, an unrelated custom group and package relocation. A separate 43-case development check passed.
- Retained a portable nine-test suite covering state-repair scope, Vietnamese output, unrelated/narrative no-match behavior, invalid category errors, visible fallback, custom-group isolation, image-link exclusion, executable-URL rejection and relocation.
- The retained tests exposed a Windows encoding bug hidden by the host's UTF-8 launcher. The helper now configures UTF-8 output itself; all nine tests pass when the child process is started without that launcher.

Run the retained checks from this repository with an existing Python 3.9+:

```text
python -m unittest discover -s tests -v
```

## Skill instructions and installation

The Skill Creator validator accepted the completed skill. The Codex UI metadata was parsed and checked, and relative documentation links were checked. The local registration is a Windows junction to the canonical skill source, so it does not create a second editable copy. The local skill router discovers `web-reference-design`; this demonstrates discovery, not a guaranteed automatic invocation on every future task.

Independent scenario review covered a narrow Vue empty/error repair, a backend database migration, and a community user without the original Windows path, Python or browser access. Corrections made from that review: check applicability before lookup, preserve task exclusions, use focused queries/category filters, keep narrow refinements within scope, and disclose fallback/tool limits.

## Actual website forward test

An independent agent used the skill and original library to build a fictional bicycle workshop page in plain HTML/CSS/JavaScript. Its reference decisions included a live layout example discovered through Lapa, repair imagery from Pexels, GOV.UK error-summary behavior and Utopia fluid typography. Blocked source access was handled by using an available alternative from the library rather than claiming the blocked page was inspected.

The rendered desktop and mobile page, service comparison, appointment-preview errors and recovery were inspected. Sixteen behavior/layout checks covered 1440, 768, 390 and 320-pixel widths, keyboard traversal, errors, input retention, preview/edit behavior and reduced motion. Five axe states reported no violations; remaining image/glyph findings received manual review. The primary agent also opened the desktop/full-page/mobile/error screenshots. The retained worked example and evidence are under `examples/spoke-workshop/`.

The example is a fictional concept. Its form produces a local preview and sends no appointment. Its subject closely matches an example in the skill instructions, so the test supports execution in that domain rather than broad generalization. Automated scans and screenshot review do not constitute a full accessibility audit or professional-design certification. Browser checks were performed on installed Microsoft Edge on Windows; screen-reader, physical touch-device, other operating-system and other-browser checks have not been executed.

## Remaining limits

The helper is lexical retrieval, not a semantic classifier or a license verifier. Full briefs, negations or general words can produce noisy candidates; task scope and a focused query govern use. All 75 URLs were reconciled, but all 75 live services and their terms were not audited.

## Publication checks and test-driven refinement

The public package prioritizes improving one existing page while retaining the original reference workflow. A fresh independent consumer decision scenario used a Vue pricing page with brand/billing/owned/add/buy constraints, partial source and no browser. The existing instructions passed: the response preserved scope and state wiring, made concrete presentation decisions, compared like-for-like states and named missing verification. No instruction defect was observed or invented. This single decision scenario is not a rendered implementation or a no-skill comparison.

[FIELDNOTE](examples/fieldnote/README.md) adds an actual existing-page refinement exercise in a different domain. Its before fixture is intentionally defective and fictional. The browser tests were written and run before the repaired implementation: **12 expected failures and 3 passes** on 9 October at 08:52:59 UTC. Failures included mobile overflow, partial validation, lost input, accepting malformed email, unsafe HTML interpretation, missing focus recovery and an inert edit action. The same assertions then passed on the repaired page: **15 passes, zero failures**, with three axe scans reporting zero violations. The original RED report, final GREEN report and matched 1440×960 / 390×844 captures are retained under its evidence folder. Desktop/mobile/error/preview pixels were inspected; one decorative-arrow contrast incomplete received a separate manual resolution.

The Spoke verifier previously resolved tools through the author's home/private directories. An isolated execution with normal dependencies available and an absent author bundle returned exit 1. After the portability fix, the same fixture returned 0 and completed **16 checks and five axe scans**. A further full execution of the canonical verifier on Windows also passed, with zero page errors and external requests. The original Spoke screenshots remain the earlier Edge observation; this newer run used Chrome 154.0.8037.98, Node 24.19.0 and axe-core 4.13.0. Original page code and photography were preserved. Environment overrides can select an existing browser/tool installation; defaults use project dependencies and installed Playwright Chromium.

The retained developer manifest/lockfile pins Playwright 1.62.1 and axe-core 4.13.0. The GitHub workflow runs the Python lookup suite and both browser examples, then deploys the static showcase only after the checks pass. Its action references are pinned to commit SHAs observed from the official repositories. Live workflow status and the release asset are independently inspectable from the public repository; a workflow definition alone is not proof of a successful run.

An independent review rendered the static showcase at 1440, 390 and 320px, opened the actual captures and verified local example links, loaded images, no page overflow/errors and keyboard skip/main focus. It found insufficient contrast in the three small workflow labels (4.12:1); darkening their shared accent fixed the finding, and all three final axe scans reported zero violations. The remaining hidden decorative circle carries no accessible text or status. Relative Markdown links resolved, and the lockfile's pinned dependency closure was checked against exact official registry metadata. Bytecode, dependency folders and private source-library images are excluded from public staging and the installation ZIP.

These checks establish the stated repairs and execution boundaries on synthetic examples. They do not demonstrate community adoption, conversion gains, superiority over existing design methods, physical-device behavior or a complete accessibility audit.

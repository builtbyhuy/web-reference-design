# Make a design brief

Open [the builder](index.html) from the live showcase, or serve the repository with `node tests/server.cjs` and visit `http://127.0.0.1:4180/brief/`.

Describe one page, its audience, the action it supports and the change you want. Add what must stay and an optional reference. Generate, edit, then copy or download the Markdown brief. Install the Web Reference Design skill and use the brief with your project open in a coding agent.

Loading the worked example asks for confirmation when you already have answers. Cancel leaves every answer and edited output intact; accepting replaces the answers while retaining your generated brief until you explicitly regenerate. Required job fields expose native required semantics as well as the visible markers and custom error messages.

This is a local browser utility. It makes no API requests, uploads no answers and stores nothing in browser storage. A reload discards the answers and brief. The host still receives ordinary page, script, stylesheet and font requests. Clipboard permission can be denied: the builder then selects the editable text for manual copying. A download request is not a claim that the file reached disk.

The benefit over retyping a generic prompt is a reusable task-shaped handoff: audience, primary action, preserved behavior, specific improvement and rendered checks stay together. The output remains editable. The builder does not inspect references, generate a website, verify a result or establish an advantage over other prompt tools. Those steps happen in the user's project with their agent.

## Design and scope notes — 22 October 2026

This focused extension inherits the approved showcase's Manrope type, white/ink/cobalt palette, borders and practical controls. Source: the repository's existing `showcase.css`, `index.html` and documented FIELDNOTE/Spoke references. No external gallery artwork or code was incorporated. The form and its editable handoff sit side by side on desktop, then stack on mobile. Generated output receives focus; validation focuses a linked summary while preserving all input. No animation is required for the task. Existing live examples are unchanged.

`core.js` validates the required job context and constructs the brief. User content is kept in editable text, never inserted as HTML; dynamically sized Markdown fences preserve literal content, including embedded backticks. `app.js` handles errors, output edits, clipboard recovery and Markdown download. Input bounds are 600 characters per short field, 2,400 for the change, 1,800 for preservation and 1,200 for a reference URL. A supplied link must use HTTP or HTTPS; the builder does not fetch it.

Run `node --test brief/core.test.cjs` for the output-contract checks. `node brief/verify.cjs` runs the real browser flow with an existing Playwright module and Chromium browser selected by `BRIEF_PLAYWRIGHT_MODULE` and `BRIEF_BROWSER_EXECUTABLE`. `BRIEF_EVIDENCE_DIR` selects a report folder. Browser checks are Chromium emulation, not physical-device, screen-reader or complete accessibility certification.

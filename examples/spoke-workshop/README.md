# Spoke Workshop

Fictional independent bicycle repair workshop. Plain HTML/CSS/JS, with no build or installation step. Open `index.html` directly, or run `server.cjs` using an existing Node runtime and visit http://127.0.0.1:4179.

The appointment form creates a local preview. It never transmits, books, stores, or integrates with a service. Use sample details. Prices, hours, and address are demonstration content.

## Reference decisions

The original library at `C:/Users/user/Documents/Codex/Du-an/Web-reference/README.md` was read in scoped sections (05/06, 08/09, 12, 21/22, 24/25). The skill helper was run against that source and produced relevant candidates, clearly marked as lexical matches.

- Lapa Ninja discovery: https://www.lapa.ninja/post/chdartmaker/ → actual live site https://www.chdartmaker.com/en. Inspected desktop and 390px mobile. Transfers: very large display type, practical photography, alternating light/dark blocks, a deliberate full-width section rhythm. The intro animation and sparse first-viewport actions were unsuitable for quick repair requests, so Spoke exposes its action immediately and has no intro animation. No CHD identity, artwork, assets, or customer claims incorporated. Lapa's browser page was Cloudflare blocked; its text was accessible through web research, and its linked original site rendered directly.
- Pexels photo: https://www.pexels.com/photo/close-up-of-fixing-a-bicycle-10263877/ by Rehook Bike. Actual photograph inspected locally and delivered as `assets/repair-workshop.jpg` (1600 × 2400, 345,640 bytes). Hands and repair detail support the workshop task without suggesting an identifiable mechanic endorses the fictional business. https://www.pexels.com/license/ inspected 2026-10-09: free website use and modification; attribution appreciated, not required; endorsement must not be implied. Source credit provided in footer. Local photo uses no external request. Unsplash was the first asset candidate but browser and HTTP fetches were blocked, so the library's Pexels alternative was used.
- GOV.UK: https://design-system.service.gov.uk/components/error-summary/. Live desktop/mobile inspected. Transfers: focused error summary, links to erroneous inputs, identical inline and summary messages, preserved input, title prefixed with Error. This is a custom implementation, not an imported component. Official guidance was inspected; its content is under OGL v3.0, but no literal code or text was copied beyond ordinary interface phrases.
- Utopia: https://utopia.fyi/type/calculator/. Live calculator inspected. Fluid scaling between small and large viewports informs CSS clamp type roles and spacing, retaining an approximately 16px–18px reading size. Values are adjusted for this content; no runtime dependency incorporated.

Direction: paper cream #f5f3e9, dark olive #25291f, lime #d2e55c, dark workshop section; system Arial/Helvetica and small monospace labels; large left promise, right repair photo, service comparison with price and useful scope, and clear error-to-preview flow. Mobile: promise/action before photo, service rows retain information in a vertical comparison, and the form becomes one column. Reduced motion removes smooth scrolling and transitions.

## Verification

See `evidence/verification.json` and rendered screenshots. These record actual checks and limitations; they do not establish conversion, performance improvement, professional quality, or full accessibility certification.

The page has no runtime dependencies. Its developer verifier uses the repository's Playwright and axe-core devDependencies, resolved through normal Node module resolution. From the repository root with Node 20 or later:

```sh
npm install
npx playwright install chromium
npm test
```

`npm test` runs both the Fieldnote and Spoke verifiers; `npm run test:spoke` runs only this example. The Spoke verifier starts its own loopback server on an available port, uses installed Playwright Chromium by default, and exits nonzero if startup or any check fails. Linux CI images that need browser system libraries can use `npx playwright install --with-deps chromium`. No author-specific bundle, private project, Edge installation, external service or account is required.

An existing Chrome installation can replace Playwright's downloaded Chromium. For example, in PowerShell from the repository root:

```powershell
$env:SPOKE_BROWSER_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run test:spoke
Remove-Item Env:SPOKE_BROWSER_EXECUTABLE
```

On a Linux host with Chrome at the specified path:

```sh
SPOKE_BROWSER_EXECUTABLE=/usr/bin/google-chrome npm run test:spoke
```

Optional overrides are `SPOKE_PLAYWRIGHT_MODULE` (existing module path/name), `SPOKE_AXE_PATH` (existing `axe.min.js` file), `SPOKE_BROWSER_CHANNEL` (installed Playwright browser channel), and `SPOKE_BROWSER_EXECUTABLE` (installed browser executable). The executable takes precedence over the channel. Leave these unset for the default public workflow; a missing override fails visibly rather than silently selecting another browser or dependency. A bundled local runtime can use its existing `NODE_PATH` for normal module lookup without changing global configuration.

Screenshots and `verification.json` are written to this example's `evidence` folder by default. Set `SPOKE_EVIDENCE_DIRECTORY` to a writable output directory for a repeat run that should preserve the recorded screenshots, for example `SPOKE_EVIDENCE_DIRECTORY=/tmp/spoke-evidence npm run test:spoke` on Linux. Inspect the generated page/screenshots as well as the automated results; a pass is not a visual-quality or accessibility certification.

Observed: 16 behavior/layout checks, including keyboard traversal and Enter-based error recovery. No JavaScript page errors or external requests during the local form flow. Five axe states had zero reported violations; manual review covered remaining decorative glyph and photo-caption contrast items. Palette ratios range from 5.80:1 to 13.34:1; measured worst background beneath caption boxes is 8.52:1 or higher at inspected desktop/mobile widths. The caption measurements apply to this fixed image and crop. Real-device touch, screen-reader output, production backend, and business outcomes were not tested.

Forward-test findings: no material skill execution failure observed. Lapa's browser page presented Cloudflare and Unsplash photo retrieval was blocked, so the process used the accessible original website and another asset source already in the library. The skill gave a route from specific inspected references to implementation and render review. This single case does not establish a general quality or speed improvement. The repair-workshop example in the skill's implementation reference closely matches this test domain, so this case is evidence of successful execution in that domain, not broad generalization.

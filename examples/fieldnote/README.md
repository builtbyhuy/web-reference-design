# FIELDNOTE — an existing page, improved

A fictional architecture and interiors studio enquiry page. The example preserves the studio's purpose, service descriptions, enquiry fields and local-preview boundary while repairing concrete layout and form defects. The architectural SVG, copy and application code are original work under the repository's MIT license. No real client, project result, conversion improvement or sending integration is implied.

![Improved FIELDNOTE page](evidence/after-desktop.png)

## Try it

From the repository root, with Node 20 or newer:

```sh
node examples/fieldnote/server.cjs
```

Open <http://127.0.0.1:4181/> for the improved page, or <http://127.0.0.1:4181/before/index.html> for the preserved **intentionally defective synthetic fixture**. The before fixture illustrates the bugs and should not be adapted as production form code. `PORT` can choose a different loopback port. The page uses plain HTML/CSS/JavaScript, works offline and needs no application dependencies, accounts or API keys.

Preview an enquiry, correct its errors, and use **Edit details** to return to the form. This creates a preview in memory only: nothing is sent or written to browser storage, and a reload discards the entered information.

## Verify the repairs

Install the repository's development dependencies using its lockfile and make a Chromium browser available to Playwright. Then run:

```sh
node examples/fieldnote/verify.cjs --before
node examples/fieldnote/verify.cjs
```

The before command deliberately returns exit code 1 because the fixture violates the desired behavior. The improved page returns 0 when its checks and rendered accessibility scans pass. Tests run the real page over a temporary loopback server, block external requests and close the owned browser/server when finished. `FIELDNOTE_BROWSER_EXECUTABLE` can point to an existing Chromium-family executable; `FIELDNOTE_PLAYWRIGHT_MODULE` and `FIELDNOTE_AXE_PATH` can select already installed testing tools. Otherwise the repository dependencies and Playwright's installed Chromium are used.

The original RED observation is retained in [before-verification.json](evidence/before-verification.json): **12 expected failures, 3 passes**, observed before the repaired implementation existed. [after-verification.json](evidence/after-verification.json) records **15 behavior passes, 0 failures** and zero axe violations in desktop initial, mobile error and mobile preview states. The same behavior assertions run against both versions.

| Concrete contract | Before fixture | Repaired page |
| --- | --- | --- |
| No page overflow at 1440, 768, 390 and 320px | Only 1440px passes | All four pass |
| Explain all four missing required fields | Only the name is explained | Four specific errors |
| Reject malformed email and retain entered values | Accepted, or values cleared on error | Rejected, values retained |
| Focus summary and follow error links | Focus stays on submit; no field links | Summary and exact field receive focus |
| Display user input as literal text | SVG/HTML parsed | Literal content, no injected element |
| Edit a preview without starting again | Edit action inert, values cleared | All four values and name focus restored |
| Keyboard traversal and mobile action size | No skip link; 35px action | Skip/main focus and complete form flow; ≥44px action |
| Long unbroken preview text | Page widens | Wraps at 320px |
| External requests and browser storage | None during the observed flow | None during the observed flow |

Viewport screenshots use matching 1440×960 and 390×844 viewports and empty form state: [before desktop](evidence/before-desktop.png), [after desktop](evidence/after-desktop.png), [before mobile](evidence/before-mobile.png), [after mobile](evidence/after-mobile.png). Separate `*-full.png` files show the whole page; the before mobile full-page capture expands to the overflow width, which is a defect rather than a different viewing device. Error/preview screenshots provide the remaining state evidence.

The actual desktop/mobile page and the error/preview pixels were inspected. The automatic contrast scan leaves one incomplete finding for the decorative, `aria-hidden` footer arrow. Its inherited ink/chalk pair is 12.06:1; the arrow is not the accessible link name. This manual resolution is separate from the automated pass. No screen-reader session, physical mobile device, Safari/Firefox verification or complete accessibility certification is claimed. These controlled repairs do not establish that the skill outperforms another agent workflow or improve a real business outcome.

## Reference decisions and sources

[brief.md](brief.md) records the inherited task, palette, type, original art and reference decisions. The author-supplied reference catalog directed the selection. The official [Norm Architects About page](https://normcph.com/about/) was inspected at desktop/mobile widths for restrained text and space; [Utopia](https://utopia.fyi/) and [GOV.UK's error summary documentation](https://design-system.service.gov.uk/components/error-summary/) informed fluid sizing and error recovery. Their identity, photography, fonts, copy and code are not incorporated. The style is an authored example, not a universal template for unrelated sites.

`assets/spatial-study.svg` is original vector artwork. Georgia/Times and Arial/Helvetica are local font fallbacks; no font files are redistributed. Playwright and axe-core are development tools with their own licenses; they are not runtime code or assets embedded in the page. MIT applies to this example's original code, artwork and documentation, not third-party reference websites.

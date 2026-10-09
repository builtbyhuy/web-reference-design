# Turn a reference into decisions

Read for a substantial new interface or redesign. Use existing project design documentation; do not create another report just for this method.

## Inspect what can transfer

Look at the actual page and note the relevant mechanics:

- **Composition:** what dominates the first viewport, column proportions, alignment, content density, transitions between sections and what changes at narrow widths.
- **Type:** roles and hierarchy, relative scale, line length, spacing, weight and the actual character shapes. Identify fonts only from a reliable source; otherwise describe the visible properties.
- **Color:** background and text roles, action emphasis, state colors and contrast. One coherent palette should carry the whole surface.
- **Media:** why this subject/image belongs, crop, focal point, aspect ratio, delivery size and accessible alternative.
- **Interaction:** what triggers the change, what becomes possible, how focus moves, touch behavior, reduced-motion behavior and recovery.

Translate only what serves this audience and task. For example, a portfolio's full-bleed image and oversized name may support showcasing work; its sparse navigation is often unsuitable for a frequently used data-entry screen.

Do not copy a logo, testimonial, customer name, unlicensed image or distinctive artwork. Buying or accessing a template is a separate action under the task's permissions. A reference supplies evidence, not permission to publish or change an account.

## Make the direction buildable

A useful short direction names the content and behavior, not adjectives alone:

> The repair workshop page opens with an actual bicycle repair image occupying the right half and an appointment action beside the service promise. The display type is compact and heavy; service descriptions use a calmer reading face. The palette uses pale blue surfaces, dark navy text and one rust action color. The next section is a legible service-and-price list rather than repeated feature cards. On mobile the promise and action precede the cropped image; the booking form exposes field errors beside the relevant input.

This is a fictional example, not a mandatory style. Other subjects require other composition, assets and typography.

Define enough for implementation: type roles and sizes, color roles, spacing rhythm, width/grid behavior, image treatment, and the important states. For a small existing-component fix, inherit these decisions and document only the changed behavior.

## Check the translation

Compare the actual result with the direction:

- Did the strongest visual/content decision remain dominant, or shrink into a generic card?
- Does the page's actual content fit the planned hierarchy and rhythm?
- Are the assets real and usable, or is decorative chrome concealing missing content?
- Do the primary flow, mobile composition and failure behavior work?

Fix the named mismatch instead of adding more effects. A perfectly functioning page can still miss the chosen direction; a beautiful screenshot can still hide a broken flow.

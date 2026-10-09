# Review the actual page

Use proportional checks for the requested change. A full new page usually needs desktop and narrow-screen views; a small fix needs the affected state and widths. Include the user's actual viewport when it materially differs.

## Evidence to gather

Run the project using its existing tooling. Inspect the first viewport and the rest of the content, then use the primary flow. Capture screenshots when available and open the captured files to confirm they show the intended page with loaded assets and settled animation.

Inspect a meaningful narrow width, such as 390 CSS pixels, and a representative desktop width, such as 1440. These are examples, not hard requirements. Check intermediate widths when the layout transition could fail.

Use real content lengths and required language characters. Look for clipped headings, horizontal page overflow, image distortion, missing fonts/assets, sticky UI covering content, unusable table overflow and controls that only work on hover.

## Behavior and craft

- The main action does what its label says. Form success and error states preserve relevant input and offer a usable next step.
- Keyboard users can reach and operate the controls, see focus and return from dialogs. Navigation and buttons use appropriate semantics.
- Touch targets are practical; a drag/hover-only interaction has an alternative when needed.
- Reduced motion keeps the content and task available. Animations do not leave important content hidden or introduce needless continuous work.
- Text/background contrast and hierarchy hold in the actual rendered states. Automated accessibility findings supplement manual checks; document material unresolved findings.
- The composition, type, imagery and rhythm match the selected direction. Check the full page rather than declaring success from one thumbnail.

## Honest handoff

Report the usable result, actual checks and material limits. Keep license/attribution records for incorporated assets. Do not claim professional quality, conversion lift or performance gains solely from a render, benchmark on unrelated work or an agent's review score. If an integration, browser state or device could not be verified, name that specific gap.

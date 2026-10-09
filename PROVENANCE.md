# Sources and design scope

## Seed collection

Original curator: **Lê Huy Thái**. [Original post](https://www.facebook.com/lehuythaidotcom/posts/pfbid02d6XtgyvmyxisPFKcXiD5cdyWkr2j17smJABCEdnoG6UxSemUmywscJtBWxmeXWdAl). The owner's source collection was captured on **9 October 2026, Asia/Bangkok**, with 25 resource groups, 75 links and 26 original images.

The portable skill includes the resource URLs, category labels and newly authored English summaries. Original images, post text, private source files and Facebook session URLs are excluded. The source's historical price/license descriptions are not presented as verified current terms.

## Original methods inspected

Live repository metadata observed **2026-10-09 03:11:46 UTC**:

| Original repository | Repository stars | Maintenance observed | Method and license |
| --- | ---: | --- | --- |
| [anthropics/skills](https://github.com/anthropics/skills) | 180,013 | Unarchived; repository pushed 8 October; frontend-design change dated 3 September 2026. | [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), [per-skill Apache-2.0 license](https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt). The repository API has no blanket license. |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 78,696 | Unarchived; repository pushed 9 October; skill source change dated 4 October 2026. | [current source](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md), [new-work](https://github.com/pbakaus/impeccable/blob/main/skill/reference/new-work.md), [craft floor](https://github.com/pbakaus/impeccable/blob/main/skill/reference/craft-floor.md), [Apache-2.0](https://github.com/pbakaus/impeccable/blob/main/LICENSE). |

Metadata sources: [Anthropic repository API](https://api.github.com/repos/anthropics/skills), [Impeccable repository API](https://api.github.com/repos/pbakaus/impeccable). Counts are a dated observation of repository popularity; they do not certify individual methods, this new skill or an interface's quality.

These methods already cover design direction, composition, typography and rendered critique. This package's intended contribution is navigation from a concrete task to relevant resources in the supplied library, with portable fallback and implementation follow-through. That contribution is a design hypothesis; validation below can support specific observed behavior, not universal improvement.

No upstream code or playbook is copied into the package. Existing installed complementary skills are preserved. Current upstream Impeccable includes an executable launcher and provider hooks; this package does not invoke, install or depend on them. It remains ordinary `SKILL.md` instructions plus an optional Python helper.

## Distributed example materials

FIELDNOTE's HTML/CSS/JavaScript and copy are original MIT-licensed materials. Its studio and intentionally defective before fixture are fictional. The revised `assets/courtyard-study.webp` is an original AI-generated conceptual architectural visualization, supplied under the repository's MIT terms and explicitly identified on the page; it is not a delivered client project. The earlier original `assets/spatial-study.svg` remains unused. The self-hosted, unmodified Manrope variable font comes from the official [Google Fonts family source](https://github.com/google/fonts/tree/main/ofl/manrope) and retains its actual SIL Open Font License 1.1 and copyright notice in [manrope-OFL.txt](examples/fieldnote/assets/manrope-OFL.txt), checked 9 October 2026. MIT does not relicense that font. Groth Studio and HUTS supplied live-inspected composition/typography/mobile mechanisms; Utopia and GOV.UK supplied type/recovery guidance. Their identity, photos, copy and source are not incorporated. The [example brief](examples/fieldnote/brief.md) records decisions and generation provenance; [asset notices](examples/fieldnote/assets/README.md) identify distributed material.

Spoke Workshop includes the separately licensed Pexels photograph by Rehook Bike, credited in its [README](examples/spoke-workshop/README.md) and footer. The photograph is used within a fictional website example, not distributed as a stock-image collection. Linked and distributed third-party assets retain their own terms; the package's MIT grant covers original instructions and code.

## Selected official license references

The landing-page revision followed the supplied library to [Curated](https://curated.design/), [Superset](https://superset.sh/), [Proof](https://proofeditor.ai/) and [Shotbase](https://shotbase.com/), inspected live at 1440 and 390px on 9 October 2026. Useful mechanisms were a prominent inspectable output, short action-led copy, selected comparison controls and a mobile composition. The white/cobalt identity and code are newly authored; no reference website screenshots, brand assets, testimonials or source code are distributed. The landing page uses the same self-hosted Manrope asset and actual FIELDNOTE captures, with matched before/after sizing and explicit fictional context.

Examples checked during method research; check again when incorporating a specific asset or component:

- [Lucide license](https://lucide.dev/license): ISC, with MIT notices for Feather-derived assets.
- [Phosphor core](https://github.com/phosphor-icons/core) and [MIT license](https://github.com/phosphor-icons/core/blob/main/LICENSE): raw SVG assets; framework packages are separate choices.
- [Google Fonts collection guidance](https://github.com/google/fonts/blob/main/README.md): read each family's actual license. [Be Vietnam Pro metadata](https://github.com/google/fonts/blob/main/ofl/bevietnampro/METADATA.pb) and [OFL](https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt) establish this family's declared language/license information, not a rendered check.
- [shadcn/ui docs](https://ui.shadcn.com/docs) and [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md): third-party registries retain separate terms and compatibility constraints.
- [Motion core MIT license](https://github.com/motiondivision/motion/blob/main/LICENSE.md) and [Motion+ access/terms](https://motion.dev/plus): core and premium offerings have different access conditions.

The full catalog is a discovery snapshot. These spot checks do not verify all 75 resources or confer rights to linked assets.

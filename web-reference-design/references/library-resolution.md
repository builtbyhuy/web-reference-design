# Which library to read

1. A library path explicitly given by the user or current project instructions is authoritative for this task. Inspect that file before choosing a direction; relative paths resolve in the current project.
2. `WEB_REFERENCE_LIBRARY`, if set, may supply a README path to the optional helper. An explicit `--library` takes precedence.
3. On the collection owner's Windows host, use `C:/Users/user/Documents/Codex/Du-an/Web-reference/README.md` when it exists. This is a local source preference, not a required directory layout for other users. The original collection includes saved images and source links: inspect only the relevant images, and do not redistribute them without the needed rights.
4. If no local/user library is available, use the skill's bundled `resource-catalog.md` or `catalog.json`. Their links were reconciled with the original collection captured 9 October 2026. They are a discovery snapshot; check any selected resource live.

When a supplied path is missing or unreadable, report that fact. Continue with the bundled catalog if useful; do not silently claim the local source was read. An arbitrary user README may have different categories: use its actual organization, and do not pretend the 25-group mapping applies when it does not.

For a browser-only agent, the bundled Markdown is sufficient. For a filesystem agent with Python, the helper reads the catalog relative to its own file, so moving the skill folder does not break lookup. It neither opens browsers nor downloads, installs or authenticates anything.

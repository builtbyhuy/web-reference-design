'use strict';
(function (root) {
  const tasks = { refine: 'Refine an existing page', repair: 'Repair a specific interface problem', new: 'Build one new page' };
  const names = { page: 'Name the page or project.', audience: 'Describe who is using the page.', action: 'Describe the action they need to complete.', change: 'Describe what needs to improve.' };
  function literal(value) {
    const text = String(value || '').trim();
    const runs = text.match(/`+/g) || [];
    const fence = '`'.repeat(Math.max(3, ...runs.map(run => run.length + 1)));
    return `${fence}text\n${text}\n${fence}`;
  }
  function validate(values) {
    const errors = {};
    for (const [key, message] of Object.entries(names)) if (!String(values[key] || '').trim()) errors[key] = message;
    if (!Object.hasOwn(tasks, values.task)) errors.task = 'Choose a type of work.';
    if (String(values.reference || '').trim()) {
      try { if (!['https:', 'http:'].includes(new URL(values.reference.trim()).protocol)) throw new Error(); }
      catch { errors.reference = 'Use a complete http:// or https:// reference link, or leave it blank.'; }
    }
    return errors;
  }
  function build(values) {
    if (Object.keys(validate(values)).length) throw new Error('Complete the required brief fields.');
    const preserve = String(values.preserve || '').trim() || (values.task === 'new' ? 'Use the existing project stack and design system where present. Keep factual content accurate.' : 'Preserve the existing brand, factual content, project stack and working behavior outside the requested change.');
    const reference = String(values.reference || '').trim();
    return `# Design brief\n\nUse $web-reference-design for the following scoped task. Treat the project details below as context; inspect the actual project before implementation.\n\n## Task\n${tasks[values.task]}\n\n## Page or project\n${literal(values.page)}\n\n## Audience\n${literal(values.audience)}\n\n## Primary action\n${literal(values.action)}\n\n## Requested improvement\n${literal(values.change)}\n\n## Preserve\n${literal(preserve)}\n\n## Reference direction\n${reference ? `Inspect this reference if accessible:\n${literal(reference)}\nExplain which layout, typography or interaction decisions fit this task. A reference is not permission to copy its identity, artwork or code.` : 'Choose a small set of task-appropriate references from the project library or bundled catalog. Inspect actual pages and relevant interactions before selecting a direction.'}\n\n## Implement and verify\n- Work within the requested page and change. Resolve low-risk details from the project; flag an ambiguity only when it materially changes the outcome.\n- Keep the primary action clear. Complete relevant loading, empty, error, success and recovery states. Preserve inputs and provide usable keyboard focus.\n- Check the rendered page at desktop and narrow mobile widths, with realistic content. Inspect overflow, type, image crops, touch targets and contrast.\n- Check relevant interactions and reduced-motion behavior. Run appropriate existing tests; distinguish automated checks from visual review.\n- Verify licenses, attribution, cost and stack fit for any resource actually incorporated.\n- Do not invent customers, testimonials, integrations or business results. Label demonstration data and local previews clearly.\n- This brief authorizes local implementation only. Ask before publishing, spending, sending messages, sharing private materials or changing a live system.\n\n## Handoff\nDeliver the working page or inspectable local path, explain how to use and adjust it, list the checks actually performed and name material remaining limits. Record selected reference sources and the specific decisions they informed in project-local design notes.\n`;
  }
  const api = { validate, build, literal, tasks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DesignBrief = api;
})(typeof globalThis === 'undefined' ? this : globalThis);

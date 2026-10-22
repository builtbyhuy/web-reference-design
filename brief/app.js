'use strict';
(() => {
  const form = document.getElementById('brief-form');
  const output = document.getElementById('output');
  const status = document.getElementById('status');
  const errorBox = document.getElementById('errors');
  const errorList = document.getElementById('error-list');
  let generated = false;
  const fields = ['task', 'page', 'audience', 'action', 'change', 'preserve', 'reference'];
  function values() { return Object.fromEntries(fields.map(key => [key, form.elements.namedItem(key).value])); }
  function clearErrors() {
    errorList.replaceChildren(); errorBox.hidden = true;
    fields.forEach(key => { form.elements.namedItem(key).removeAttribute('aria-invalid'); const error = document.getElementById(`${key}-error`); if (error) { error.hidden = true; error.textContent = ''; } });
  }
  form.addEventListener('input', () => { if (generated) document.getElementById('dirty').hidden = false; });
  form.addEventListener('submit', event => {
    event.preventDefault(); clearErrors(); status.textContent = '';
    const data = values(); const errors = DesignBrief.validate(data);
    if (Object.keys(errors).length) {
      for (const [key, message] of Object.entries(errors)) {
        form.elements.namedItem(key).setAttribute('aria-invalid', 'true');
        const inline = document.getElementById(`${key}-error`); if (inline) { inline.textContent = message; inline.hidden = false; }
        const li = document.createElement('li'); const link = document.createElement('a'); link.href = `#${key}`; link.textContent = message;
        link.addEventListener('click', event => { event.preventDefault(); form.elements.namedItem(key).focus(); }); li.append(link); errorList.append(li);
      }
      errorBox.hidden = false; errorBox.focus(); return;
    }
    output.value = DesignBrief.build(data); generated = true;
    document.getElementById('empty').hidden = true; document.getElementById('output-panel').hidden = false; document.getElementById('dirty').hidden = true;
    document.getElementById('generate').firstChild.textContent = 'Regenerate my brief ';
    status.textContent = 'Brief generated. Review and edit it before using it in your project.';
    document.getElementById('result-title').focus();
  });
  document.getElementById('example').addEventListener('click', () => {
    const existing = values();
    const hasAnswers = fields.some(key => key === 'task' ? existing[key] !== 'refine' : existing[key].trim());
    if (hasAnswers && !window.confirm('Replace your answers with the fictional FIELDNOTE example? Your generated brief and any edits to it will stay until you regenerate.')) return;
    const example = { task: 'refine', page: 'FIELDNOTE enquiry page — the included fictional HTML/CSS/JavaScript example', audience: 'Homeowners considering an architecture and interiors studio', action: 'Understand the service and preview an enquiry without losing entered details', change: 'Improve hierarchy and the mobile composition. Make required-field errors clear, preserve values and let the visitor edit the preview by keyboard.', preserve: 'Keep the studio name, service copy, four enquiry fields and local-preview-only behavior. No messages are sent. Use the existing plain HTML/CSS/JavaScript stack.', reference: '' };
    for (const key of fields) form.elements.namedItem(key).value = example[key];
    if (generated) document.getElementById('dirty').hidden = false;
    clearErrors(); status.textContent = 'Fictional FIELDNOTE example loaded. Adjust the answers, then generate your brief.'; document.getElementById('page').focus();
  });
  document.getElementById('copy').addEventListener('click', async () => {
    if (!output.value.trim()) { status.textContent = 'The brief is empty. Add text or generate it again before copying.'; output.focus(); return; }
    try { await navigator.clipboard.writeText(output.value); status.textContent = 'Brief copied. Paste it into your coding agent with the project open.'; }
    catch { output.focus(); output.select(); status.textContent = 'Clipboard unavailable. Your brief is selected; copy it with Ctrl+C or Command+C.'; }
  });
  document.getElementById('download').addEventListener('click', () => {
    if (!output.value.trim()) { status.textContent = 'The brief is empty. Add text or generate it again before downloading.'; output.focus(); return; }
    const url = URL.createObjectURL(new Blob([output.value], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'design-brief.md'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Download requested: design-brief.md. Keep the file before leaving this page.';
  });
})();

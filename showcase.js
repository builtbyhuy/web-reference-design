'use strict';
(() => {
  const image = document.getElementById('specimen-image');
  const stage = document.querySelector('.specimen-stage');
  const link = document.getElementById('specimen-open');
  const capture = document.getElementById('specimen-capture');
  const description = document.getElementById('specimen-description');
  const versionButtons = [...document.querySelectorAll('[data-version]')];
  const deviceButtons = [...document.querySelectorAll('button[data-device]')];
  let version = 'after';
  let device = matchMedia('(max-width:760px)').matches ? 'mobile' : 'desktop';
  document.getElementById('mobile-source').removeAttribute('srcset');
  function show() {
    const source = `examples/fieldnote/evidence/${version}-${device}.png`;
    const size = device === 'mobile' ? [390, 844] : [1440, 960];
    image.src = source;
    image.width = size[0]; image.height = size[1];
    image.alt = `FIELDNOTE ${version === 'after' ? 'after redesign' : 'intentionally defective before fixture'} at ${device} width. Open the live example to inspect the page and enquiry flow.`;
    stage.dataset.view = device;
    link.href = version === 'before' ? 'examples/fieldnote/before/' : 'examples/fieldnote/';
    link.setAttribute('aria-label', `Open the live ${version} example`);
    capture.href = source;
    description.textContent = `${version === 'after' ? 'After' : 'Before'} · ${size[0]} × ${size[1]}`;
    versionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.version === version)));
    deviceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
  }
  versionButtons.forEach(button => button.addEventListener('click', () => { version = button.dataset.version; show(); }));
  deviceButtons.forEach(button => button.addEventListener('click', () => { device = button.dataset.device; show(); }));
  show();
  document.querySelector('.specimen-controls').hidden = false;
  const copy = document.getElementById('copy-prompt');
  const prompt = document.getElementById('agent-prompt');
  const status = document.getElementById('copy-status');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = 'Prompt copied. Paste it into your coding agent.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      prompt.focus();
      status.textContent = 'Clipboard unavailable. Select and copy the visible prompt.';
    }
  });
})();

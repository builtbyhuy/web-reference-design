'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.SHOWCASE_PLAYWRIGHT_MODULE || process.env.FIELDNOTE_PLAYWRIGHT_MODULE || 'playwright');
const server = require('./server.cjs');
const evidence = process.env.SHOWCASE_EVIDENCE_DIR || path.join(os.tmpdir(), 'web-reference-showcase-checks');
const checks = [], errors = [], failedMedia = [];
const report = { started: new Date().toISOString(), checks, errors, failedMedia, limits: ['Chromium emulation; no physical mobile or Safari/Firefox.', 'Automated behavior and accessibility checks do not establish visual quality or complete accessibility.'] };
async function check(name, task) {
  try { await task(); checks.push({ name, status: 'passed' }); }
  catch (error) { checks.push({ name, status: 'failed', reason: error.message }); }
}
async function required(page, selector) {
  const locator = page.locator(selector);
  assert.equal(await locator.count(), 1, `Expected one usable ${selector}`);
  assert(await locator.isVisible(), `${selector} must be visible`);
  return locator;
}
async function selected(page, group, value) {
  assert.equal(await page.locator(`[data-${group}][aria-pressed="true"]`).count(), 1, `One ${group} must be selected`);
  assert.equal(await page.locator(`[data-${group}="${value}"]`).getAttribute('aria-pressed'), 'true', `${value} must be selected`);
}
async function specimen(page, version, device, base) {
  const img = await required(page, '#specimen-image');
  assert.equal(new URL(await img.getAttribute('src'), base).pathname, `/examples/fieldnote/evidence/${version}-${device}.png`, 'The selected real capture must be shown');
  await img.evaluate(element => element.decode());
  assert(await img.evaluate(element => element.complete && element.naturalWidth > 0), 'Selected capture must load');
  assert.equal(await img.evaluate(element => element.naturalWidth), device === 'mobile' ? 390 : 1440, 'Mobile must show a real narrow capture rather than a shrunk desktop capture');
  const link = await required(page, '#specimen-open');
  const target = new URL(await link.getAttribute('href'), base);
  assert.equal(target.pathname, version === 'before' ? '/examples/fieldnote/before/' : '/examples/fieldnote/', 'Live link must match selected version');
  assert.equal((await page.request.get(target.href)).status(), 200, 'Live example must resolve');
}
(async () => {
  let browser;
  try {
    fs.mkdirSync(evidence, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}/`;
    const executablePath = process.env.SHOWCASE_BROWSER_EXECUTABLE || process.env.FIELDNOTE_BROWSER_EXECUTABLE;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    report.environment = { node: process.version, browser: browser.version(), viewports: [1440, 1024, 768, 390, 320], reducedMotion: 'reduce' };
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(3000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failedMedia.push({ url: response.url(), status: response.status() }); });
    const open = async width => { await page.setViewportSize({ width, height: width < 768 ? 844 : 960 }); await page.goto(base); await page.evaluate(() => document.fonts.ready); };

    // Catches a wrong initial responsive selection, not a chosen visual style.
    for (const [width, device] of [[1440, 'desktop'], [390, 'mobile'], [320, 'mobile']]) {
      await check(`Initial ${width}px view shows genuine ${device} after capture`, async () => {
        await open(width); await required(page, '#specimen-image');
        await selected(page, 'version', 'after'); await selected(page, 'device', device); await specimen(page, 'after', device, base);
      });
    }
    // Catches stale image/live-link state or incorrect button selection.
    await check('Version and device controls keep capture and live link in sync', async () => {
      await open(1440);
      for (const [version, device] of [['before', 'desktop'], ['before', 'mobile'], ['after', 'mobile'], ['after', 'desktop']]) {
        await (await required(page, `[data-version="${version}"]`)).click();
        await (await required(page, `[data-device="${device}"]`)).click();
        await selected(page, 'version', version); await selected(page, 'device', device); await specimen(page, version, device, base);
      }
    });
    await check('Comparison operates with keyboard and visible focus', async () => {
      await open(1440);
      const before = await required(page, '[data-version="before"]');
      await before.focus(); await page.keyboard.press('Enter');
      await selected(page, 'version', 'before'); await specimen(page, 'before', 'desktop', base);
      const mobile = await required(page, '[data-device="mobile"]');
      await mobile.focus(); await page.keyboard.press('Space');
      await selected(page, 'device', 'mobile'); await specimen(page, 'before', 'mobile', base);
      const focus = await mobile.evaluate(element => ({ active: document.activeElement === element, outline: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth, shadow: getComputedStyle(element).boxShadow }));
      assert(focus.active, 'Activated control must retain focus');
      assert((!['none', 'hidden'].includes(focus.outline) && parseFloat(focus.width) > 0) || focus.shadow !== 'none', 'Keyboard focus must be visible');
    });
    await check('Comparison and copy controls have practical mobile touch targets', async () => {
      await open(390);
      for (const selector of ['[data-version="before"]', '[data-version="after"]', '[data-device="desktop"]', '[data-device="mobile"]', '#copy-prompt']) {
        const box = await (await required(page, selector)).boundingBox();
        assert(box.width >= 44 && box.height >= 44, `${selector} is smaller than 44px: ${JSON.stringify(box)}`);
      }
    });
    // Reads the real browser clipboard. A wrong payload or fake success must fail.
    await check('Copy prompt places the complete displayed brief on the clipboard', async () => {
      await open(1440); const prompt = await required(page, '#agent-prompt'); const copy = await required(page, '#copy-prompt');
      const expected = await prompt.textContent(); assert(expected.trim().length > 20, 'Prompt must contain a usable brief');
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(base).origin });
      await copy.click();
      await page.waitForFunction(() => document.querySelector('#copy-status')?.textContent.trim());
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      // Windows' native clipboard converts LF to CRLF; preserve all other text and spacing.
      assert.equal(copied.replace(/\r\n/g, '\n'), expected, 'Clipboard must contain the complete displayed brief without lost or altered content');
      report.clipboard = { readFromNativeClipboard: true, lineEndingNormalization: 'CRLF to LF only', charactersAfterNormalization: copied.replace(/\r\n/g, '\n').length };
      assert.match(await page.locator('#copy-status').textContent(), /copied/i, 'A successful copy must be explained');
    });
    // Native Chromium denial exercises recovery without replacing clipboard code.
    await check('Denied clipboard keeps the prompt available and explains manual copy', async () => {
      const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      try {
        const denied = await deniedContext.newPage(); denied.setDefaultTimeout(3000); await denied.goto(base);
        const copy = await required(denied, '#copy-prompt'); const prompt = await required(denied, '#agent-prompt'); const expected = await prompt.textContent();
        const cdp = await deniedContext.newCDPSession(denied);
        const { targetInfo } = await cdp.send('Target.getTargetInfo');
        await cdp.send('Browser.setPermission', { permission: { name: 'clipboard-write' }, setting: 'denied', origin: new URL(base).origin, browserContextId: targetInfo.browserContextId });
        const permission = await denied.evaluate(async () => (await navigator.permissions.query({ name: 'clipboard-write' })).state);
        assert.equal(permission, 'denied', 'Denial test must establish a real browser denial');
        await copy.click(); await denied.waitForFunction(() => document.querySelector('#copy-status')?.textContent.trim());
        const status = await denied.locator('#copy-status').textContent();
        assert.match(status, /select|manual/i, 'Recovery must explain selecting the visible text'); assert.match(status, /copy/i, 'Recovery must explain copying');
        assert(!/copied/i.test(status), 'Failure must not claim a successful copy');
        assert.equal(await prompt.textContent(), expected, 'Denied copy must preserve the brief'); assert(await prompt.isVisible(), 'Manual copy text must remain visible');
      } finally { await deniedContext.close(); }
    });
    for (const width of [1440, 1024, 768, 390, 320]) await check(`No horizontal page overflow at ${width}px`, async () => {
      await open(width); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflows ${width}px`);
    });
    await check('Root media and fonts load without a broken local request', async () => {
      await open(1440); const images = await page.locator('img').count(); assert(images > 0, 'A visual showcase must present media');
      for (const image of await page.locator('img').all()) {
        if (await image.isVisible()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(element => element.decode()); }
      }
      const broken = await page.locator('img').evaluateAll(elements => elements.filter(e => !e.complete || e.naturalWidth === 0).map(e => e.currentSrc || e.src));
      assert.deepEqual(broken, [], 'Root media must load'); assert.equal(await page.evaluate(() => document.fonts.status), 'loaded'); assert.deepEqual(failedMedia, [], 'Local assets and links must resolve');
    });
    await check('Core demo and installation remain usable with JavaScript disabled', async () => {
      const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 960 } });
      try {
        const fallback = await noJS.newPage(); await fallback.goto(base); await specimen(fallback, 'after', 'desktop', base);
        const usableLinks = await fallback.locator('a[href]').evaluateAll(elements => elements.filter(e => e.getBoundingClientRect().width > 0).map(e => e.href));
        assert(usableLinks.some(url => /github\.com\/builtbyhuy\/web-reference-design(?:\/releases|#install)/.test(url)), 'A release or installation link must remain available');
      } finally { await noJS.close(); }
    });
    await check('Important comparison states have no automated accessibility violations', async () => {
      const axePath = process.env.SHOWCASE_AXE_PATH || process.env.FIELDNOTE_AXE_PATH || require.resolve('axe-core/axe.min.js');
      report.axe = [];
      for (const [width, version, device] of [[1440, 'after', 'desktop'], [390, 'before', 'mobile']]) {
        await open(width); await (await required(page, `[data-version="${version}"]`)).click(); await (await required(page, `[data-device="${device}"]`)).click();
        await page.addScriptTag({ path: axePath }); const scan = await page.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } }));
        const observation = { width, version, device, violations: scan.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) })), incomplete: scan.incomplete.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })) };
        report.axe.push(observation); assert.equal(observation.violations.length, 0, JSON.stringify(observation));
      }
    });
    await check('Observed interactions cause no JavaScript page errors', async () => assert.deepEqual(errors, []));
    if (process.env.SHOWCASE_CAPTURE === '1') {
      report.captures = [];
      for (const [width, label] of [[1440, 'desktop'], [390, 'mobile']]) {
        await open(width);
        for (const [suffix, fullPage] of [['', false], ['-full', true]]) {
          const destination = path.join(evidence, `showcase-${label}${suffix}.png`);
          await page.screenshot({ path: destination, fullPage }); report.captures.push(destination);
        }
      }
    }
    await context.close();
  } catch (error) { report.executionError = error.stack; }
  finally {
    report.finished = new Date().toISOString(); report.passed = checks.filter(check => check.status === 'passed').length; report.failed = checks.filter(check => check.status === 'failed').length;
    report.status = report.executionError ? 'execution-error' : report.failed ? 'failed' : 'passed';
    fs.writeFileSync(path.join(evidence, 'showcase-verification.json'), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close(); await new Promise(resolve => server.close(resolve));
    console.log(JSON.stringify(report, null, 2)); if (report.status !== 'passed') process.exitCode = 1;
  }
})();

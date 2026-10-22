'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.BRIEF_PLAYWRIGHT_MODULE || 'playwright');
const server = require('../tests/server.cjs');
const evidence = process.env.BRIEF_EVIDENCE_DIR || path.join(os.tmpdir(), 'web-reference-brief-checks');
const report = { checks: [], errors: [], externalRequests: [], limitations: ['Chromium emulation; no physical device or screen-reader session.', 'No model or comparative design-quality benchmark.'] };
async function check(name, task) { try { await task(); report.checks.push({ name, status: 'passed' }); } catch (error) { report.checks.push({ name, status: 'failed', reason: error.message }); } }
(async () => {
  let browser;
  try {
    fs.mkdirSync(evidence, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, ...(process.env.BRIEF_BROWSER_EXECUTABLE ? { executablePath: process.env.BRIEF_BROWSER_EXECUTABLE } : {}) });
    report.environment = { node: process.version, browser: browser.version() };
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce', acceptDownloads: true });
    const page = await context.newPage(); page.setDefaultTimeout(3500);
    page.on('pageerror', error => report.errors.push(error.message));
    await page.route('**/*', route => { const url = route.request().url(); if (url.startsWith(origin) || url.startsWith('blob:')) return route.continue(); report.externalRequests.push(url); return route.abort(); });
    await page.goto(`${origin}/brief/`); await page.evaluate(() => document.fonts.ready);
    await check('Required job fields expose native required semantics', async () => {
      for (const key of ['page', 'audience', 'action', 'change']) assert.equal(await page.locator(`#${key}`).evaluate(el => el.required), true);
    });
    await check('Landing exposes the builder on narrow screens', async () => {
      await page.setViewportSize({ width: 390, height: 844 }); await page.goto(origin);
      assert(await page.locator('a[href="brief/"]').isVisible()); await page.locator('a[href="brief/"]').click(); assert(new URL(page.url()).pathname.endsWith('/brief/'));
    });
    await check('Required-field errors focus the summary, link to inputs and preserve values', async () => {
      await page.locator('#page').fill('Our pricing page'); await page.locator('#generate').click();
      assert.equal(await page.locator('#errors').evaluate(el => el === document.activeElement), true);
      assert.equal(await page.locator('#error-list a').count(), 3);
      assert.equal(await page.locator('#page').inputValue(), 'Our pricing page');
      await page.locator('#error-list a').first().click(); assert.equal(await page.locator('#audience').evaluate(el => el === document.activeElement), true);
    });
    await check('Worked example is editable and generates a complete scoped handoff', async () => {
      page.once('dialog', dialog => dialog.accept());
      await page.locator('#example').click(); assert.equal(await page.locator('#page').evaluate(el => el === document.activeElement), true);
      await page.locator('#action').fill('Preview and edit an enquiry by keyboard'); await page.locator('#generate').click();
      assert.equal(await page.locator('#result-title').evaluate(el => el === document.activeElement), true);
      const text = await page.locator('#output').inputValue();
      assert(text.includes('Preview and edit an enquiry by keyboard')); assert(text.includes('$web-reference-design')); assert(text.includes('local implementation only')); assert(text.includes('checks actually performed'));
      assert.equal(await page.locator('#errors').isVisible(), false);
    });
    await check('Replacing answers requires confirmation; cancel and accept both preserve edited output', async () => {
      await page.locator('#page').fill('My own page with unsaved changes');
      await page.locator('#preserve').fill('Keep these specific fields');
      await page.locator('#output').fill('My hand-edited brief must stay.\nTiếng Việt.');
      const before = await page.locator('#brief-form').evaluate(form => Object.fromEntries(new FormData(form)));
      let cancelMessage = '';
      page.once('dialog', async dialog => { cancelMessage = dialog.message(); await dialog.dismiss(); });
      await page.locator('#example').click();
      assert.match(cancelMessage, /Replace your answers/);
      assert.deepEqual(await page.locator('#brief-form').evaluate(form => Object.fromEntries(new FormData(form))), before);
      assert.equal(await page.locator('#output').inputValue(), 'My hand-edited brief must stay.\nTiếng Việt.');
      assert.equal(await page.locator('#example').evaluate(el => el === document.activeElement), true);
      page.once('dialog', dialog => dialog.accept());
      await page.locator('#example').click();
      assert.match(await page.locator('#page').inputValue(), /^FIELDNOTE enquiry page/);
      assert.equal(await page.locator('#output').inputValue(), 'My hand-edited brief must stay.\nTiếng Việt.');
      assert(await page.locator('#dirty').isVisible());
      assert.equal(await page.locator('#page').evaluate(el => el === document.activeElement), true);
    });
    await check('Answers are literal text; hostile markup does not create elements or run', async () => {
      const payload = '<img src=x onerror="window.__briefInjected=1"> ``` malicious';
      await page.locator('#page').fill(payload); await page.locator('#reference').fill('javascript:alert(1)'); await page.locator('#generate').click();
      assert(await page.locator('#reference-error').isVisible());
      await page.locator('#reference').fill('https://example.com/reference'); await page.locator('#generate').click();
      assert((await page.locator('#output').inputValue()).includes(payload)); assert.equal(await page.evaluate(() => window.__briefInjected), undefined);
      assert.equal(await page.locator('img[src="x"]').count(), 0);
    });
    await check('Changing answers marks the preview stale without losing manual edits', async () => {
      await page.locator('#output').fill('My revised brief — keep this exact text.\nTiếng Việt.');
      await page.locator('#audience').fill('A different audience'); assert(await page.locator('#dirty').isVisible());
      assert.equal(await page.locator('#output').inputValue(), 'My revised brief — keep this exact text.\nTiếng Việt.');
    });
    await check('Copy reads the actual editable output into the browser clipboard', async () => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin }); await page.locator('#copy').click();
      const actual = await page.evaluate(() => navigator.clipboard.readText());
      assert.equal(actual.replace(/\r\n/g, '\n'), await page.locator('#output').inputValue()); assert.match(await page.locator('#status').textContent(), /copied/);
    });
    await check('A real denied clipboard selects the text and explains manual recovery', async () => {
      const cdp = await context.newCDPSession(page); const { targetInfo } = await cdp.send('Target.getTargetInfo');
      await cdp.send('Browser.setPermission', { permission: { name: 'clipboard-write' }, setting: 'denied', origin, browserContextId: targetInfo.browserContextId });
      assert.equal(await page.evaluate(async () => (await navigator.permissions.query({ name: 'clipboard-write' })).state), 'denied');
      await page.locator('#copy').click();
      await page.waitForFunction(() => document.querySelector('#status').textContent.includes('unavailable'));
      assert.equal(await page.locator('#output').evaluate(el => el === document.activeElement && el.selectionStart === 0 && el.selectionEnd === el.value.length), true);
      assert.match(await page.locator('#status').textContent(), /Ctrl\+C or Command\+C/);
    });
    await check('Markdown download contains the current edits and UTF-8 text exactly', async () => {
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#download').click()]);
      assert.equal(download.suggestedFilename(), 'design-brief.md'); assert.equal(await download.failure(), null);
      assert.equal(fs.readFileSync(await download.path(), 'utf8'), await page.locator('#output').inputValue());
    });
    await check('Empty edited output cannot be copied or downloaded as a claimed success', async () => {
      await page.locator('#output').fill('   '); await page.locator('#download').click();
      assert.match(await page.locator('#status').textContent(), /empty/); assert.equal(await page.locator('#output').evaluate(el => el === document.activeElement), true);
    });
    await check('Keyboard navigation and focus remain visible', async () => {
      await page.goto(`${origin}/brief/`); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
      assert.equal(await page.locator('#main').evaluate(el => el === document.activeElement), true);
      await page.locator('#page').focus(); const focus = await page.locator('#page').evaluate(el => ({ width: getComputedStyle(el).outlineWidth, style: getComputedStyle(el).outlineStyle }));
      assert(parseFloat(focus.width) >= 3); assert.equal(focus.style, 'solid');
    });
    await page.locator('#example').click(); await page.locator('#generate').click();
    for (const width of [1440, 1024, 768, 390, 320]) await check(`Responsive composition and practical form controls at ${width}px`, async () => {
      await page.setViewportSize({ width, height: width < 800 ? 844 : 1050 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      for (const selector of ['#page', '#audience', '#generate', '#copy', '#download']) { const box = await page.locator(selector).boundingBox(); assert(box.height >= 44 && box.width >= 44); }
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(evidence, `brief-${width}.png`), fullPage: true });
    });
    await check('No answers enter browser storage and no external requests occur during the flow', async () => {
      assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
      assert.deepEqual(report.externalRequests, []); assert.deepEqual(report.errors, []);
    });
    await context.close();
  } catch (error) { report.executionError = error.stack; }
  finally {
    report.passed = report.checks.filter(item => item.status === 'passed').length; report.failed = report.checks.filter(item => item.status === 'failed').length;
    report.status = report.executionError || report.failed ? 'failed' : 'passed';
    fs.mkdirSync(evidence, { recursive: true }); fs.writeFileSync(path.join(evidence, 'browser-checks.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close(); await new Promise(resolve => server.close(resolve));
    console.log(JSON.stringify(report, null, 2)); if (report.status !== 'passed') process.exitCode = 1;
  }
})();

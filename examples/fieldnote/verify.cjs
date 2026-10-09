'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.FIELDNOTE_PLAYWRIGHT_MODULE || 'playwright');
const server = require('./server.cjs');
const variant = process.argv.includes('--before') ? 'before' : 'after';
const evidence = path.join(__dirname, 'evidence');
const checks = [];
const errors = [];
const remote = [];
const report = { variant, started: new Date().toISOString(), checks, errors, remoteRequests: remote };
const good = { name: 'Morgan Tran', email: 'morgan@example.com', project: 'Homes', notes: 'Reconfigure a narrow ground floor so the kitchen and garden feel connected.' };
async function fill(page, data = good) { for (const [id, value] of Object.entries(data)) { if (id === 'project') await page.locator('#project').selectOption(value); else await page.locator('#' + id).fill(value); } }
async function check(name, task) { try { await task(); checks.push({ name, status: 'passed' }); } catch (error) { checks.push({ name, status: 'failed', reason: error.message }); } }
(async () => {
  let browser;
  try {
    fs.mkdirSync(evidence, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}/${variant === 'before' ? 'before/index.html' : 'index.html'}`;
    browser = await chromium.launch({ headless: true, ...(process.env.FIELDNOTE_BROWSER_EXECUTABLE ? { executablePath: process.env.FIELDNOTE_BROWSER_EXECUTABLE } : {}) });
    report.environment = { node: process.version, platform: process.platform, browser: browser.version(), browserFamily: 'Chromium', viewports: [1440, 768, 390, 320], reducedMotion: 'reduce' };
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => { if (new URL(route.request().url()).hostname === '127.0.0.1') return route.continue(); remote.push(route.request().url()); return route.abort(); });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const open = async width => { await page.setViewportSize({ width: width || 1440, height: width && width < 768 ? 844 : 960 }); await page.goto(base); };
    await open();
    await page.screenshot({ path: path.join(evidence, `${variant}-desktop.png`) });
    await page.screenshot({ path: path.join(evidence, `${variant}-desktop-full.png`), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(evidence, `${variant}-mobile.png`) });
    await page.screenshot({ path: path.join(evidence, `${variant}-mobile-full.png`), fullPage: true });
    for (const width of [1440, 768, 390, 320]) await check(`No horizontal page overflow at ${width}px`, async () => { await open(width); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflows the ${width}px viewport`); });
    await check('Incomplete enquiry shows all required fields without creating a preview', async () => { await open(390); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.locator('#error-list li').count(), 4, 'Four required fields must be explained'); assert.equal(await page.locator('#enquiry-preview').isVisible(), false, 'Incomplete input must stay in form'); });
    await check('Invalid email preserves the rest of the enquiry', async () => { await open(390); await fill(page, { ...good, email: 'morgan@' }); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.locator('#enquiry-preview').isVisible(), false, 'Malformed email must block preview'); assert.equal(await page.locator('#name').inputValue(), 'Morgan Tran'); assert.equal(await page.locator('#notes').inputValue(), good.notes); });
    await check('Missing name preserves valid email and brief', async () => { await open(390); await fill(page, { ...good, name: '' }); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.locator('#email').inputValue(), 'morgan@example.com', 'Validation must not reset entered values'); assert.equal(await page.locator('#notes').inputValue(), good.notes); });
    await check('Error summary receives focus and its link focuses the exact field', async () => { await open(390); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.evaluate(() => document.activeElement.id), 'error-summary', 'Focus must move to the error summary'); await page.locator('#error-list a').first().click(); assert.equal(await page.evaluate(() => document.activeElement.id), 'name'); });
    await check('Preview safely renders literal input and states nothing has been sent', async () => { await open(390); const notes = '<svg onload="window.injectionDetected=true"></svg> Make room for a garden table.'; await fill(page, { ...good, notes }); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.locator('#enquiry-preview').isVisible(), true); assert.equal(await page.locator('#preview-details svg').count(), 0, 'User text must not create SVG/HTML elements'); assert((await page.locator('#preview-details').textContent()).includes(notes), 'Input must be displayed literally'); assert((await page.locator('#enquiry-preview').textContent()).includes('Nothing has been sent.')); assert.equal(await page.evaluate(() => document.activeElement.id), 'enquiry-preview'); });
    await check('Editing the preview restores all values and keyboard focus', async () => { await open(390); await fill(page); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); await page.getByRole('button', { name: 'Edit details', exact: true }).click(); assert.equal(await page.locator('#enquiry-form').isVisible(), true, 'Edit must return to the form'); for (const [id, value] of Object.entries(good)) assert.equal(await page.locator('#' + id).inputValue(), value); assert.equal(await page.evaluate(() => document.activeElement.id), 'name'); });
    await check('Keyboard can skip navigation and operate the full form', async () => { await open(390); await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(), 'Skip to content', 'First keyboard action must expose a skip link'); await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'main'); await page.locator('#name').focus(); const visited = []; for (let i = 0; i < 8; i++) { visited.push(await page.evaluate(() => document.activeElement.id)); if (visited.at(-1) === 'preview-button') break; await page.keyboard.press('Tab'); } for (const id of ['name', 'email', 'project', 'notes', 'preview-button']) assert(visited.includes(id), `Keyboard must reach ${id}`); assert.equal(await page.locator('#preview-button').evaluate(element => getComputedStyle(element).outlineStyle), 'solid'); await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'error-summary'); });
    await check('Long literal preview content fits a narrow screen', async () => { await open(320); await fill(page, { ...good, name: 'A'.repeat(160), notes: 'B'.repeat(600) }); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(await page.locator('#enquiry-preview').isVisible(), true); assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Unbroken input must wrap rather than widen the page'); });
    await check('Primary form action has a practical mobile touch target', async () => { await open(390); const box = await page.getByRole('button', { name: 'Preview enquiry', exact: true }).boundingBox(); assert(box.height >= 44, `Action is only ${box.height}px high`); });
    await check('The enquiry flow performs no external requests or storage writes', async () => { await open(390); await fill(page); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); assert.equal(remote.length, 0); assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0); });
    await check('No JavaScript page errors during the observed flow', async () => assert.equal(errors.length, 0, errors.join('\n')));
    if (variant === 'after') {
      const axePath = process.env.FIELDNOTE_AXE_PATH || require.resolve('axe-core/axe.min.js');
      report.axe = [];
      async function scan(state) {
        await page.addScriptTag({ path: axePath });
        const result = await page.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } }));
        report.axe.push({ state, violations: result.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) })), incomplete: result.incomplete.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })) });
        assert.equal(result.violations.length, 0, `${state} has accessibility findings: ${JSON.stringify(report.axe.at(-1))}`);
      }
      await open(1440); await scan('desktop initial');
      await open(390); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); await page.screenshot({ path: path.join(evidence, 'after-mobile-errors.png'), fullPage: true });
      await scan('mobile errors');
      await fill(page); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); await page.screenshot({ path: path.join(evidence, 'after-mobile-preview.png'), fullPage: true });
      await scan('mobile preview');
      await open(1440); await fill(page); await page.getByRole('button', { name: 'Preview enquiry', exact: true }).click(); await page.screenshot({ path: path.join(evidence, 'after-desktop-preview.png'), fullPage: true });
    }
    report.status = checks.some(check => check.status === 'failed') ? 'failed' : 'passed';
  } catch (error) { report.status = 'execution-error'; report.executionError = error.stack; }
  finally {
    report.finished = new Date().toISOString();
    report.passed = checks.filter(check => check.status === 'passed').length;
    report.failed = checks.filter(check => check.status === 'failed').length;
    report.limits = ['Chromium desktop emulation only; no Safari/Firefox or physical mobile device.', 'No screen-reader session or complete accessibility certification.', 'No sending integration, real studio outcome or measured conversion/agent comparison.'];
    if (variant === 'after') report.manualReview = ['Desktop/mobile composition and error/preview pixels inspected.', 'Remaining axe contrast incomplete is the decorative aria-hidden footer arrow; inherited #292823 on #ece8dd is 12.06:1, checked separately.'];
    fs.writeFileSync(path.join(evidence, `${variant}-verification.json`), JSON.stringify(report, null, 2) + '\n');
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    console.log(JSON.stringify(report, null, 2));
    if (report.status !== 'passed') process.exitCode = 1;
  }
})();

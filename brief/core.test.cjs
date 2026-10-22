'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { build, validate, literal } = require('./core.js');
const input = { task: 'repair', page: '/pricing — Vue', audience: 'Teams', action: 'Choose a plan', change: 'Keep a billing selection after an error', preserve: 'Real prices and plan identifiers', reference: '' };
test('Incomplete job context is rejected instead of generating a vague brief', () => {
  assert.deepEqual(Object.keys(validate({ task: 'refine' })), ['page', 'audience', 'action', 'change']);
  assert.throws(() => build({ task: 'refine' }));
});
test('Explicit context, preserved behavior and local authorization travel with the exported brief', () => {
  const text = build(input);
  for (const value of [input.page, input.audience, input.action, input.change, input.preserve, '$web-reference-design', 'local implementation only', 'checks actually performed']) assert(text.includes(value));
  assert(!text.includes('undefined'));
});
test('Reference protocols do not become executable or silently accepted', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//example.com', 'not a url']) assert(validate({ ...input, reference: url }).reference);
  for (const url of ['https://example.com/design', 'http://localhost:4000/']) assert.deepEqual(validate({ ...input, reference: url }), {});
});
test('Arbitrary backticks and HTML remain one literal Markdown block', () => {
  const value = 'Before\n```\n<script>alert(1)</script>\n``````\nafter';
  const rendered = literal(value);
  assert(rendered.startsWith('```````text\n')); assert(rendered.endsWith('\n```````'));
  assert(rendered.includes(value));
});
test('Unicode and multiline content survive without a model or external dependency', () => {
  const text = build({ ...input, page: 'Trang giá — tiếng Việt', change: 'Giữ thông tin\nSau khi lỗi', preserve: '' });
  assert(text.includes('Trang giá — tiếng Việt')); assert(text.includes('Giữ thông tin\nSau khi lỗi')); assert(text.includes('Preserve the existing brand'));
});

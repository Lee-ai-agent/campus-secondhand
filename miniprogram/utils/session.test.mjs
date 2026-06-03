import assert from 'node:assert/strict';
import test from 'node:test';
import { hasSession, normalizeSession } from './session.js';

const user = { userId: 2, nickname: '李同学' };
const token = 'demo-token';

test('normalizeSession keeps complete sessions', () => {
  assert.deepEqual(normalizeSession(user, token), { user, token });
});

test('normalizeSession clears partial sessions', () => {
  assert.deepEqual(normalizeSession(user, ''), { user: null, token: '' });
  assert.deepEqual(normalizeSession(null, token), { user: null, token: '' });
});

test('hasSession requires both user and token', () => {
  assert.equal(hasSession({ user, token }), true);
  assert.equal(hasSession({ user, token: '' }), false);
  assert.equal(hasSession({ user: null, token }), false);
});


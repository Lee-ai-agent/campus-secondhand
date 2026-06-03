import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(relativePath) {
  return readFileSync(join(root, relativePath), 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function selectorIsDefined(source, selector) {
  const className = selector.startsWith('.') ? selector.slice(1) : selector;
  const selectorPattern = new RegExp(
    `(^|[\\s,{])\\.${escapeRegExp(className)}(?=$|[\\s,{:.#>+~\\[])`
  );

  return selectorPattern.test(stripCssComments(source));
}

function getClassAttributes(source) {
  return [...source.matchAll(/\bclass\s*=\s*(["'])([\s\S]*?)\1/g)].map((match) => match[2]);
}

function hasClassToken(source, className) {
  return getClassAttributes(source).some((classAttribute) => {
    const classTokens = classAttribute.split(/\s+/).filter(Boolean);
    const requiredTokens = className.split(/\s+/).filter(Boolean);

    return requiredTokens.every((token) => classTokens.includes(token));
  });
}

const appWxss = read('miniprogram/app.wxss');

const requiredGlobalSelectors = [
  '.soft-search',
  '.market-hero',
  '.section-title',
  '.category-grid',
  '.product-card',
  '.wanted-card',
  '.seller-card',
  '.profile-hero',
  '.profile-stats',
  '.message-row',
  '.chat-bubble',
  '.form-card',
  '.filter-row',
  '.filter-chip',
  '.empty-state',
  '.bottom-action-bar',
  '.stepper',
  '.floating-action',
  '.page-enter'
];

test('app.wxss exposes the redesign component selectors', () => {
  const missingSelectors = requiredGlobalSelectors.filter(
    (selector) => !selectorIsDefined(appWxss, selector)
  );

  assert.deepEqual(missingSelectors, [], `Missing app.wxss selectors: ${missingSelectors.join(', ')}`);
});

const requiredPageClasses = {
  'miniprogram/pages/home/index.wxml': ['soft-search', 'market-hero', 'category-grid', 'product-card'],
  'miniprogram/pages/detail/index.wxml': ['product-visual', 'seller-card', 'bottom-action-bar'],
  'miniprogram/pages/cart/index.wxml': ['cart-item', 'stepper', 'bottom-action-bar'],
  'miniprogram/pages/wanted/index.wxml': ['wanted-hero', 'filter-row', 'wanted-card', 'floating-action'],
  'miniprogram/pages/profile/index.wxml': ['profile-hero', 'profile-stats', 'profile-section'],
  'miniprogram/pages/messages/index.wxml': ['message-row', 'empty-state'],
  'miniprogram/pages/chat/index.wxml': ['chat-shell', 'chat-bubble', 'chat-input-bar'],
  'miniprogram/pages/login/index.wxml': ['login-card', 'btn primary']
};

test('P0 pages use the redesign component classes', () => {
  const missingClasses = [];

  for (const [path, classNames] of Object.entries(requiredPageClasses)) {
    const source = read(path);

    for (const className of classNames) {
      if (!hasClassToken(source, className)) {
        missingClasses.push(`${path}: ${className}`);
      }
    }
  }

  assert.deepEqual(missingClasses, [], `Missing P0 page classes: ${missingClasses.join(', ')}`);
});

const p0Pages = Object.keys(requiredPageClasses);

test('P0 pages avoid heavy inline styling', () => {
  const heavyInlineStylePages = [];

  for (const path of p0Pages) {
    const source = read(path);
    const inlineStyleCount = (source.match(/\bstyle\s*=/g) || []).length;

    if (inlineStyleCount > 2) {
      heavyInlineStylePages.push(`${path}: ${inlineStyleCount}`);
    }
  }

  assert.deepEqual(
    heavyInlineStylePages,
    [],
    `P0 pages should use global classes instead of repeated inline styles: ${heavyInlineStylePages.join(', ')}`
  );
});

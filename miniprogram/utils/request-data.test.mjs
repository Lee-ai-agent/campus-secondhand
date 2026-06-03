import assert from 'node:assert/strict';
import test from 'node:test';
import { compactRequestData } from './api.js';

test('compactRequestData omits null and undefined fields', () => {
  assert.deepEqual(
    compactRequestData({
      keyword: '',
      categoryId: null,
      status: 'approved',
      page: undefined
    }),
    {
      keyword: '',
      status: 'approved'
    }
  );
});

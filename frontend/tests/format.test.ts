import { describe, expect, it } from 'vitest';
import { formatMoney } from '../src/lib/api';

describe('currency display', () => {
  it('formats UK pounds', () => expect(formatMoney(28)).toBe('£28.00'));
});

import { beforeEach, describe, expect, it } from 'vitest';
import { getRemainingGb, portalApi } from '../src/lib/api';

beforeEach(() => localStorage.clear());

describe('demo portal store', () => {
  it('starts with fictional seed data', async () => {
    const snapshot = await portalApi.getSnapshot();
    expect(snapshot.customer.name).toBe('Alex Morgan');
    expect(getRemainingGb(snapshot)).toBeCloseTo(47.6);
  });
  it('persists a plan change and supports unlimited data', async () => {
    await portalApi.changePlan('unlimited');
    const snapshot = await portalApi.getSnapshot();
    expect(snapshot.activePlanId).toBe('unlimited');
    expect(getRemainingGb(snapshot)).toBeNull();
  });
  it('creates a new support request', async () => {
    const snapshot = await portalApi.createTicket({ subject: 'My plan', category: 'Billing', message: 'Please advise.' });
    expect(snapshot.tickets[0].status).toBe('OPEN');
    expect(snapshot.tickets[0].subject).toBe('My plan');
  });
  it('resets changes to defaults', async () => {
    await portalApi.changePlan('essential');
    const snapshot = await portalApi.reset();
    expect(snapshot.activePlanId).toBe('plus');
  });
});

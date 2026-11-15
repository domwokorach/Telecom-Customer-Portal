import { seed } from '../data/seed';
import type { PlanId, PortalSnapshot, ProfileInput, TicketInput } from './types';

const STORE_KEY = 'orbit-portfolio-demo-v1';
const isServer = import.meta.env.VITE_API_MODE === 'server';
let authHeader: string | undefined;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function readLocalSnapshot(): PortalSnapshot {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as PortalSnapshot;
  } catch { /* Storage unavailable: serve seeded in-memory-style response. */ }
  return clone(seed);
}
function saveLocalSnapshot(next: PortalSnapshot): PortalSnapshot {
  try { window.localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* Private browsing may block storage. */ }
  return clone(next);
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const message = response.status === 401 ? 'The demo credentials were not accepted.' : `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const portalApi = {
  isServer,
  async signIn(username: string, password: string): Promise<PortalSnapshot> {
    if (!isServer) {
      if (username !== 'demo' || password !== 'Demo123!') throw new Error('Use the demo credentials shown below.');
      return readLocalSnapshot();
    }
    authHeader = `Basic ${btoa(`${username}:${password}`)}`;
    try { return await request<PortalSnapshot>('/portal'); }
    catch (error) { authHeader = undefined; throw error; }
  },
  signOut() { authHeader = undefined; },
  async getSnapshot(): Promise<PortalSnapshot> {
    return isServer ? request<PortalSnapshot>('/portal') : readLocalSnapshot();
  },
  async changePlan(planId: PlanId): Promise<PortalSnapshot> {
    if (isServer) return request('/plan', { method: 'PATCH', body: JSON.stringify({ planId }) });
    const state = readLocalSnapshot();
    if (!state.plans.some(plan => plan.id === planId)) throw new Error('Unknown plan');
    state.activePlanId = planId;
    return saveLocalSnapshot(state);
  },
  async createTicket(input: TicketInput): Promise<PortalSnapshot> {
    if (isServer) return request('/tickets', { method: 'POST', body: JSON.stringify(input) });
    const state = readLocalSnapshot();
    state.tickets.unshift({
      id: Math.max(1002, ...state.tickets.map(ticket => ticket.id)) + 1,
      ...input, status: 'OPEN', createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
    return saveLocalSnapshot(state);
  },
  async updateProfile(input: ProfileInput): Promise<PortalSnapshot> {
    if (isServer) return request('/profile', { method: 'PATCH', body: JSON.stringify(input) });
    const state = readLocalSnapshot();
    state.customer = { ...state.customer, ...input };
    return saveLocalSnapshot(state);
  },
  async reset(): Promise<PortalSnapshot> {
    if (isServer) return request('/demo/reset', { method: 'POST' });
    return saveLocalSnapshot(clone(seed));
  },
};

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}
export function getRemainingGb(snapshot: PortalSnapshot): number | null {
  const plan = snapshot.plans.find(item => item.id === snapshot.activePlanId);
  return plan?.dataLimitGb == null ? null : Math.max(0, plan.dataLimitGb - snapshot.usage.dataUsedGb);
}
export function downloadInvoice(id: string, snapshot: PortalSnapshot): void {
  const invoice = snapshot.invoices.find(item => item.id === id);
  if (!invoice) throw new Error('Invoice not found');
  const text = [
    'ORBIT MOBILE — DEMO INVOICE',
    'Fictional portfolio example. Not a real payment or tax invoice.',
    '', `Invoice: ${invoice.id}`, `Customer: ${snapshot.customer.name}`,
    `Billing period: ${invoice.period}`, `Issue date: ${invoice.date}`,
    `Plan: ${snapshot.plans.find(item => item.id === snapshot.activePlanId)?.name ?? 'Mobile plan'}`,
    `Total: ${formatMoney(invoice.amount)}`, `Status: ${invoice.status}`,
  ].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `${id}-DEMO.txt`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

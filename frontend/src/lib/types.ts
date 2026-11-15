export type Section = 'overview' | 'usage' | 'bills' | 'plans' | 'support' | 'settings';
export type PlanId = 'essential' | 'plus' | 'unlimited';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}
export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  dataLimitGb: number | null;
  calls: string;
  texts: string;
  perks: string[];
}
export interface UsageCategory { name: string; amountGb: number; color: string; }
export interface UsagePoint { month: string; amountGb: number; }
export interface Usage {
  dataUsedGb: number;
  daysLeft: number;
  nextRenewal: string;
  history: UsagePoint[];
  categories: UsageCategory[];
}
export interface Invoice {
  id: string;
  period: string;
  date: string;
  amount: number;
  status: 'PAID' | 'DUE';
}
export interface Ticket {
  id: number;
  subject: string;
  message: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
}
export interface PortalSnapshot {
  customer: Customer;
  activePlanId: PlanId;
  plans: Plan[];
  usage: Usage;
  invoices: Invoice[];
  tickets: Ticket[];
}
export interface TicketInput { subject: string; message: string; category: string; }
export interface ProfileInput { name: string; email: string; }

import type { PortalSnapshot } from '../lib/types';

export const seed: PortalSnapshot = {
  customer: {
    id: 1,
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '07700 900123',
    memberSince: 'January 2024',
  },
  activePlanId: 'plus',
  plans: [
    {
      id: 'essential', name: 'Essential', description: 'The everyday essentials',
      price: 18, dataLimitGb: 20, calls: 'Unlimited UK calls', texts: 'Unlimited texts',
      perks: ['5G connectivity', 'EU roaming add-on available', 'No annual contract'],
    },
    {
      id: 'plus', name: 'Plus', description: 'More freedom, more data',
      price: 28, dataLimitGb: 80, calls: 'Unlimited UK calls', texts: 'Unlimited texts',
      perks: ['5G connectivity', 'EU roaming included', 'Priority customer support'],
    },
    {
      id: 'unlimited', name: 'Unlimited', description: 'All the data you need',
      price: 38, dataLimitGb: null, calls: 'Unlimited UK calls', texts: 'Unlimited texts',
      perks: ['Unlimited 5G data', 'EU roaming included', 'Priority customer support', 'Entertainment benefit'],
    },
  ],
  usage: {
    dataUsedGb: 32.4, daysLeft: 12, nextRenewal: '27 Nov 2026',
    history: [
      { month: 'Jun', amountGb: 25.2 }, { month: 'Jul', amountGb: 38.4 },
      { month: 'Aug', amountGb: 29.8 }, { month: 'Sep', amountGb: 43.2 },
      { month: 'Oct', amountGb: 35.6 }, { month: 'Nov', amountGb: 32.4 },
    ],
    categories: [
      { name: 'Streaming', amountGb: 13.2, color: '#846cf5' },
      { name: 'Social', amountGb: 8.5, color: '#fd9a69' },
      { name: 'Browsing', amountGb: 5.8, color: '#47b6c8' },
      { name: 'Other', amountGb: 4.9, color: '#d7dce7' },
    ],
  },
  invoices: [
    { id: 'INV-2026-10', period: 'October 2026', date: '27 Oct 2026', amount: 28, status: 'PAID' },
    { id: 'INV-2026-09', period: 'September 2026', date: '27 Sep 2026', amount: 28, status: 'PAID' },
    { id: 'INV-2026-08', period: 'August 2026', date: '27 Aug 2026', amount: 28, status: 'PAID' },
    { id: 'INV-2026-07', period: 'July 2026', date: '27 Jul 2026', amount: 28, status: 'PAID' },
  ],
  tickets: [
    { id: 1002, subject: 'Checking EU roaming availability', category: 'Plan & roaming', message: 'Can I use my data while travelling?', status: 'RESOLVED', createdAt: '5 Nov 2026' },
    { id: 1001, subject: 'eSIM activation assistance', category: 'Technical support', message: 'I need help activating my new eSIM.', status: 'IN_PROGRESS', createdAt: '12 Nov 2026' },
  ],
};

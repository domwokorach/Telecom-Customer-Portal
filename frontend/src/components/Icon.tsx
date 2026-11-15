import type { ReactNode } from 'react';

export type IconName = 'grid' | 'activity' | 'receipt' | 'sim' | 'headphones' | 'settings' | 'chevron-right' | 'chevron-down' | 'arrow-up-right' | 'arrow-right' | 'bell' | 'help' | 'menu' | 'close' | 'check' | 'check-circle' | 'shield' | 'wifi' | 'download' | 'calendar' | 'phone' | 'mail' | 'plus' | 'refresh' | 'logout' | 'sparkles' | 'globe' | 'zap' | 'clock' | 'credit' | 'user' | 'bars' | 'signal';

const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  activity: <><path d="M3 12h4l3-7 4 14 3-7h4"/></>,
  receipt: <><path d="M4 3h16v18l-4-2-4 2-4-2-4 2z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  sim: <><rect x="4" y="2" width="16" height="20" rx="3"/><rect x="8" y="9" width="8" height="8" rx="1"/><path d="M12 9v8M8 13h8"/></>,
  headphones: <><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></>,
  'chevron-right': <path d="m9 18 6-6-6-6"/>,
  'chevron-down': <path d="m6 9 6 6 6-6"/>,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9"/>,
  'arrow-right': <><path d="M5 12h14m-7-7 7 7-7 7"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.8 2.8 0 0 1 5.1 1.5c0 1.8-2.6 2-2.6 4M12 18h.01"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="M5 5 19 19M19 5 5 19"/>,
  check: <path d="m4 12 5 5L20 6"/>,
  'check-circle': <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  shield: <><path d="M12 2 4 6v6c0 5 3.7 8.5 8 10 4.3-1.5 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></>,
  wifi: <><path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0M9 17a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/></>,
  phone: <><path d="M6 3h4l1 5-2 2c1 2 3 4 5 5l2-2 5 1v4c0 2-2 3-4 3A15 15 0 0 1 3 7c0-2 1-4 3-4z"/></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  plus: <path d="M12 4v16M4 12h16"/>,
  refresh: <><path d="M20 6v5h-5M4 18v-5h5"/><path d="M5 9a8 8 0 0 1 14-3l1 5M4 13l1 5a8 8 0 0 0 14-3"/></>,
  logout: <><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M14 16l4-4-4-4M8 12h10"/></>,
  sparkles: <><path d="m12 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 6-5 12 0 18M12 3c5 6 5 12 0 18"/></>,
  zap: <path d="m13 2-9 12h8l-1 8 9-12h-8z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
  credit: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  bars: <><path d="M5 20v-5M10 20V9M15 20V4M20 20v-9"/></>,
  signal: <><path d="M3 18h3v3H3zM8 14h3v7H8zM13 9h3v12h-3zM18 4h3v17h-3z"/></>,
};

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

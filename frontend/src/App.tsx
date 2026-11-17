import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Icon, type IconName } from './components/Icon';
import { seed } from './data/seed';
import { downloadInvoice, formatMoney, getRemainingGb, portalApi } from './lib/api';
import type { Plan, PlanId, PortalSnapshot, ProfileInput, Section, TicketInput } from './lib/types';

type Navigate = (section: Section) => void;
const navigation: { id: Section; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'usage', label: 'Data usage', icon: 'activity' },
  { id: 'bills', label: 'Billing & payments', icon: 'receipt' },
  { id: 'plans', label: 'My plan', icon: 'sim' },
  { id: 'support', label: 'Help & support', icon: 'headphones' },
  { id: 'settings', label: 'Account settings', icon: 'settings' },
];
const labels: Record<Section, { title: string; caption: string }> = {
  overview: { title: 'Overview', caption: 'A clear view of everything important.' },
  usage: { title: 'Data usage', caption: 'Stay on top of your monthly data.' },
  bills: { title: 'Billing & payments', caption: 'All your statements in one place.' },
  plans: { title: 'My mobile plan', caption: 'Find the right fit for your connected life.' },
  support: { title: 'Help & support', caption: 'We’re here when you need us.' },
  settings: { title: 'Account settings', caption: 'Your personal details, all in one place.' },
};

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}
function PanelHeading({ title, kicker, action }: { title: string; kicker?: string; action?: ReactNode }) {
  return <div className="panel-header"><div>{kicker && <p className="eyebrow">{kicker}</p>}<h2>{title}</h2></div>{action}</div>;
}
function Status({ value }: { value: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'PAID' | 'DUE' }) {
  const label = { OPEN: 'Open', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved', PAID: 'Paid', DUE: 'Due' }[value];
  return <span className={`status status-${value.toLowerCase()}`}><span className="status-dot" />{label}</span>;
}
function ArrowLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button className="text-link" type="button" onClick={onClick}>{children}<Icon name="arrow-right" size={16} /></button>;
}
function DataRing({ used, limit }: { used: number; limit: number | null }) {
  const percent = limit == null ? 28 : Math.min(100, Math.round((used / limit) * 100));
  return <div className="ring" role="img" aria-label={`${used} GB used${limit == null ? ' on an unlimited plan' : ` of ${limit} GB`}`} style={{ '--used': `${percent}%` } as CSSProperties}>
    <div className="ring-inner"><span className="ring-label">DATA USED</span><strong>{used.toFixed(1)}<small> GB</small></strong><span className="ring-caption">{limit == null ? 'Unlimited plan' : `of ${limit} GB`}</span></div>
  </div>;
}
function UsageBarChart({ snapshot }: { snapshot: PortalSnapshot }) {
  const max = Math.max(50, ...snapshot.usage.history.map(item => item.amountGb));
  return <div className="chart" role="img" aria-label="Mobile data usage by month in gigabytes">
    <div className="chart-axis"><span>50 GB</span><span>25 GB</span><span>0 GB</span></div>
    <div className="chart-bars">{snapshot.usage.history.map((item, index) => (
      <div className="chart-column" key={item.month}>
        <div className="chart-track"><div title={`${item.month}: ${item.amountGb} GB`} className={`chart-bar ${index === snapshot.usage.history.length - 1 ? 'active' : ''}`} style={{ height: `${(item.amountGb / max) * 100}%` }} /></div>
        <span className="chart-month">{item.month}</span>
      </div>
    ))}</div>
  </div>;
}
function Sidebar({ active, navigate, onSignOut, open, close }: { active: Section; navigate: Navigate; onSignOut: () => void; open: boolean; close: () => void }) {
  return <><div className={`mobile-backdrop ${open ? 'show' : ''}`} onClick={close} aria-hidden="true" />
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><span className="brand-mark"><span /></span><span className="brand-name">orbit<span className="brand-dot">.</span><small>MOBILE</small></span></div>
      <div className="account-tag"><span className="account-tag-icon"><Icon name="sim" size={18} /></span><span><strong>Personal account</strong><small>Customer portal</small></span><Icon name="chevron-down" size={15} /></div>
      <p className="sidebar-label">WORKSPACE</p>
      <nav aria-label="Main navigation" className="nav-list">{navigation.map(item => <button type="button" className={`nav-item ${active === item.id ? 'active' : ''}`} key={item.id} onClick={() => navigate(item.id)} aria-current={active === item.id ? 'page' : undefined}><Icon name={item.icon} size={19} /><span>{item.label}</span>{active === item.id && <span className="active-marker" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="support-box"><div className="support-icon"><Icon name="headphones" size={20} /></div><strong>Need a hand?</strong><p>Our support team is always here to help.</p><button type="button" onClick={() => navigate('support')}>Get support <Icon name="arrow-up-right" size={15} /></button></div><button type="button" className="signout" onClick={onSignOut}><Icon name="logout" size={18} /> Sign out</button><div className="sidebar-footer">© 2026 Orbit Mobile <span>Portfolio demo</span></div></div>
    </aside></>;
}
function Topbar({ snapshot, active, navigate, onMenu }: { snapshot: PortalSnapshot; active: Section; navigate: Navigate; onMenu: () => void }) {
  const initials = snapshot.customer.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return <header className="topbar"><div className="crumb"><button className="mobile-menu icon-button" type="button" aria-label="Open menu" onClick={onMenu}><Icon name="menu" size={22} /></button><span>My account</span><Icon name="chevron-right" size={14} /><strong>{labels[active].title}</strong></div><div className="top-actions"><span className="live-pill"><span /> All systems operational</span><button className="icon-button desktop-help" type="button" aria-label="Go to help and support" onClick={() => navigate('support')}><Icon name="help" size={20} /></button><button type="button" onClick={() => navigate('settings')} className="profile-chip"><span className="avatar">{initials}</span><span className="profile-name">{snapshot.customer.name}<small>My account</small></span><Icon name="chevron-down" size={15} /></button></div></header>;
}
function Overview({ snapshot, navigate }: { snapshot: PortalSnapshot; navigate: Navigate }) {
  const plan = snapshot.plans.find(item => item.id === snapshot.activePlanId)!;
  const remaining = getRemainingGb(snapshot);
  return <div className="page-content">
    <div className="welcome"><div className="welcome-content"><span className="welcome-kicker"><Icon name="sparkles" size={15} /> YOUR CONNECTED LIFE, SIMPLIFIED</span><h2>Welcome back, {snapshot.customer.name.split(' ')[0]} <span className="wave">✳</span></h2><p>Everything about your mobile account, in one beautiful place.</p><button type="button" onClick={() => navigate('usage')}>Explore your usage <Icon name="arrow-up-right" size={17} /></button></div><div className="welcome-visual" aria-hidden="true"><div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/><div className="visual-circle"><Icon name="signal" size={46} /></div><div className="visual-spark">✳</div></div></div>
    <div className="stat-grid">
      <div className="stat-card"><div className="stat-top"><span className="stat-icon stat-icon-purple"><Icon name="activity" size={20}/></span><span className="stat-trend">This month</span></div><div className="stat-value">{remaining == null ? '∞' : remaining.toFixed(1)}<small>{remaining == null ? 'data' : 'GB'}</small></div><p>Data remaining</p><div className="stat-foot"><span className="subtle-dot"/> {remaining == null ? 'Unlimited allowance' : `${snapshot.usage.dataUsedGb} GB used so far`}</div></div>
      <div className="stat-card"><div className="stat-top"><span className="stat-icon stat-icon-coral"><Icon name="credit" size={20}/></span><span className="stat-trend">Monthly</span></div><div className="stat-value">{formatMoney(plan.price)}</div><p>Next bill estimate</p><div className="stat-foot"><Icon name="calendar" size={15}/> Due {snapshot.usage.nextRenewal}</div></div>
      <div className="stat-card"><div className="stat-top"><span className="stat-icon stat-icon-teal"><Icon name="calendar" size={20}/></span><span className="stat-trend">Billing cycle</span></div><div className="stat-value">{snapshot.usage.daysLeft}<small>days</small></div><p>Until renewal</p><div className="stat-foot"><Icon name="check-circle" size={15}/> Your account is up to date</div></div>
    </div>
    <div className="dashboard-grid">
      <Panel className="data-panel"><PanelHeading title="Data usage" kicker="YOUR ALLOWANCE" action={<ArrowLink onClick={() => navigate('usage')}>View details</ArrowLink>}/><div className="usage-content"><DataRing used={snapshot.usage.dataUsedGb} limit={plan.dataLimitGb}/><div className="usage-stats"><div><span>Remaining data</span><strong>{remaining == null ? 'Unlimited' : `${remaining.toFixed(1)} GB`}</strong></div><div className="tiny-divider"/><div><span>Plan allowance</span><strong>{plan.dataLimitGb == null ? 'Unlimited' : `${plan.dataLimitGb} GB`}</strong></div><div className="cycle-note"><Icon name="refresh" size={15}/> Resets {snapshot.usage.nextRenewal}</div></div></div></Panel>
      <Panel className="plan-panel"><PanelHeading title="Your plan" kicker="CURRENT SUBSCRIPTION" action={<span className="active-tag"><span/> Active</span>}/><div className="plan-icon"><Icon name="sim" size={26}/></div><h3>{plan.name} <span>5G</span></h3><p className="plan-description">{plan.description}</p><div className="plan-quick-details"><span><Icon name="wifi" size={16}/> {plan.dataLimitGb == null ? 'Unlimited data' : `${plan.dataLimitGb} GB data`}</span><span><Icon name="phone" size={16}/> Unlimited calls & texts</span></div><div className="plan-bottom"><div><strong>{formatMoney(plan.price)}</strong><span>/ month</span></div><button className="soft-button" type="button" onClick={() => navigate('plans')}>Manage plan <Icon name="arrow-right" size={16}/></button></div></Panel>
      <Panel className="trend-panel"><PanelHeading title="Your data at a glance" kicker="6-MONTH TREND" action={<span className="muted-chip"><Icon name="bars" size={15}/> GB used</span>}/><UsageBarChart snapshot={snapshot}/></Panel>
      <Panel className="bills-panel"><PanelHeading title="Recent bills" kicker="BILLING HISTORY" action={<ArrowLink onClick={() => navigate('bills')}>View all</ArrowLink>}/><div className="recent-bills">{snapshot.invoices.slice(0, 3).map(invoice => <div className="recent-bill" key={invoice.id}><div className="bill-icon"><Icon name="receipt" size={19}/></div><div className="bill-copy"><strong>{invoice.period}</strong><span>{invoice.id}</span></div><div className="bill-total"><strong>{formatMoney(invoice.amount)}</strong><Status value={invoice.status}/></div></div>)}</div></Panel>
    </div>
    <div className="security-note"><Icon name="shield" size={18}/><span>Demo environment with fictional customer information. No real payments or account changes.</span><span>Built with React + TypeScript</span></div>
  </div>;
}
function Usage({ snapshot }: { snapshot: PortalSnapshot }) {
  const plan = snapshot.plans.find(item => item.id === snapshot.activePlanId)!;
  const limit = plan.dataLimitGb;
  const remaining = getRemainingGb(snapshot);
  return <div className="page-content"><div className="inner-hero"><div><span className="eyebrow">MONTHLY DATA REPORT</span><h2>Know your data. Own your month.</h2><p>Keep tabs on how much you've used and where it goes.</p></div><div className="hero-badge"><Icon name="calendar" size={17}/> Current billing period</div></div>
    <div className="two-col"><Panel><PanelHeading title="Current cycle" kicker="MONTHLY ALLOWANCE"/><div className="usage-detail"><DataRing used={snapshot.usage.dataUsedGb} limit={limit}/><div className="usage-detail-info"><div><span>Used this month</span><strong>{snapshot.usage.dataUsedGb} GB</strong></div><div><span>Still available</span><strong>{remaining == null ? 'Unlimited' : `${remaining.toFixed(1)} GB`}</strong></div><div><span>Resets on</span><strong>{snapshot.usage.nextRenewal}</strong></div></div></div><div className="usage-alert"><Icon name="check-circle" size={18}/><span>{limit == null || remaining == null ? 'You have unlimited mobile data on this plan.' : remaining > 0 ? 'You are within your monthly data allowance.' : 'You have reached your data allowance.'}</span></div></Panel>
      <Panel><PanelHeading title="Where your data goes" kicker="USAGE BREAKDOWN"/><div className="category-list">{snapshot.usage.categories.map(category => <div key={category.name} className="category-row"><div className="category-meta"><span><i style={{background: category.color}}/>{category.name}</span><strong>{category.amountGb.toFixed(1)} GB</strong></div><div className="category-track"><div style={{background: category.color, width: `${(category.amountGb / snapshot.usage.dataUsedGb)*100}%`}}/></div></div>)}</div><p className="helper">Illustrative category breakdown; not device-level tracking.</p></Panel></div>
    <Panel><PanelHeading title="Monthly usage trend" kicker="LAST SIX MONTHS"/><UsageBarChart snapshot={snapshot}/></Panel></div>;
}
function Bills({ snapshot, onDownload }: { snapshot: PortalSnapshot; onDownload: (id: string) => void }) {
  const plan = snapshot.plans.find(item => item.id === snapshot.activePlanId)!;
  return <div className="page-content"><div className="bill-summary-grid"><div className="billing-highlight"><span className="eyebrow">NEXT ESTIMATED PAYMENT</span><strong>{formatMoney(plan.price)}</strong><span>Due {snapshot.usage.nextRenewal}</span><div className="highlight-decoration"/></div><Panel className="summary-card"><span className="eyebrow">YOUR PAYMENT STATUS</span><div className="summary-status"><Icon name="check-circle" size={27}/> All caught up</div><p>Your sample account has no outstanding balance.</p></Panel></div><Panel><PanelHeading title="Invoice history" kicker="YOUR STATEMENTS"/><div className="table-wrap"><table className="invoice-table"><thead><tr><th scope="col">Invoice</th><th scope="col">Date</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead><tbody>{snapshot.invoices.map(invoice => <tr key={invoice.id}><td><strong>{invoice.period}</strong><small>{invoice.id}</small></td><td>{invoice.date}</td><td className="money-cell">{formatMoney(invoice.amount)}</td><td><Status value={invoice.status}/></td><td><button type="button" className="download-btn" onClick={() => onDownload(invoice.id)} aria-label={`Download demo invoice for ${invoice.period}`}><Icon name="download" size={17}/> <span>Download</span></button></td></tr>)}</tbody></table></div><p className="helper invoice-helper">Downloads are clearly labelled fictional plain-text invoices. No real payments are processed.</p></Panel></div>;
}
function Plans({ snapshot, onChange }: { snapshot: PortalSnapshot; onChange: (planId: PlanId) => void }) {
  return <div className="page-content"><div className="inner-hero"><div><span className="eyebrow">FLEXIBLE PLANS</span><h2>A plan that moves with you.</h2><p>Compare the demo plans and explore an upgrade or downgrade.</p></div><div className="hero-badge"><Icon name="zap" size={17}/> Fast 5G connectivity</div></div><div className="plans-grid">{snapshot.plans.map(plan => { const current = plan.id === snapshot.activePlanId; return <article className={`offer-card ${current ? 'selected' : ''}`} key={plan.id}>{current && <div className="current-ribbon"><Icon name="check" size={14}/> CURRENT PLAN</div>}<div className="offer-top"><div className="offer-symbol"><Icon name={plan.id === 'unlimited' ? 'sparkles' : plan.id === 'plus' ? 'zap' : 'sim'} size={22}/></div><h3>{plan.name}</h3><p>{plan.description}</p></div><div className="offer-price">{formatMoney(plan.price)}<small>/month</small></div><div className="offer-data">{plan.dataLimitGb == null ? 'Unlimited' : `${plan.dataLimitGb} GB`} <small>data</small></div><div className="offer-divider"/><ul>{[plan.calls, plan.texts, ...plan.perks].map(perk => <li key={perk}><Icon name="check" size={16}/>{perk}</li>)}</ul><button type="button" className={current ? 'current-plan-button' : 'offer-button'} onClick={() => !current && onChange(plan.id)} disabled={current}>{current ? 'Your current plan' : 'Choose this plan'} {!current && <Icon name="arrow-right" size={17}/>}</button></article>; })}</div><div className="footnote"><Icon name="shield" size={18}/> Plan changes are simulated in this portfolio demo and do not affect a real phone account.</div></div>;
}
function Support({ snapshot, onCreate }: { snapshot: PortalSnapshot; onCreate: (input: TicketInput) => Promise<boolean> }) {
  const [formOpen, setFormOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical support');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true);
    const success = await onCreate({ subject: subject.trim(), category, message: message.trim() });
    setSubmitting(false);
    if (success) { setFormOpen(false); setSubject(''); setMessage(''); }
  }
  return <div className="page-content"><div className="support-hero"><div className="support-hero-icon"><Icon name="headphones" size={30}/></div><div><span className="eyebrow">SUPPORT CENTRE</span><h2>How can we help you today?</h2><p>Have a question? Log a request and track its status.</p></div><button type="button" className="primary-button" onClick={() => setFormOpen(value => !value)}><Icon name={formOpen ? 'close' : 'plus'} size={18}/>{formOpen ? 'Close form' : 'New support request'}</button></div>
    {formOpen && <Panel className="support-form-panel"><PanelHeading title="Create a support request" kicker="TELL US WHAT'S HAPPENING"/><form onSubmit={submit} className="stacked-form"><div className="form-grid"><label>Subject<input maxLength={100} minLength={3} required value={subject} onChange={event => setSubject(event.target.value)} placeholder="A short summary"/></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option>Technical support</option><option>Billing</option><option>Plan & roaming</option><option>Other</option></select></label></div><label>Message<textarea maxLength={1000} minLength={10} required rows={4} value={message} onChange={event => setMessage(event.target.value)} placeholder="Tell us more about your request..."/></label><button className="primary-button form-submit" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Submit request'}<Icon name="arrow-right" size={17}/></button></form></Panel>}
    <Panel><PanelHeading title="Your support requests" kicker="TICKET HISTORY" action={<span className="count-badge">{snapshot.tickets.length} requests</span>}/><div className="ticket-list">{snapshot.tickets.map(ticket => <div className="ticket" key={ticket.id}><div className="ticket-icon"><Icon name="headphones" size={19}/></div><div className="ticket-body"><div className="ticket-title"><strong>{ticket.subject}</strong><Status value={ticket.status}/></div><p>{ticket.message}</p><div className="ticket-meta"><span>#{ticket.id}</span><span>{ticket.category}</span><span>{ticket.createdAt}</span></div></div></div>)}</div></Panel></div>;
}
function Settings({ snapshot, onSave, onReset }: { snapshot: PortalSnapshot; onSave: (input: ProfileInput) => Promise<boolean>; onReset: () => void }) {
  const [name, setName] = useState(snapshot.customer.name);
  const [email, setEmail] = useState(snapshot.customer.email);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setName(snapshot.customer.name); setEmail(snapshot.customer.email); }, [snapshot.customer.name, snapshot.customer.email]);
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); await onSave({ name: name.trim(), email: email.trim() }); setSaving(false); }
  return <div className="page-content"><div className="settings-grid"><Panel><PanelHeading title="Personal information" kicker="YOUR PROFILE"/><div className="settings-avatar">{snapshot.customer.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}<span><Icon name="check" size={12}/></span></div><form onSubmit={save} className="stacked-form"><label>Full name<input minLength={2} maxLength={100} required value={name} onChange={event => setName(event.target.value)}/></label><label>Email address<input type="email" required value={email} onChange={event => setEmail(event.target.value)}/></label><label>Mobile number<input readOnly value={snapshot.customer.phone} className="read-only"/><small>Demo mobile number cannot be changed.</small></label><button type="submit" className="primary-button form-submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}<Icon name="check" size={17}/></button></form></Panel><div className="setting-side"><Panel><PanelHeading title="Account details" kicker="MEMBERSHIP"/><div className="setting-detail"><span>Member since</span><strong>{snapshot.customer.memberSince}</strong></div><div className="setting-detail"><span>Account number</span><strong>ORB-100041</strong></div><div className="setting-detail"><span>Mobile number</span><strong>{snapshot.customer.phone}</strong></div></Panel><Panel className="reset-card"><PanelHeading title="Demo controls" kicker="PORTFOLIO MODE"/><p>Reset your local demo changes, including your profile, selected plan and support tickets.</p><button type="button" className="soft-button" onClick={onReset}><Icon name="refresh" size={16}/> Reset demo data</button></Panel></div></div></div>;
}
function SignIn({ onLogin, error, loading }: { onLogin: (username: string, password: string) => void; error: string; loading: boolean }) {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('Demo123!');
  return <main className="login-layout"><div className="login-decor"><div className="brand brand-login"><span className="brand-mark"><span/></span><span className="brand-name">orbit<span className="brand-dot">.</span><small>MOBILE</small></span></div><div className="login-art"><div className="login-art-circle"><Icon name="signal" size={65}/></div><h1>All your mobile.<br/>One beautiful place.</h1><p>Stay connected, in control, and ahead of your day.</p></div><div className="login-disclaimer">Fictional product concept • Engineering portfolio</div></div><div className="login-content"><div className="login-card"><span className="login-eyebrow">WELCOME TO ORBIT</span><h2>Sign in to your account</h2><p>Explore the interactive customer portal demo.</p><form onSubmit={event => { event.preventDefault(); onLogin(username, password); }} className="stacked-form"><label>Username<input autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/></label>{error && <p className="login-error" role="alert">{error}</p>}<button type="submit" className="primary-button login-submit" disabled={loading}>{loading ? 'Signing in…' : 'Explore demo'}<Icon name="arrow-right" size={18}/></button></form><div className="demo-credentials"><Icon name="shield" size={18}/><span><strong>Demo access:</strong> demo / Demo123!<small>No real customer accounts or personal information.</small></span></div></div></div></main>;
}
function ConfirmPlan({ plan, onConfirm, onCancel, busy }: { plan: Plan; onConfirm: () => void; onCancel: () => void; busy: boolean }) {
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="change-plan-heading"><div className="modal-icon"><Icon name="sim" size={25}/></div><h2 id="change-plan-heading">Switch to {plan.name}?</h2><p>Your demo plan will change to <strong>{plan.name}</strong> at <strong>{formatMoney(plan.price)}/month</strong>. This is a simulated change only.</p><div className="modal-actions"><button className="soft-button" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className="primary-button" autoFocus type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Updating…' : 'Confirm change'}<Icon name="arrow-right" size={16}/></button></div></div></div>;
}
export default function App() {
  const [snapshot, setSnapshot] = useState<PortalSnapshot>(seed);
  const [section, setSection] = useState<Section>('overview');
  const [signedIn, setSignedIn] = useState(!portalApi.isServer);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { if (!portalApi.isServer) void portalApi.getSnapshot().then(setSnapshot).catch(error => setToast(String(error))); }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3800); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!pendingPlan) return; const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') setPendingPlan(null); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [pendingPlan]);
  function navigate(next: Section) { setSection(next); setMobileOpen(false); window.scrollTo?.({ top: 0, behavior: 'smooth' }); }
  async function login(username: string, password: string) { setBusy(true); setError(''); try { setSnapshot(await portalApi.signIn(username, password)); setSignedIn(true); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not sign in.'); } finally { setBusy(false); } }
  function signOut() { portalApi.signOut(); setSignedIn(false); setSection('overview'); }
  async function confirmPlan() { if (!pendingPlan) return; setBusy(true); try { setSnapshot(await portalApi.changePlan(pendingPlan)); setToast('Your demo plan has been updated.'); setPendingPlan(null); } catch (caught) { setToast(caught instanceof Error ? caught.message : 'Unable to update plan.'); } finally { setBusy(false); } }
  async function createTicket(input: TicketInput) { try { setSnapshot(await portalApi.createTicket(input)); setToast('Support request created successfully.'); return true; } catch (caught) { setToast(caught instanceof Error ? caught.message : 'Unable to create request.'); return false; } }
  async function saveProfile(input: ProfileInput) { try { setSnapshot(await portalApi.updateProfile(input)); setToast('Your profile has been saved.'); return true; } catch (caught) { setToast(caught instanceof Error ? caught.message : 'Unable to save profile.'); return false; } }
  async function reset() { try { setSnapshot(await portalApi.reset()); setToast('Demo has been reset.'); } catch (caught) { setToast(caught instanceof Error ? caught.message : 'Unable to reset demo.'); } }
  if (!signedIn) return <SignIn onLogin={login} error={error} loading={busy}/>;
  return <div className="app-shell"><Sidebar active={section} navigate={navigate} onSignOut={signOut} open={mobileOpen} close={() => setMobileOpen(false)}/><div className="app-main"><Topbar snapshot={snapshot} active={section} navigate={navigate} onMenu={() => setMobileOpen(true)}/><main className="main-content"><div className="page-heading"><div><span className="eyebrow">ORBIT MOBILE / YOUR ACCOUNT</span><h1>{labels[section].title}</h1><p>{labels[section].caption}</p></div><div className="heading-meta"><Icon name="calendar" size={17}/> November 2026</div></div>
    {section === 'overview' && <Overview snapshot={snapshot} navigate={navigate}/>}
    {section === 'usage' && <Usage snapshot={snapshot}/>}
    {section === 'bills' && <Bills snapshot={snapshot} onDownload={id => { downloadInvoice(id, snapshot); setToast('Fictional invoice downloaded.'); }}/>}
    {section === 'plans' && <Plans snapshot={snapshot} onChange={setPendingPlan}/>}
    {section === 'support' && <Support snapshot={snapshot} onCreate={createTicket}/>}
    {section === 'settings' && <Settings snapshot={snapshot} onSave={saveProfile} onReset={reset}/>}
    <footer className="main-footer"><span>© 2026 Orbit Mobile — Fictional portfolio experience</span><span>Crafted for clarity, accessibility & performance.</span></footer>
  </main></div>{pendingPlan && <ConfirmPlan plan={snapshot.plans.find(item => item.id === pendingPlan)!} onConfirm={confirmPlan} onCancel={() => setPendingPlan(null)} busy={busy}/>}{toast && <div className="toast" role="status"><Icon name="check-circle" size={19}/>{toast}<button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={15}/></button></div>}</div>;
}

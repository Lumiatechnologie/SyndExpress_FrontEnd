// ---------------------------------------------
// Types utilitaires
// ---------------------------------------------
type Timer = ReturnType<typeof setTimeout>;

// ---------------------------------------------
// Throttle: exécute au plus une fois par "limit" ms
// ---------------------------------------------
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastRan: number | null = null;
  let lastFunc: Timer | null = null;

  return function throttled(this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (lastRan === null) {
      func.apply(this, args);
      lastRan = now;
      return;
    }

    if (lastFunc) clearTimeout(lastFunc);

    const remaining = Math.max(0, limit - (now - lastRan));
    lastFunc = setTimeout(() => {
      if (Date.now() - (lastRan as number) >= limit) {
        func.apply(this, args);
        lastRan = Date.now();
      }
    }, remaining);
  };
}

// ---------------------------------------------
// Debounce: exécute après "wait" ms sans nouvel appel
// ---------------------------------------------
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: Timer | null = null;

  return function debounced(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ---------------------------------------------
// Rôles: extraction robuste depuis localStorage('auth')
// ---------------------------------------------
function toRoleString(r: unknown): string {
  if (typeof r === 'string') return r;
  if (r && typeof r === 'object') {
    const o = r as Record<string, unknown>;
    return String(o.name ?? o.role ?? o.authority ?? o.value ?? '');
  }
  return '';
}

function getAuthRoles(): string[] {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return [];
    const auth = JSON.parse(raw);
    const rolesRaw: unknown[] = Array.isArray(auth?.roles) ? auth.roles : [];
    return rolesRaw
      .map((role: unknown) => toRoleString(role))
      .filter((s: string) => Boolean(s))
      .map((s: string) => s.toUpperCase());
  } catch {
    return [];
  }
}

export function canModerate(): boolean {
  return getAuthRoles().includes('ROLE_MODERATOR');
}

export function isModerator(): boolean {
  return getAuthRoles().includes('ROLE_MODERATOR');
}

// ---------------------------------------------
// Divers utilitaires
// ---------------------------------------------
export function uid(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function getInitials(
  name: string | null | undefined,
  count?: number,
): string {
  if (!name || typeof name !== 'string') return '';
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part: string) => part[0]?.toUpperCase() ?? '')
    .filter(Boolean);

  return count && count > 0 ? initials.slice(0, count).join('') : initials.join('');
}

export function toAbsoluteUrl(pathname: string): string {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  if (!pathname) return baseUrl;
  if (baseUrl === '/' || pathname.startsWith('http')) return pathname;
  return `${baseUrl.replace(/\/$/, '')}/${pathname.replace(/^\//, '')}`;
}

// ---------------------------------------------
// Temps relatifs ("time ago")
// ---------------------------------------------
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';

  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

// ---------------------------------------------
// Formatage de date / heure
// ---------------------------------------------
export function formatDate(input: Date | string | number, locale = 'en-US'): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(
  input: Date | string | number,
  locale = 'en-US',
): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

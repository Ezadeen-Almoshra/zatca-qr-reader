import { getDateLocale, resolveLanguage } from '@/shared/i18n';

export function formatAmount(value: number) {
  const amount = Number.isFinite(value) ? value : 0;
  const negative = amount < 0;
  const [whole, fraction = '00'] = Math.abs(amount).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${grouped}.${fraction}`;
}

export function formatMoney(value: number, language: string) {
  const currency = resolveLanguage(language) === 'ar' ? 'ر.س' : 'SAR';
  return `${formatAmount(value)} ${currency}`;
}

export function formatInvoiceStamp(value: string) {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}:\d{2}(?::\d{2})?)/);
  if (!match) return value.trim();
  const time = match[4].length === 5 ? `${match[4]}:00` : match[4];
  return `${match[3]}/${match[2]}/${match[1]}  ${time}`;
}

export function formatDateTime(value: string, language: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(getDateLocale(language) === 'ar' ? 'ar-SA' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatDate(value: string, language: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(getDateLocale(language) === 'ar' ? 'ar-SA' : 'en-GB', {
    dateStyle: 'medium',
  }).format(date);
}

export function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

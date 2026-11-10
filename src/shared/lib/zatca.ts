export const INVOICE_CATEGORIES = [
  'general',
  'food',
  'transport',
  'shopping',
  'services',
  'other',
] as const;

export type InvoiceCategory = (typeof INVOICE_CATEGORIES)[number];
export type InvoicePhase = 1 | 2;
export type ComplianceStatus = 'compliant' | 'warning' | 'invalid';

export type ZatcaIssueCode =
  | 'invalidQr'
  | 'missingRequiredTags'
  | 'sellerRequired'
  | 'vatRequired'
  | 'vatInvalid'
  | 'dateRequired'
  | 'dateInvalid'
  | 'totalInvalid'
  | 'vatAmountInvalid';

export type ZatcaFieldIssue = {
  field: string;
  code: ZatcaIssueCode;
};

export type ZatcaDecodeResult = {
  rawQr: string;
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  total: number;
  vat: number;
  invoiceHash?: string;
  phase: InvoicePhase;
  status: ComplianceStatus;
  issues: ZatcaFieldIssue[];
  tagsFound: number[];
};

const TEXT_DECODER = new TextDecoder();
const TEXT_ENCODER = new TextEncoder();

function decodeBase64(input: string): Uint8Array {
  const normalized = input.trim().replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = globalThis.atob(normalized + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return globalThis.btoa(binary);
}

function parseTlv(bytes: Uint8Array): Map<number, Uint8Array> {
  const tags = new Map<number, Uint8Array>();
  let index = 0;

  while (index + 2 <= bytes.length) {
    const tag = bytes[index];
    const length = bytes[index + 1];
    index += 2;
    if (tag === undefined || length === undefined || index + length > bytes.length) {
      break;
    }
    tags.set(tag, bytes.slice(index, index + length));
    index += length;
  }

  return tags;
}

function readText(tags: Map<number, Uint8Array>, tag: number): string {
  const value = tags.get(tag);
  if (!value) return '';
  return TEXT_DECODER.decode(value).trim();
}

function parseAmount(value: string): number | null {
  const normalized = value.replace(/,/g, '').replace(/[^\d.-]/g, '');
  if (!normalized) return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function isValidVatNumber(value: string): boolean {
  return /^3\d{13}3$/.test(value);
}

function isValidTimestamp(value: string): boolean {
  if (!value) return false;
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

export function invoiceHashToHex(hash?: string): string {
  if (!hash) return '';
  const trimmed = hash.trim();
  if (/^[0-9a-f]{64}$/i.test(trimmed)) return trimmed.toLowerCase();

  try {
    const normalized = trimmed.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const binary = globalThis.atob(normalized + pad);
    let hex = '';
    for (let index = 0; index < binary.length; index += 1) {
      hex += binary.charCodeAt(index).toString(16).padStart(2, '0');
    }
    return hex || trimmed;
  } catch {
    return trimmed;
  }
}

export function encodeZatcaQr(fields: {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  total: string | number;
  vat: string | number;
  invoiceHash?: string;
}): string {
  const values = [
    fields.sellerName,
    fields.vatNumber,
    fields.timestamp,
    String(fields.total),
    String(fields.vat),
    fields.invoiceHash,
  ].filter((value): value is string => value !== undefined);

  const chunks: number[] = [];
  values.forEach((value, index) => {
    const encoded = TEXT_ENCODER.encode(value);
    chunks.push(index + 1, encoded.length, ...encoded);
  });

  return encodeBase64(Uint8Array.from(chunks));
}

export function decodeZatcaQr(rawQr: string): ZatcaDecodeResult {
  const issues: ZatcaFieldIssue[] = [];
  const empty: ZatcaDecodeResult = {
    rawQr,
    sellerName: '',
    vatNumber: '',
    timestamp: '',
    total: 0,
    vat: 0,
    phase: 1,
    status: 'invalid',
    issues: [{ field: 'qr', code: 'invalidQr' }],
    tagsFound: [],
  };

  if (!rawQr.trim()) {
    return empty;
  }

  let bytes: Uint8Array;
  try {
    bytes = decodeBase64(rawQr);
  } catch {
    return empty;
  }

  if (bytes.length < 6) {
    return empty;
  }

  const tags = parseTlv(bytes);
  const tagsFound = [...tags.keys()].sort((a, b) => a - b);
  if (tagsFound.length < 5 || ![1, 2, 3, 4, 5].every((tag) => tags.has(tag))) {
    return {
      ...empty,
      tagsFound,
      issues: [{ field: 'qr', code: 'missingRequiredTags' }],
    };
  }

  const sellerName = readText(tags, 1);
  const vatNumber = readText(tags, 2);
  const timestamp = readText(tags, 3);
  const totalText = readText(tags, 4);
  const vatText = readText(tags, 5);
  const invoiceHash = readText(tags, 6) || undefined;
  const phase: InvoicePhase = tags.has(6) || tags.has(7) || tags.has(8) || tags.has(9) ? 2 : 1;

  const total = parseAmount(totalText);
  const vat = parseAmount(vatText);

  if (!sellerName) issues.push({ field: 'sellerName', code: 'sellerRequired' });
  if (!vatNumber) issues.push({ field: 'vatNumber', code: 'vatRequired' });
  else if (!isValidVatNumber(vatNumber)) issues.push({ field: 'vatNumber', code: 'vatInvalid' });
  if (!timestamp) issues.push({ field: 'timestamp', code: 'dateRequired' });
  else if (!isValidTimestamp(timestamp)) issues.push({ field: 'timestamp', code: 'dateInvalid' });
  if (total === null) issues.push({ field: 'total', code: 'totalInvalid' });
  if (vat === null) issues.push({ field: 'vat', code: 'vatAmountInvalid' });
  // Tag 4 is the amount due in the invoice currency (BT-115). Tag 5 is the VAT
  // amount, which on a foreign-currency invoice is often the SAR tax total
  // (BT-111) and is not reduced by advance payments. Those two numbers are not
  // the same currency, so VAT may be numerically larger than the total.

  const blocking = issues.some((issue) =>
    ['sellerRequired', 'vatRequired', 'dateRequired', 'totalInvalid', 'vatAmountInvalid'].includes(
      issue.code,
    ),
  );

  return {
    rawQr,
    sellerName,
    vatNumber,
    timestamp,
    total: total ?? 0,
    vat: vat ?? 0,
    invoiceHash,
    phase,
    status: blocking ? 'invalid' : issues.length > 0 ? 'warning' : 'compliant',
    issues,
    tagsFound,
  };
}

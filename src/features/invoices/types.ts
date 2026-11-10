import type {
  ComplianceStatus,
  InvoiceCategory,
  InvoicePhase,
  ZatcaFieldIssue,
} from '@/shared/lib/zatca';

export type StoredInvoice = {
  id: string;
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
  category: InvoiceCategory;
  scannedAt: string;
};

export type DateRange = {
  from: string | null;
  to: string | null;
};

export type ReportType = 'summary' | 'details' | 'sellers' | 'categories';

export type NamedTotal = {
  key: string;
  label: string;
  total: number;
  vat: number;
  count: number;
};

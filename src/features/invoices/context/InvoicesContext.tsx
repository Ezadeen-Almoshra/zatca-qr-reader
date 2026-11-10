import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { endOfDay, startOfDay } from '@/shared/lib/money';
import { decodeZatcaQr, type InvoiceCategory, type ZatcaDecodeResult } from '@/shared/lib/zatca';
import { storage } from '@/shared/services/storage';
import type { DateRange, NamedTotal, StoredInvoice } from '../types';

type InvoicesContextValue = {
  invoices: StoredInvoice[];
  filteredInvoices: StoredInvoice[];
  isLoading: boolean;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  addFromQr: (rawQr: string, category?: InvoiceCategory) => Promise<StoredInvoice>;
  updateInvoice: (id: string, data: Partial<Pick<StoredInvoice, 'category'>>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoice: (id: string) => StoredInvoice | undefined;
  totals: { total: number; vat: number; count: number; compliant: number };
  byCategory: NamedTotal[];
  bySeller: NamedTotal[];
};

const InvoicesContext = createContext<InvoicesContextValue | null>(null);

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toStoredInvoice(
  decoded: ZatcaDecodeResult,
  category: InvoiceCategory = 'general',
): StoredInvoice {
  return {
    id: createId(),
    rawQr: decoded.rawQr,
    sellerName: decoded.sellerName || '—',
    vatNumber: decoded.vatNumber,
    timestamp: decoded.timestamp,
    total: decoded.total,
    vat: decoded.vat,
    invoiceHash: decoded.invoiceHash,
    phase: decoded.phase,
    status: decoded.status,
    issues: decoded.issues,
    category,
    scannedAt: new Date().toISOString(),
  };
}

function refreshDecoded(invoice: StoredInvoice): StoredInvoice {
  if (!invoice.rawQr) return invoice;
  const decoded = decodeZatcaQr(invoice.rawQr);
  const storedIssues = invoice.issues ?? [];
  const issuesChanged =
    decoded.issues.length !== storedIssues.length ||
    decoded.issues.some((issue, index) => issue.code !== storedIssues[index]?.code);
  if (!issuesChanged && decoded.status === invoice.status) return invoice;
  return {
    ...invoice,
    total: decoded.total,
    vat: decoded.vat,
    phase: decoded.phase,
    status: decoded.status,
    issues: decoded.issues,
  };
}

function inRange(invoice: StoredInvoice, range: DateRange) {
  if (!range.from && !range.to) return true;
  const source = invoice.timestamp || invoice.scannedAt;
  const time = new Date(source).getTime();
  if (Number.isNaN(time)) return false;
  if (range.from && time < startOfDay(new Date(range.from)).getTime()) return false;
  if (range.to && time > endOfDay(new Date(range.to)).getTime()) return false;
  return true;
}

function groupBy(
  invoices: StoredInvoice[],
  getKey: (invoice: StoredInvoice) => string,
  getLabel: (invoice: StoredInvoice, key: string) => string,
): NamedTotal[] {
  const map = new Map<string, NamedTotal>();
  invoices.forEach((invoice) => {
    const key = getKey(invoice);
    const current = map.get(key) ?? {
      key,
      label: getLabel(invoice, key),
      total: 0,
      vat: 0,
      count: 0,
    };
    current.total += invoice.total;
    current.vat += invoice.vat;
    current.count += 1;
    map.set(key, current);
  });
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  useEffect(() => {
    let cancelled = false;
    storage
      .getInvoices<StoredInvoice>()
      .then((saved) => {
        if (cancelled) return;
        const refreshed = saved.map(refreshDecoded);
        const changed = refreshed.some((invoice, index) => invoice !== saved[index]);
        setInvoices(refreshed);
        if (changed) void storage.setInvoices(refreshed);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: StoredInvoice[]) => {
    setInvoices(next);
    await storage.setInvoices(next);
  }, []);

  const addFromQr = useCallback(
    async (rawQr: string, category: InvoiceCategory = 'general') => {
      const invoice = toStoredInvoice(decodeZatcaQr(rawQr), category);
      await persist([invoice, ...invoices]);
      return invoice;
    },
    [invoices, persist],
  );

  const updateInvoice = useCallback(
    async (id: string, data: Partial<Pick<StoredInvoice, 'category'>>) => {
      await persist(
        invoices.map((invoice) => (invoice.id === id ? { ...invoice, ...data } : invoice)),
      );
    },
    [invoices, persist],
  );

  const deleteInvoice = useCallback(
    async (id: string) => {
      await persist(invoices.filter((invoice) => invoice.id !== id));
    },
    [invoices, persist],
  );

  const getInvoice = useCallback(
    (id: string) => invoices.find((invoice) => invoice.id === id),
    [invoices],
  );

  const filteredInvoices = useMemo(
    () => invoices.filter((invoice) => inRange(invoice, dateRange)),
    [dateRange, invoices],
  );

  const totals = useMemo(
    () =>
      filteredInvoices.reduce(
        (acc, invoice) => {
          acc.total += invoice.total;
          acc.vat += invoice.vat;
          acc.count += 1;
          if (invoice.status === 'compliant') acc.compliant += 1;
          return acc;
        },
        { total: 0, vat: 0, count: 0, compliant: 0 },
      ),
    [filteredInvoices],
  );

  const byCategory = useMemo(
    () =>
      groupBy(
        filteredInvoices,
        (invoice) => invoice.category,
        (invoice) => invoice.category,
      ),
    [filteredInvoices],
  );

  const bySeller = useMemo(
    () =>
      groupBy(
        filteredInvoices,
        (invoice) => invoice.sellerName,
        (invoice) => invoice.sellerName,
      ),
    [filteredInvoices],
  );

  const value = useMemo<InvoicesContextValue>(
    () => ({
      invoices,
      filteredInvoices,
      isLoading,
      dateRange,
      setDateRange,
      addFromQr,
      updateInvoice,
      deleteInvoice,
      getInvoice,
      totals,
      byCategory,
      bySeller,
    }),
    [
      addFromQr,
      byCategory,
      bySeller,
      dateRange,
      deleteInvoice,
      filteredInvoices,
      getInvoice,
      invoices,
      isLoading,
      totals,
      updateInvoice,
    ],
  );

  return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
}

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoicesProvider');
  }
  return context;
}

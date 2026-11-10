import { Platform } from 'react-native';

export type InvoicePrintFields = {
  kind: string;
  seller: string;
  rows: { label: string; value: string }[];
  amounts: { label: string; value: string }[];
  hashLabel?: string;
  hash?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildInvoiceHtml(fields: InvoicePrintFields) {
  const rows = fields.rows
    .map(
      (row) =>
        `<div class="row"><span>${escapeHtml(row.label)}</span><strong dir="ltr">${escapeHtml(row.value)}</strong></div>`,
    )
    .join('');

  const amounts = fields.amounts
    .map((row, index) => {
      const isTotal = index === fields.amounts.length - 1;
      return `<div class="amount${isTotal ? ' total' : ''}"><span>${escapeHtml(row.label)}</span><strong dir="ltr">${escapeHtml(row.value)}</strong></div>`;
    })
    .join('');

  const hash = fields.hash
    ? `<div class="hash">${fields.hashLabel ? `<div>${escapeHtml(fields.hashLabel)}</div>` : ''}<strong dir="ltr">${escapeHtml(fields.hash)}</strong></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(fields.seller)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: #efe8dc; color: #14221f; font-family: "IBM Plex Sans Arabic", Tahoma, sans-serif; }
    .page { padding: 28px 16px 40px; }
    .sheet { max-width: 420px; margin: 0 auto; background: #fffcf7; overflow: hidden; }
    .holes { display: flex; justify-content: space-between; height: 10px; overflow: hidden; }
    .hole { width: 16px; height: 16px; border-radius: 50%; background: #efe8dc; }
    .hole.top { margin-top: -8px; }
    .hole.bottom { margin-top: 2px; }
    .head { text-align: center; padding: 18px 20px 8px; }
    .kind { margin: 0; color: #0b3d3a; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; }
    h1 { margin: 8px 0 0; font-size: 22px; line-height: 1.45; }
    .gold { width: 64px; height: 2px; margin: 12px auto 0; border-radius: 99px; background: #c9a227; }
    .row, .amount { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .row { padding: 12px 20px; border-top: 1px dashed #e4d9c8; font-size: 14px; }
    .row span, .amount span { color: #5c6b67; }
    .row strong, .amount strong { font-weight: 600; letter-spacing: 0.4px; }
    .amounts { margin: 14px 20px 18px; }
    .amount { padding: 6px 0; font-size: 14px; }
    .amount.total { margin-top: 8px; padding-top: 10px; border-top: 3px double #14221f; color: #14221f; }
    .amount.total span, .amount.total strong { color: #14221f; font-weight: 700; }
    .amount.total strong { font-size: 18px; }
    .hash { padding: 4px 20px 8px; text-align: center; color: #5c6b67; font-size: 11px; line-height: 1.6; word-break: break-all; }
    .hash strong { color: #14221f; font-weight: 600; }
  </style>
</head>
<body>
  <div class="page">
    <article class="sheet">
      <div class="holes">${'<div class="hole top"></div>'.repeat(16)}</div>
      <header class="head">
        <p class="kind">${escapeHtml(fields.kind)}</p>
        <h1>${escapeHtml(fields.seller)}</h1>
        <div class="gold"></div>
      </header>
      ${rows}
      <section class="amounts">${amounts}</section>
      ${hash}
      <div class="holes">${'<div class="hole bottom"></div>'.repeat(16)}</div>
    </article>
  </div>
</body>
</html>`;
}

export async function printInvoiceHtml(html: string) {
  if (Platform.OS === 'web') {
    await printHtmlOnWeb(html);
    return;
  }

  const { printAsync } = await import('expo-print');
  await printAsync({ html });
}

function printHtmlOnWeb(html: string) {
  return new Promise<void>((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('title', 'invoice-print');
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0';
    document.body.appendChild(frame);

    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!win || !doc) {
      frame.remove();
      reject(new Error('print-frame'));
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setTimeout(() => frame.remove(), 400);
      resolve();
    };

    win.onafterprint = finish;
    setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(finish, 800);
    }, 150);
  });
}

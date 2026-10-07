import { DEFAULT_SETTINGS, INITIAL_SAMPLE_QUOTATIONS } from '../data/defaultData.js';

const STORAGE_KEYS = {
  SETTINGS: 'apex_billing_settings_v1',
  QUOTATIONS: 'apex_billing_quotations_v1'
};

// ----------------------------------------------------
// SETTINGS
// ----------------------------------------------------
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving settings to localStorage:', e);
    return false;
  }
}

// ----------------------------------------------------
// QUOTATIONS
// ----------------------------------------------------
export function getQuotations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(INITIAL_SAMPLE_QUOTATIONS));
      return INITIAL_SAMPLE_QUOTATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(INITIAL_SAMPLE_QUOTATIONS));
      return INITIAL_SAMPLE_QUOTATIONS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading quotations from localStorage:', e);
    return INITIAL_SAMPLE_QUOTATIONS;
  }
}

export function saveQuotations(quotations) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    return true;
  } catch (e) {
    console.error('Error saving quotations to localStorage:', e);
    return false;
  }
}

// ----------------------------------------------------
// QUOTATION NUMBER GENERATION
// Example: QT-2026-0001
// ----------------------------------------------------
export function generateNextQuoteNumber(existingQuotes = []) {
  const currentYear = new Date().getFullYear();
  const prefix = `QT-${currentYear}-`;

  let maxNum = 0;
  for (const q of existingQuotes) {
    const numStr = q.quoteNumber || q.id || '';
    if (numStr.startsWith(prefix)) {
      const parts = numStr.split('-');
      const sequence = parseInt(parts[2], 10);
      if (!isNaN(sequence) && sequence > maxNum) {
        maxNum = sequence;
      }
    }
  }

  const nextSequence = String(maxNum + 1).padStart(4, '0');
  return `${prefix}${nextSequence}`;
}

// ----------------------------------------------------
// CALCULATION LOGIC
// Area = Width × Height
// Profile Cost = Area × Profile Rate
// Glass Cost = Area × Glass Rate
// Hardware Cost = entered amount
// Labour Cost = entered amount
// Other Charges = entered amount
// Window Subtotal = (Profile Cost + Glass Cost + Hardware + Labour + Other) × Quantity
// ----------------------------------------------------
export function calculateWindowItem(item, defaultProfileRate = 175, defaultGlassRate = 300) {
  const width = parseFloat(item.width) || 0;
  const height = parseFloat(item.height) || 0;
  const quantity = parseInt(item.quantity, 10) > 0 ? parseInt(item.quantity, 10) : 1;
  const area = parseFloat((width * height).toFixed(2));
  const totalArea = parseFloat((area * quantity).toFixed(2));

  const pRate = (item.profileRate !== undefined && item.profileRate !== '')
    ? parseFloat(item.profileRate) || 0
    : defaultProfileRate;

  const gRate = (item.glassRate !== undefined && item.glassRate !== '')
    ? parseFloat(item.glassRate) || 0
    : defaultGlassRate;

  const profileCost = parseFloat((area * pRate).toFixed(2));
  const glassCost = parseFloat((area * gRate).toFixed(2));
  const hardwareCost = parseFloat(item.hardwareCost) || 0;
  const labourCost = parseFloat(item.labourCost) || 0;
  const otherCharges = parseFloat(item.otherCharges) || 0;

  const unitCost = parseFloat((profileCost + glassCost + hardwareCost + labourCost + otherCharges).toFixed(2));
  const subtotal = parseFloat((unitCost * quantity).toFixed(2));

  return {
    width,
    height,
    quantity,
    area,
    totalArea,
    profileRate: pRate,
    glassRate: gRate,
    profileCost,
    glassCost,
    hardwareCost,
    labourCost,
    otherCharges,
    unitCost,
    subtotal
  };
}

export function calculateQuotationTotals(items = [], additionalCharges = 0, discount = 0, defaultProfileRate = 175, defaultGlassRate = 300) {
  let subtotal = 0;
  let totalArea = 0;
  let totalQuantity = 0;

  const calculatedItems = items.map((it) => {
    const calc = calculateWindowItem(it, defaultProfileRate, defaultGlassRate);
    subtotal += calc.subtotal;
    totalArea += calc.totalArea;
    totalQuantity += calc.quantity;
    return { ...it, calc };
  });

  const addCharges = parseFloat(additionalCharges) || 0;
  const disc = parseFloat(discount) || 0;
  const grandTotal = Math.max(0, parseFloat((subtotal + addCharges - disc).toFixed(2)));

  return {
    calculatedItems,
    itemsCount: items.length,
    totalQuantity,
    totalArea: parseFloat(totalArea.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    additionalCharges: addCharges,
    discount: disc,
    grandTotal
  };
}

// ----------------------------------------------------
// CURRENCY FORMATTING (Indian Rupee format)
// ----------------------------------------------------
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

// ----------------------------------------------------
// NUMBER TO WORDS (Indian Currency Format)
// ----------------------------------------------------
export function numberToWords(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return 'Zero Rupees Only';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) res += a[hundred] + ' Hundred';
    if (rest > 0) {
      if (res !== '') res += ' and ';
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;
  let hundreds = remainder;

  let words = '';
  if (crore > 0) words += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertThreeDigits(thousand) + ' Thousand ';
  if (hundreds > 0) words += convertThreeDigits(hundreds);

  return `${words.trim()} Rupees Only`;
}

// ----------------------------------------------------
// CUSTOMERS EXTRACTION
// Derives distinct customers with their metrics
// ----------------------------------------------------
export function extractCustomers(quotations = []) {
  const map = new Map();

  quotations.forEach(q => {
    const cust = q.customer || {};
    const key = (cust.mobile || cust.name || 'unnamed').trim().toLowerCase();
    if (!key) return;

    const existing = map.get(key) || {
      name: cust.name || 'Unnamed Client',
      mobile: cust.mobile || '',
      email: cust.email || '',
      address: cust.address || '',
      projects: new Set(),
      quotationCount: 0,
      totalValue: 0,
      lastQuotationDate: q.date
    };

    if (cust.projectName) existing.projects.add(cust.projectName);
    existing.quotationCount += 1;

    // Calculate quote value
    const totals = calculateQuotationTotals(q.items || [], q.additionalCharges, q.discount);
    existing.totalValue += totals.grandTotal;

    if (!existing.lastQuotationDate || new Date(q.date) > new Date(existing.lastQuotationDate)) {
      existing.lastQuotationDate = q.date;
    }

    // Keep best details
    if (!existing.mobile && cust.mobile) existing.mobile = cust.mobile;
    if (!existing.email && cust.email) existing.email = cust.email;
    if (!existing.address && cust.address) existing.address = cust.address;

    map.set(key, existing);
  });

  return Array.from(map.values()).map(c => ({
    ...c,
    projects: Array.from(c.projects)
  })).sort((a, b) => b.totalValue - a.totalValue);
}

// ----------------------------------------------------
// BACKUP & RESTORE DATA
// ----------------------------------------------------
export function exportAllData() {
  const data = {
    settings: getSettings(),
    quotations: getQuotations(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `billing-quotation-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonData) {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (parsed.settings) saveSettings(parsed.settings);
    if (parsed.quotations && Array.isArray(parsed.quotations)) saveQuotations(parsed.quotations);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

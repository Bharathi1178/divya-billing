import React from 'react';
import StatusBadge from '../components/StatusBadge';
import { 
  calculateQuotationTotals, 
  formatCurrency, 
  numberToWords 
} from '../utils/storage';
import { QUOTATION_STATUSES } from '../data/defaultData';

export default function QuotationView({ 
  quote, 
  settings, 
  onBack, 
  onEdit, 
  onUpdateStatus 
}) {
  if (!quote) {
    return (
      <div className="card empty-state">
        <h3>Quotation Not Found</h3>
        <p>The requested quotation could not be loaded or may have been deleted.</p>
        <button type="button" className="btn btn-primary" onClick={onBack}>
          Back to Quotations
        </button>
      </div>
    );
  }

  // Calculate quotation metrics
  const totals = calculateQuotationTotals(
    quote.items || [], 
    quote.additionalCharges, 
    quote.discount, 
    settings?.profileRate, 
    settings?.glassRate
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="document-view-container">
      {/* Action Toolbar (Hidden during print) */}
      <div className="document-toolbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
            ← Back to List
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Status:</span>
            <select 
              className="form-control"
              style={{ width: 'auto', padding: '4px 24px 4px 8px', fontSize: '13px', fontWeight: 600 }}
              value={quote.status || 'Quotation'}
              onChange={(e) => onUpdateStatus(quote.id, e.target.value)}
            >
              {QUOTATION_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(quote.id)}
          >
            ✏️ Edit Quotation
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handlePrint}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE EXECUTIVE QUOTATION DOCUMENT (A4 Standard)
          ========================================================================= */}
      <div className="quotation-document" id="printable-quotation-area">
        {/* Document Header */}
        <div className="doc-header">
          <div className="doc-company">
            <h2>{settings?.companyName || 'Apex Aluminium & Interior'}</h2>
            <div className="tagline">
              {settings?.tagline || 'Fabrication & Window Solutions'}
            </div>
            <div className="details">
              <div>{settings?.address}</div>
              <div>
                <strong>Phone:</strong> {settings?.phone} 
                {settings?.email && <span> | <strong>Email:</strong> {settings.email}</span>}
              </div>
              {settings?.gstin && (
                <div>
                  <strong>GSTIN:</strong> <span className="cell-mono">{settings.gstin}</span>
                </div>
              )}
            </div>
          </div>

          <div className="doc-meta">
            <div className="doc-badge-title">ESTIMATE / QUOTE</div>
            <table className="doc-meta-table">
              <tbody>
                <tr>
                  <td className="label">Quote No:</td>
                  <td className="val">{quote.quoteNumber || quote.id}</td>
                </tr>
                <tr>
                  <td className="label">Date:</td>
                  <td className="val">{quote.date || '—'}</td>
                </tr>
                <tr>
                  <td className="label">Status:</td>
                  <td>
                    <StatusBadge status={quote.status} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill To & Project Section */}
        <div className="doc-parties">
          <div className="party-box">
            <h4>Billed To (Client Details)</h4>
            <div className="party-name">{quote.customer?.name || 'Walk-in Client'}</div>
            {quote.customer?.mobile && <p><strong>Mobile:</strong> {quote.customer.mobile}</p>}
            {quote.customer?.email && <p><strong>Email:</strong> {quote.customer.email}</p>}
            {quote.customer?.address && <p><strong>Address:</strong> {quote.customer.address}</p>}
          </div>

          <div className="party-box">
            <h4>Project & Site Information</h4>
            <div className="party-name">{quote.customer?.projectName || 'Site Fabrication'}</div>
            {quote.customer?.projectLocation && <p><strong>Location:</strong> {quote.customer.projectLocation}</p>}
            {quote.customer?.notes && <p><strong>Specifications:</strong> {quote.customer.notes}</p>}
            {quote.notes && <p><strong>Special Notes:</strong> {quote.notes}</p>}
          </div>
        </div>

        {/* Window Items Table */}
        <table className="doc-items-table">
          <thead>
            <tr>
              <th style={{ width: '32px' }} className="text-center">#</th>
              <th>Description / Window Item</th>
              <th>Type</th>
              <th className="text-center">Dimensions</th>
              <th className="text-center">Area</th>
              <th className="text-center">Qty</th>
              <th>Breakdown (Profile + Glass + H/W + Lab)</th>
              <th className="text-right">Unit Rate</th>
              <th className="text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {totals.calculatedItems.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="text-center" style={{ fontWeight: 600, color: '#64748b' }}>
                  {idx + 1}
                </td>
                <td>
                  <strong style={{ color: '#0f172a', display: 'block' }}>{item.name}</strong>
                </td>
                <td>
                  <span style={{ fontSize: '11.5px', color: '#475569' }}>{item.type}</span>
                </td>
                <td className="text-center cell-mono">
                  {item.calc.width}' × {item.calc.height}'
                </td>
                <td className="text-center cell-mono">
                  {item.calc.area} sq.ft
                </td>
                <td className="text-center cell-mono" style={{ fontWeight: 700 }}>
                  {item.calc.quantity}
                </td>
                <td style={{ fontSize: '11px', color: '#475569' }}>
                  <span>P: ₹{item.calc.profileCost}</span> | 
                  <span> G: ₹{item.calc.glassCost}</span> | 
                  <span> O: ₹{item.calc.hardwareCost + item.calc.labourCost + item.calc.otherCharges}</span>
                </td>
                <td className="text-right cell-mono">
                  ₹{item.calc.unitCost.toLocaleString('en-IN')}
                </td>
                <td className="text-right cell-mono" style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{item.calc.subtotal.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Amount in Words */}
        <div className="doc-summary-section">
          <div className="amount-words-box">
            <div className="lbl">Amount in Words:</div>
            <div className="words">{numberToWords(totals.grandTotal)}</div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
              Total Area: <strong>{totals.totalArea} sq.ft</strong> across <strong>{totals.totalQuantity} items</strong>.
            </div>
          </div>

          <table className="doc-totals-table">
            <tbody>
              <tr>
                <td className="total-lbl">Subtotal:</td>
                <td className="total-val">{formatCurrency(totals.subtotal)}</td>
              </tr>
              {totals.additionalCharges > 0 && (
                <tr>
                  <td className="total-lbl">{quote.additionalChargesNote || 'Additional Charges'}:</td>
                  <td className="total-val">+{formatCurrency(totals.additionalCharges)}</td>
                </tr>
              )}
              {totals.discount > 0 && (
                <tr>
                  <td className="total-lbl" style={{ color: '#dc2626' }}>Discount:</td>
                  <td className="total-val" style={{ color: '#dc2626' }}>-{formatCurrency(totals.discount)}</td>
                </tr>
              )}
              <tr className="grand-total-row">
                <td className="total-lbl">Grand Total:</td>
                <td className="total-val">{formatCurrency(totals.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer: Terms, Bank Details, and Authorized Signatory */}
        <div className="doc-footer-section">
          <div className="doc-terms">
            <h5>Terms & Conditions</h5>
            <pre>{settings?.terms || '1. 50% advance with work order.\n2. Balance upon completion.'}</pre>

            {(settings?.bankName || settings?.upiId) && (
              <div className="doc-bank-info">
                <strong>Payment Account Details:</strong><br />
                {settings?.bankName && <span>Bank: {settings.bankName} | </span>}
                {settings?.accountNumber && <span>A/C: <span className="cell-mono">{settings.accountNumber}</span> | </span>}
                {settings?.ifscCode && <span>IFSC: <span className="cell-mono">{settings.ifscCode}</span><br /></span>}
                {settings?.upiId && <span>UPI ID: <span className="cell-mono">{settings.upiId}</span></span>}
              </div>
            )}
          </div>

          <div className="doc-signature">
            <div className="sign-label">
              For <strong>{settings?.companyName || 'Apex Aluminium & Interior'}</strong>
            </div>
            <div className="sign-line">
              Authorized Signatory & Seal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import StatusBadge from '../components/StatusBadge';
import { calculateQuotationTotals, formatCurrency } from '../utils/storage';

export default function Dashboard({ 
  quotations = [], 
  settings, 
  onNavigate, 
  onViewQuote, 
  onEditQuote, 
  onPrintQuote 
}) {
  // Calculate dashboard statistics
  const totalQuotations = quotations.length;
  const draftQuotations = quotations.filter(q => (q.status || '').toLowerCase() === 'draft').length;
  const approvedQuotations = quotations.filter(q => (q.status || '').toLowerCase() === 'approved').length;
  const completedQuotations = quotations.filter(q => (q.status || '').toLowerCase() === 'completed').length;
  
  // Total Quotation Value across all non-cancelled quotations
  const totalQuotationValue = quotations
    .filter(q => (q.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, q) => {
      const totals = calculateQuotationTotals(
        q.items || [], 
        q.additionalCharges, 
        q.discount, 
        settings?.profileRate, 
        settings?.glassRate
      );
      return sum + totals.grandTotal;
    }, 0);

  // Recent 5 quotations sorted by date / id desc
  const recentQuotations = [...quotations]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Page Title & Quick Action */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="page-subtitle">
            Welcome to {settings?.companyName || 'Apex Aluminium'}. Here is your quotation overview.
          </p>
        </div>
        <div className="page-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onNavigate('new-quotation')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Create Quotation
          </button>
        </div>
      </div>

      {/* 5 Required Metrics Cards */}
      <div className="stats-grid">
        {/* Total Quotations */}
        <div className="stat-card" style={{ '--card-accent': '#2563eb' }}>
          <div className="stat-info">
            <p>Total Quotations</p>
            <h3>{totalQuotations}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
        </div>

        {/* Draft Quotations */}
        <div className="stat-card" style={{ '--card-accent': '#64748b' }}>
          <div className="stat-info">
            <p>Draft Quotations</p>
            <h3>{draftQuotations}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </div>

        {/* Approved Quotations */}
        <div className="stat-card" style={{ '--card-accent': '#059669' }}>
          <div className="stat-info">
            <p>Approved Quotes</p>
            <h3>{approvedQuotations}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        {/* Completed Quotations */}
        <div className="stat-card" style={{ '--card-accent': '#7c3aed' }}>
          <div className="stat-info">
            <p>Completed Orders</p>
            <h3>{completedQuotations}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </div>

        {/* Total Quotation Value */}
        <div className="stat-card" style={{ '--card-accent': '#0284c7' }}>
          <div className="stat-info">
            <p>Total Pipeline Value</p>
            <h3>{formatCurrency(totalQuotationValue)}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <span style={{ fontWeight: 800, fontSize: '20px' }}>₹</span>
          </div>
        </div>
      </div>

      {/* Quick Rates Banner */}
      <div className="card" style={{ background: 'linear-gradient(to right, #ffffff, #f8fafc)', borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Active Fabrication Rates</h4>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Base rates configured in Settings for automated square-foot calculations.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Profile Rate</span>
              <strong style={{ fontSize: '16px', color: '#1e40af' }}>₹{settings?.profileRate || 175}</strong> / sq.ft
            </div>
            <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Glass Rate</span>
              <strong style={{ fontSize: '16px', color: '#059669' }}>₹{settings?.glassRate || 300}</strong> / sq.ft
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('settings')}
            >
              Edit Rates
            </button>
          </div>
        </div>
      </div>

      {/* Recent Quotations Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Recent Quotations
          </h3>
          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm"
            onClick={() => onNavigate('quotations')}
          >
            View All ({quotations.length})
          </button>
        </div>

        {recentQuotations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Quotations Created Yet</h3>
            <p>Start by creating your first aluminium window quotation for a customer.</p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => onNavigate('new-quotation')}
            >
              + Create First Quotation
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quotation No</th>
                  <th>Date</th>
                  <th>Customer Details</th>
                  <th>Project Name</th>
                  <th>Windows</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((quote) => {
                  const totals = calculateQuotationTotals(
                    quote.items || [], 
                    quote.additionalCharges, 
                    quote.discount, 
                    settings?.profileRate, 
                    settings?.glassRate
                  );

                  return (
                    <tr key={quote.id}>
                      <td className="cell-mono" style={{ color: '#2563eb', fontWeight: 700 }}>
                        {quote.quoteNumber || quote.id}
                      </td>
                      <td>{quote.date || '—'}</td>
                      <td>
                        <strong style={{ color: '#0f172a', display: 'block' }}>
                          {quote.customer?.name || 'Walk-in Client'}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {quote.customer?.mobile || ''}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#334155' }}>
                          {quote.customer?.projectName || 'General Site'}
                        </span>
                      </td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          {totals.itemsCount} windows ({totals.totalArea} sq.ft)
                        </span>
                      </td>
                      <td className="cell-mono" style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                        {formatCurrency(totals.grandTotal)}
                      </td>
                      <td>
                        <StatusBadge status={quote.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            title="View Document"
                            onClick={() => onViewQuote(quote.id)}
                          >
                            View
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            title="Edit Quotation"
                            onClick={() => onEditQuote(quote.id)}
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-primary btn-sm"
                            title="Print Quotation"
                            onClick={() => onPrintQuote(quote.id)}
                          >
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

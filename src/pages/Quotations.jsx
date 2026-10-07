import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { calculateQuotationTotals, formatCurrency } from '../utils/storage';
import { QUOTATION_STATUSES } from '../data/defaultData';

export default function Quotations({ 
  quotations = [], 
  settings, 
  onViewQuote, 
  onEditQuote, 
  onPrintQuote, 
  onDeleteQuote, 
  onUpdateStatus,
  onCreateNew 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and search logic
  const filteredQuotations = quotations.filter((q) => {
    // Status filter
    if (selectedStatus !== 'All' && (q.status || '').toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }

    // Search query matching: Customer name, Quotation number, Mobile number, Project
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      const numMatch = (q.quoteNumber || q.id || '').toLowerCase().includes(qLower);
      const nameMatch = (q.customer?.name || '').toLowerCase().includes(qLower);
      const mobileMatch = (q.customer?.mobile || '').toLowerCase().includes(qLower);
      const projectMatch = (q.customer?.projectName || '').toLowerCase().includes(qLower);
      return numMatch || nameMatch || mobileMatch || projectMatch;
    }

    return true;
  });

  // Sort logic
  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date || 0) - new Date(b.date || 0);
    }
    if (sortBy === 'amount-desc') {
      const totA = calculateQuotationTotals(a.items, a.additionalCharges, a.discount).grandTotal;
      const totB = calculateQuotationTotals(b.items, b.additionalCharges, b.discount).grandTotal;
      return totB - totA;
    }
    return 0;
  });

  const handleDelete = (id, quoteNo) => {
    const ok = window.confirm(`Are you sure you want to delete quotation ${quoteNo}? This action cannot be undone.`);
    if (ok) {
      onDeleteQuote(id);
    }
  };

  return (
    <div className="quotations-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quotations</h2>
          <p className="page-subtitle">
            Manage, search, edit, print, and track all your aluminium window estimates.
          </p>
        </div>
        <div className="page-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Create New Quotation
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Search Input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="Search by customer name, quotation no, mobile or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter Pills */}
        <div className="status-filter-pills">
          <button 
            type="button"
            className={`filter-pill ${selectedStatus === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('All')}
          >
            All ({quotations.length})
          </button>
          {QUOTATION_STATUSES.map(st => {
            const count = quotations.filter(q => (q.status || '').toLowerCase() === st.toLowerCase()).length;
            return (
              <button 
                key={st}
                type="button"
                className={`filter-pill ${selectedStatus === st ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st)}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div>
          <select 
            className="form-control"
            style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: '13px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Quotations List */}
      <div className="card" style={{ padding: 0 }}>
        {sortedQuotations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No Quotations Found</h3>
            <p>
              {searchQuery || selectedStatus !== 'All' 
                ? 'No quotations match your current search or filter criteria.' 
                : 'You have not created any quotations yet.'}
            </p>
            {searchQuery || selectedStatus !== 'All' ? (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('All');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={onCreateNew}
              >
                + Create Quotation
              </button>
            )}
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
                  <th>Items & Area</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedQuotations.map((quote) => {
                  const totals = calculateQuotationTotals(
                    quote.items || [], 
                    quote.additionalCharges, 
                    quote.discount, 
                    settings?.profileRate, 
                    settings?.glassRate
                  );
                  const qNum = quote.quoteNumber || quote.id;

                  return (
                    <tr key={quote.id}>
                      {/* Quotation No */}
                      <td>
                        <span 
                          className="cell-mono" 
                          style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => onViewQuote(quote.id)}
                          title="Click to view quotation document"
                        >
                          {qNum}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {quote.date || '—'}
                      </td>

                      {/* Customer */}
                      <td>
                        <strong style={{ color: '#0f172a', display: 'block' }}>
                          {quote.customer?.name || 'Walk-in Client'}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          {quote.customer?.mobile || ''}
                        </span>
                      </td>

                      {/* Project */}
                      <td>
                        <div style={{ color: '#334155', fontWeight: 500 }}>
                          {quote.customer?.projectName || '—'}
                        </div>
                        {quote.customer?.projectLocation && (
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            {quote.customer.projectLocation}
                          </span>
                        )}
                      </td>

                      {/* Items & Area */}
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          {totals.itemsCount} windows ({totals.totalArea} sq.ft)
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="cell-mono" style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                        {formatCurrency(totals.grandTotal)}
                      </td>

                      {/* Status with quick change option */}
                      <td>
                        <select 
                          className="form-control"
                          style={{ width: 'auto', padding: '4px 24px 4px 8px', fontSize: '12px', fontWeight: 600 }}
                          value={quote.status || 'Quotation'}
                          onChange={(e) => onUpdateStatus(quote.id, e.target.value)}
                        >
                          {QUOTATION_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
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
                            title="Print / Save PDF"
                            onClick={() => onPrintQuote(quote.id)}
                          >
                            Print
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger btn-sm"
                            title="Delete Quotation"
                            onClick={() => handleDelete(quote.id, qNum)}
                          >
                            Delete
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

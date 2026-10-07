import React, { useState } from 'react';
import { extractCustomers, formatCurrency } from '../utils/storage';

export default function Customers({ 
  quotations = [], 
  onCreateQuoteForCustomer,
  onNavigate 
}) {
  const [search, setSearch] = useState('');
  const customers = extractCustomers(quotations);

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.mobile || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.projects && c.projects.some(p => p.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Customers Directory</h2>
          <p className="page-subtitle">
            Client contacts and their projects automatically extracted and synchronized from quotations.
          </p>
        </div>
        <div className="page-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onNavigate('new-quotation')}
          >
            + Create New Quotation
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="Search customers by name, mobile, email or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          Total Clients: <strong>{customers.length}</strong>
        </div>
      </div>

      {/* Customers List Card */}
      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No Customers Found</h3>
            <p>
              {search 
                ? 'No customers match your search query.' 
                : 'Customer profiles will automatically appear here when you create quotations.'}
            </p>
            {search ? (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => onNavigate('new-quotation')}
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
                  <th>Customer Name</th>
                  <th>Contact Details</th>
                  <th>Projects & Sites</th>
                  <th>Address</th>
                  <th>Quotations</th>
                  <th>Total Business Value</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          fontWeight: 700, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}>
                          {(client.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>
                            {client.name}
                          </strong>
                          {client.lastQuotationDate && (
                            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                              Last active: {client.lastQuotationDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                        {client.mobile || '—'}
                      </div>
                      {client.email && (
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {client.email}
                        </div>
                      )}
                    </td>

                    <td>
                      {client.projects && client.projects.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {client.projects.map((proj, pIdx) => (
                            <span 
                              key={pIdx}
                              style={{ 
                                background: '#f1f5f9', 
                                color: '#334155', 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '12px' 
                              }}
                            >
                              {proj}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '12.5px', color: '#475569' }}>
                        {client.address || '—'}
                      </span>
                    </td>

                    <td>
                      <span style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px' 
                      }}>
                        {client.quotationCount} {client.quotationCount === 1 ? 'quote' : 'quotes'}
                      </span>
                    </td>

                    <td className="cell-mono" style={{ fontWeight: 700, fontSize: '14px', color: '#059669' }}>
                      {formatCurrency(client.totalValue)}
                    </td>

                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onCreateQuoteForCustomer(client)}
                        >
                          + New Quote
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

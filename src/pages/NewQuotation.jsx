import React, { useState, useEffect } from 'react';
import { 
  WINDOW_TYPES, 
  QUOTATION_STATUSES, 
  COMMON_WINDOW_NAMES 
} from '../data/defaultData';
import { 
  generateNextQuoteNumber, 
  calculateWindowItem, 
  calculateQuotationTotals, 
  formatCurrency, 
  extractCustomers 
} from '../utils/storage';

export default function NewQuotation({ 
  quotations = [], 
  settings, 
  editingQuoteId = null, 
  initialCustomerData = null,
  onSaveQuote, 
  onCancel,
  onShowToast 
}) {
  const profileRate = settings?.profileRate || 175;
  const glassRate = settings?.glassRate || 300;

  // Existing unique customers for instant selection
  const existingCustomers = extractCustomers(quotations);

  // Form State
  const [quoteNumber, setQuoteNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Quotation');

  // Customer Details State
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    email: '',
    projectName: '',
    projectLocation: '',
    address: '',
    notes: ''
  });

  // Windows Items State
  const [items, setItems] = useState([
    {
      id: 'item-1',
      name: 'Living Room Window',
      type: 'Sliding Window',
      width: 6,
      height: 4,
      quantity: 1,
      profileRate: profileRate,
      glassRate: glassRate,
      hardwareCost: 1000,
      labourCost: 800,
      otherCharges: 0
    }
  ]);

  // Overall Quotation Charges & Notes
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [additionalChargesNote, setAdditionalChargesNote] = useState('Transportation & Handling');
  const [discount, setDiscount] = useState(0);
  const [generalNotes, setGeneralNotes] = useState('');

  // Initialize form when mounting or editing
  useEffect(() => {
    if (editingQuoteId) {
      const existing = quotations.find(q => q.id === editingQuoteId);
      if (existing) {
        setQuoteNumber(existing.quoteNumber || existing.id);
        setDate(existing.date || new Date().toISOString().slice(0, 10));
        setStatus(existing.status || 'Quotation');
        setCustomer({
          name: existing.customer?.name || '',
          mobile: existing.customer?.mobile || '',
          email: existing.customer?.email || '',
          projectName: existing.customer?.projectName || '',
          projectLocation: existing.customer?.projectLocation || '',
          address: existing.customer?.address || '',
          notes: existing.customer?.notes || ''
        });
        setItems(existing.items && existing.items.length > 0 ? existing.items : [
          {
            id: 'item-1',
            name: 'Living Room Window',
            type: 'Sliding Window',
            width: 6,
            height: 4,
            quantity: 1,
            profileRate: profileRate,
            glassRate: glassRate,
            hardwareCost: 1000,
            labourCost: 800,
            otherCharges: 0
          }
        ]);
        setAdditionalCharges(existing.additionalCharges || 0);
        setAdditionalChargesNote(existing.additionalChargesNote || 'Transportation & Handling');
        setDiscount(existing.discount || 0);
        setGeneralNotes(existing.notes || '');
        return;
      }
    }

    // New quotation defaults
    const newNumber = generateNextQuoteNumber(quotations);
    setQuoteNumber(newNumber);
    setDate(new Date().toISOString().slice(0, 10));

    if (initialCustomerData) {
      setCustomer({
        name: initialCustomerData.name || '',
        mobile: initialCustomerData.mobile || '',
        email: initialCustomerData.email || '',
        projectName: (initialCustomerData.projects && initialCustomerData.projects[0]) || '',
        projectLocation: '',
        address: initialCustomerData.address || '',
        notes: ''
      });
    }
  }, [editingQuoteId, quotations]);

  // Handler: Customer selection from previous customers
  const handleSelectCustomer = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) return;
    const found = existingCustomers.find(c => c.name === selectedName);
    if (found) {
      setCustomer({
        ...customer,
        name: found.name,
        mobile: found.mobile || customer.mobile,
        email: found.email || customer.email,
        address: found.address || customer.address,
        projectName: (found.projects && found.projects[0]) || customer.projectName
      });
    }
  };

  // Window Item handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: `Window ${items.length + 1}`,
      type: 'Sliding Window',
      width: 5,
      height: 4,
      quantity: 1,
      profileRate: profileRate,
      glassRate: glassRate,
      hardwareCost: 800,
      labourCost: 600,
      otherCharges: 0
    };
    setItems([...items, newItem]);
  };

  const handleDuplicateItem = (index) => {
    const itemToClone = items[index];
    const cloned = {
      ...itemToClone,
      id: `item-${Date.now()}`,
      name: `${itemToClone.name} (Copy)`
    };
    const updated = [...items];
    updated.splice(index + 1, 0, cloned);
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      alert('Quotation must have at least one window item.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Calculations
  const totals = calculateQuotationTotals(
    items, 
    additionalCharges, 
    discount, 
    profileRate, 
    glassRate
  );

  // Form submission
  const handleSubmit = (actionType = 'save') => {
    if (!customer.name.trim()) {
      alert('Please enter Customer Name.');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one window item.');
      return;
    }

    const quotationData = {
      id: editingQuoteId || quoteNumber,
      quoteNumber,
      date,
      status: actionType === 'draft' ? 'Draft' : status,
      customer: {
        name: customer.name.trim(),
        mobile: customer.mobile.trim(),
        email: customer.email.trim(),
        projectName: customer.projectName.trim(),
        projectLocation: customer.projectLocation.trim(),
        address: customer.address.trim(),
        notes: customer.notes.trim()
      },
      items: items.map(item => ({
        ...item,
        width: parseFloat(item.width) || 0,
        height: parseFloat(item.height) || 0,
        quantity: parseInt(item.quantity, 10) || 1,
        profileRate: parseFloat(item.profileRate) || profileRate,
        glassRate: parseFloat(item.glassRate) || glassRate,
        hardwareCost: parseFloat(item.hardwareCost) || 0,
        labourCost: parseFloat(item.labourCost) || 0,
        otherCharges: parseFloat(item.otherCharges) || 0
      })),
      additionalCharges: parseFloat(additionalCharges) || 0,
      additionalChargesNote: additionalChargesNote.trim(),
      discount: parseFloat(discount) || 0,
      notes: generalNotes.trim(),
      updatedAt: new Date().toISOString()
    };

    onSaveQuote(quotationData, actionType);
  };

  return (
    <div className="new-quotation-page">
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {editingQuoteId ? `Edit Quotation (${quoteNumber})` : 'Create New Quotation'}
          </h2>
          <p className="page-subtitle">
            Enter client information, add window dimensions, and compute live totals.
          </p>
        </div>
        <div className="page-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => handleSubmit('view')}
          >
            Save & View Document
          </button>
        </div>
      </div>

      {/* SECTION 1: Quotation Metadata */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Quotation Details
          </h3>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Base Rates: Profile <strong>₹{profileRate}/sq.ft</strong> | Glass <strong>₹{glassRate}/sq.ft</strong>
          </span>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Quotation Number</label>
            <input 
              type="text" 
              className="form-control cell-mono"
              value={quoteNumber} 
              onChange={(e) => setQuoteNumber(e.target.value)}
              placeholder="e.g. QT-2026-0001"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quotation Date</label>
            <input 
              type="date" 
              className="form-control"
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quotation Status</label>
            <select 
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {QUOTATION_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Customer Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Customer & Site Details
          </h3>

          {existingCustomers.length > 0 && !editingQuoteId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Auto-fill Customer:</span>
              <select 
                className="form-control" 
                style={{ width: 'auto', padding: '6px 28px 6px 10px', fontSize: '13px' }}
                onChange={handleSelectCustomer}
                defaultValue=""
              >
                <option value="">-- Choose Existing Client --</option>
                {existingCustomers.map(c => (
                  <option key={c.name} value={c.name}>{c.name} ({c.mobile || 'No Mobile'})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Arun Kumar"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input 
              type="tel" 
              className="form-control"
              placeholder="e.g. +91 98450 12345"
              value={customer.mobile}
              onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control"
              placeholder="e.g. client@gmail.com"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project / Building Name</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Prestige Lakeview Villa 402"
              value={customer.projectName}
              onChange={(e) => setCustomer({ ...customer, projectName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Location / Site</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Whitefield, Bangalore"
              value={customer.projectLocation}
              onChange={(e) => setCustomer({ ...customer, projectLocation: e.target.value })}
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">Customer Address</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Full billing or site delivery address"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
          </div>

          <div className="form-group col-full">
            <label className="form-label">Client Notes / Specifications</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Powder coated anthracite grey, Saint-Gobain 5mm clear glass"
              value={customer.notes}
              onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Window Items List */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              Window / Fabrication Items ({items.length})
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Add dimensions and costs. Formula: Area = W × H; Profile = Area × {profileRate}; Glass = Area × {glassRate}.
            </p>
          </div>
          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm"
            onClick={handleAddItem}
          >
            + Add Window
          </button>
        </div>

        {/* Windows Loop */}
        <div className="windows-container">
          {items.map((item, index) => {
            const itemCalc = calculateWindowItem(item, profileRate, glassRate);

            return (
              <div key={item.id || index} className="window-item-card">
                {/* Item Header */}
                <div className="window-item-header">
                  <div className="window-item-badge">
                    <span className="window-badge-num">{index + 1}</span>
                    <span>{item.name || `Window #${index + 1}`}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      ({item.type || 'Sliding Window'})
                    </span>
                  </div>

                  <div className="window-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      title="Duplicate this window"
                      onClick={() => handleDuplicateItem(index)}
                    >
                      Duplicate
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm"
                      title="Remove this window"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Window Fields Grid */}
                <div className="form-grid">
                  {/* Window Name & Quick presets */}
                  <div className="form-group col-span-2">
                    <label className="form-label">
                      <span>Window Description / Name *</span>
                      <span className="hint">e.g. Master Bed Window</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="e.g. Living Room Balcony Window"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                      <select 
                        className="form-control" 
                        style={{ width: '160px', flexShrink: 0 }}
                        onChange={(e) => {
                          if (e.target.value) handleItemChange(index, 'name', e.target.value);
                        }}
                        defaultValue=""
                      >
                        <option value="">Presets...</option>
                        {COMMON_WINDOW_NAMES.map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Window Type */}
                  <div className="form-group">
                    <label className="form-label">Window / Profile Type</label>
                    <select 
                      className="form-control"
                      value={item.type || 'Sliding Window'}
                      onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                    >
                      {WINDOW_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Width (ft) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Width (ft) *</span>
                      <span className="hint">in feet</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="form-control cell-mono"
                      value={item.width}
                      onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                      required
                    />
                  </div>

                  {/* Height (ft) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Height (ft) *</span>
                      <span className="hint">in feet</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="form-control cell-mono"
                      value={item.height}
                      onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Quantity *</span>
                      <span className="hint">units</span>
                    </label>
                    <input 
                      type="number" 
                      step="1" 
                      min="1"
                      className="form-control cell-mono"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>

                  {/* Hardware Cost */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Hardware Cost (₹)</span>
                      <span className="hint">Locks, Rollers, Hinges</span>
                    </label>
                    <input 
                      type="number" 
                      step="10" 
                      min="0"
                      className="form-control cell-mono"
                      value={item.hardwareCost}
                      onChange={(e) => handleItemChange(index, 'hardwareCost', e.target.value)}
                    />
                  </div>

                  {/* Labour Cost */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Labour Cost (₹)</span>
                      <span className="hint">Fabrication & Assembly</span>
                    </label>
                    <input 
                      type="number" 
                      step="10" 
                      min="0"
                      className="form-control cell-mono"
                      value={item.labourCost}
                      onChange={(e) => handleItemChange(index, 'labourCost', e.target.value)}
                    />
                  </div>

                  {/* Other Charges */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Other Charges (₹)</span>
                      <span className="hint">Silicon, Packing, etc.</span>
                    </label>
                    <input 
                      type="number" 
                      step="10" 
                      min="0"
                      className="form-control cell-mono"
                      value={item.otherCharges}
                      onChange={(e) => handleItemChange(index, 'otherCharges', e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Transparent Calculation Ribbon */}
                <div className="calc-breakdown-banner">
                  <div className="calc-pill">
                    <span className="calc-pill-label">Window Area</span>
                    <span className="calc-pill-value">{itemCalc.area} sq.ft</span>
                  </div>

                  <div className="calc-pill">
                    <span className="calc-pill-label">Profile Cost ({itemCalc.profileRate}/sq.ft)</span>
                    <span className="calc-pill-value">₹{itemCalc.profileCost}</span>
                  </div>

                  <div className="calc-pill">
                    <span className="calc-pill-label">Glass Cost ({itemCalc.glassRate}/sq.ft)</span>
                    <span className="calc-pill-value">₹{itemCalc.glassCost}</span>
                  </div>

                  <div className="calc-pill">
                    <span className="calc-pill-label">Hardware + Labour</span>
                    <span className="calc-pill-value">₹{itemCalc.hardwareCost + itemCalc.labourCost + itemCalc.otherCharges}</span>
                  </div>

                  <div className="calc-pill">
                    <span className="calc-pill-label">Unit Cost</span>
                    <span className="calc-pill-value">₹{itemCalc.unitCost}</span>
                  </div>

                  <div className="calc-pill calc-pill-total">
                    <span className="calc-pill-label" style={{ color: '#1e40af' }}>
                      Window Subtotal ({itemCalc.quantity} Qty)
                    </span>
                    <span className="calc-pill-value">₹{itemCalc.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Window Button */}
        <div style={{ marginTop: '16px' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            style={{ width: '100%', borderStyle: 'dashed' }}
            onClick={handleAddItem}
          >
            + Add Another Window Item
          </button>
        </div>
      </div>

      {/* SECTION 4: Additional Charges & Grand Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Quotation Summary & Additional Charges
          </h3>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Total Windows: <strong>{totals.totalQuantity} units</strong> ({totals.totalArea} sq.ft)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Left: Additional Charges Inputs */}
          <div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Additional Charges Description</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Transportation, Site Unloading & Scaffolding"
                value={additionalChargesNote}
                onChange={(e) => setAdditionalChargesNote(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                <span>Additional Charges Amount (₹)</span>
                <span className="hint">Added to subtotal</span>
              </label>
              <input 
                type="number" 
                step="50" 
                min="0"
                className="form-control cell-mono"
                value={additionalCharges}
                onChange={(e) => setAdditionalCharges(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                <span>Discount (₹)</span>
                <span className="hint">Optional concession</span>
              </label>
              <input 
                type="number" 
                step="50" 
                min="0"
                className="form-control cell-mono"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Terms / Execution Notes</label>
              <textarea 
                className="form-control"
                rows="3"
                placeholder="e.g. Work will commence 3 days after confirmation. Power supply to be arranged by client."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Right: Grand Total Box */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                Calculation Breakdown
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Windows Subtotal ({items.length} items):</span>
                <span className="cell-mono">{formatCurrency(totals.subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>Total Fabricated Area:</span>
                <span className="cell-mono">{totals.totalArea} sq.ft</span>
              </div>

              {totals.additionalCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>+ {additionalChargesNote || 'Additional Charges'}:</span>
                  <span className="cell-mono">+{formatCurrency(totals.additionalCharges)}</span>
                </div>
              )}

              {totals.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#dc2626' }}>
                  <span>- Special Discount:</span>
                  <span className="cell-mono">-{formatCurrency(totals.discount)}</span>
                </div>
              )}
            </div>

            <div style={{ 
              marginTop: '20px', 
              paddingTop: '16px', 
              borderTop: '2px solid #0f172a',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline' 
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Grand Total
                </span>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                  (Includes all materials & charges)
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e40af', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(totals.grandTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating/Sticky Action Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '12px', 
        marginTop: '24px', 
        padding: '16px 20px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => handleSubmit('draft')}
        >
          Save as Draft
        </button>

        <button 
          type="button" 
          className="btn btn-success"
          onClick={() => handleSubmit('save')}
        >
          Save Quotation
        </button>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => handleSubmit('view')}
        >
          Save & Print Quotation
        </button>
      </div>
    </div>
  );
}

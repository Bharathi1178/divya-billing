import React, { useState } from 'react';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_SAMPLE_QUOTATIONS 
} from '../data/defaultData';
import { 
  exportAllData, 
  importAllData, 
  saveSettings, 
  saveQuotations 
} from '../utils/storage';

export default function Settings({ 
  settings, 
  onSaveSettings, 
  onReloadAllData,
  onShowToast 
}) {
  const [formData, setFormData] = useState({ ...DEFAULT_SETTINGS, ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      profileRate: parseFloat(formData.profileRate) || 175,
      glassRate: parseFloat(formData.glassRate) || 300
    };
    onSaveSettings(updated);
  };

  const handleResetToDefaults = () => {
    const ok = window.confirm(
      'Are you sure you want to reset all data to default initial values? All your custom quotations will be replaced with sample demo quotations.'
    );
    if (ok) {
      saveSettings(DEFAULT_SETTINGS);
      saveQuotations(INITIAL_SAMPLE_QUOTATIONS);
      onReloadAllData();
      setFormData(DEFAULT_SETTINGS);
      onShowToast({ message: 'Reset to sample data successfully!', type: 'success' });
    }
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      alert('Please paste the JSON backup data first.');
      return;
    }
    const success = importAllData(importJsonText);
    if (success) {
      onReloadAllData();
      setShowImportBox(false);
      setImportJsonText('');
      onShowToast({ message: 'Backup restored successfully!', type: 'success' });
    } else {
      alert('Invalid backup JSON format. Please verify the copied data.');
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings & Business Profile</h2>
          <p className="page-subtitle">
            Configure company branding, default fabrication square-foot rates, and document terms.
          </p>
        </div>
        <div className="page-actions">
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* SECTION 1: Default Fabrication Rates */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Default Window Fabrication Rates
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                These rates automatically populate when you create new window items in quotations.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span>Default Profile Rate (₹ per sq.ft) *</span>
                <span className="hint">Standard ₹175/sq.ft</span>
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                className="form-control cell-mono"
                value={formData.profileRate}
                onChange={(e) => handleChange('profileRate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Default Glass Rate (₹ per sq.ft) *</span>
                <span className="hint">Standard ₹300/sq.ft</span>
              </label>
              <input 
                type="number" 
                step="1"
                min="0"
                className="form-control cell-mono"
                value={formData.glassRate}
                onChange={(e) => handleChange('glassRate', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Company Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Company Information (Shown on Printed Quotation)
            </h3>
          </div>

          <div className="form-grid">
            <div className="form-group col-span-2">
              <label className="form-label">Company Name *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Apex Aluminium & Glass Works"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline / Subheading</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Architectural Aluminium, Windows & Glazing"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Mobile / Phone *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Email</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="e.g. contact@apexaluminium.in"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN / Tax Registration</label>
              <input 
                type="text" 
                className="form-control cell-mono"
                placeholder="e.g. 29ABCDE1234F1Z5"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
              />
            </div>

            <div className="form-group col-full">
              <label className="form-label">Company Address *</label>
              <textarea 
                className="form-control"
                rows="2"
                placeholder="Street address, Industrial area, City, State, PIN"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 3: Bank & Payment Info for Quotation Document */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Payment & Bank Details (Printed on Invoices)
            </h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. State Bank of India"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input 
                type="text" 
                className="form-control cell-mono"
                placeholder="e.g. 38920194850"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input 
                type="text" 
                className="form-control cell-mono"
                placeholder="e.g. SBIN0004567"
                value={formData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">UPI ID for Payment</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. apexalu@sbi"
                value={formData.upiId}
                onChange={(e) => handleChange('upiId', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Terms & Conditions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Quotation Terms & Conditions
            </h3>
          </div>

          <div className="form-group">
            <textarea 
              className="form-control"
              rows="6"
              value={formData.terms}
              onChange={(e) => handleChange('terms', e.target.value)}
              placeholder="Enter quotation terms and conditions line by line..."
            ></textarea>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            Save All Settings
          </button>
        </div>
      </form>

      {/* SECTION 5: Data Management & Backup */}
      <div className="card" style={{ borderColor: '#e2e8f0' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Local Data Backup & Recovery
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              All your data is safely kept in browser localStorage. You can export a backup file or restore anytime.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={exportAllData}
          >
            📥 Export Backup (JSON)
          </button>

          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setShowImportBox(!showImportBox)}
          >
            📤 Restore Backup (JSON)
          </button>

          <button 
            type="button" 
            className="btn btn-danger"
            style={{ marginLeft: 'auto' }}
            onClick={handleResetToDefaults}
          >
            ⚠️ Reset to Sample Data
          </button>
        </div>

        {showImportBox && (
          <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
            <label className="form-label">Paste JSON Backup Data below:</label>
            <textarea 
              className="form-control cell-mono"
              rows="5"
              placeholder='Paste exported JSON here...'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
            ></textarea>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleImportSubmit}
              >
                Apply Restore
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowImportBox(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

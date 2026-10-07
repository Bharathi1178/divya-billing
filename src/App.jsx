import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import NewQuotation from './pages/NewQuotation';
import Quotations from './pages/Quotations';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import QuotationView from './pages/QuotationView';
import { 
  getSettings, 
  saveSettings, 
  getQuotations, 
  saveQuotations 
} from './utils/storage';

export default function App() {
  const [settings, setSettingsState] = useState(() => getSettings());
  const [quotations, setQuotationsState] = useState(() => getQuotations());

  // Active page: 'dashboard' | 'new-quotation' | 'quotations' | 'customers' | 'settings' | 'view-quotation'
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [initialCustomerData, setInitialCustomerData] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync hash routing so browser back/forward and direct links work naturally
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'new-quotation', 'quotations', 'customers', 'settings'].includes(hash)) {
        setActivePage(hash);
      } else if (hash.startsWith('view/')) {
        const id = hash.replace('view/', '');
        setSelectedQuoteId(id);
        setActivePage('view-quotation');
      } else if (hash.startsWith('edit/')) {
        const id = hash.replace('edit/', '');
        setSelectedQuoteId(id);
        setActivePage('new-quotation');
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set page and update hash
  const navigateTo = (page, quoteId = null) => {
    setActivePage(page);
    setSelectedQuoteId(quoteId);
    if (page === 'view-quotation' && quoteId) {
      window.location.hash = `view/${quoteId}`;
    } else if (page === 'new-quotation' && quoteId) {
      window.location.hash = `edit/${quoteId}`;
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  // Reload all data
  const handleReloadAll = () => {
    setSettingsState(getSettings());
    setQuotationsState(getQuotations());
  };

  // Save or Update Quotation
  const handleSaveQuote = (quoteData, actionType = 'save') => {
    const existingIndex = quotations.findIndex(q => q.id === quoteData.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...quotations];
      updated[existingIndex] = quoteData;
    } else {
      updated = [quoteData, ...quotations];
    }

    saveQuotations(updated);
    setQuotationsState(updated);

    showToast({ 
      message: `Quotation ${quoteData.quoteNumber || quoteData.id} saved successfully!`, 
      type: 'success' 
    });

    if (actionType === 'view') {
      navigateTo('view-quotation', quoteData.id);
    } else {
      navigateTo('quotations');
    }
  };

  // Delete Quotation
  const handleDeleteQuote = (id) => {
    const updated = quotations.filter(q => q.id !== id);
    saveQuotations(updated);
    setQuotationsState(updated);
    showToast({ message: 'Quotation deleted successfully.', type: 'success' });
  };

  // Quick Status Update
  const handleUpdateStatus = (id, newStatus) => {
    const updated = quotations.map(q => {
      if (q.id === id) {
        return { ...q, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return q;
    });
    saveQuotations(updated);
    setQuotationsState(updated);
    showToast({ message: `Quotation status updated to "${newStatus}".`, type: 'success' });
  };

  // Save Settings
  const handleSaveSettings = (newSettings) => {
    saveSettings(newSettings);
    setSettingsState(newSettings);
    showToast({ message: 'Business settings saved successfully!', type: 'success' });
  };

  // View, Edit, Print actions
  const handleViewQuote = (id) => {
    navigateTo('view-quotation', id);
  };

  const handleEditQuote = (id) => {
    navigateTo('new-quotation', id);
  };

  const handlePrintQuote = (id) => {
    navigateTo('view-quotation', id);
    setTimeout(() => {
      window.print();
    }, 350);
  };

  const handleCreateNew = () => {
    setInitialCustomerData(null);
    navigateTo('new-quotation', null);
  };

  const handleCreateQuoteForCustomer = (cust) => {
    setInitialCustomerData(cust);
    navigateTo('new-quotation', null);
  };

  // Selected quote for view page
  const currentQuote = quotations.find(q => q.id === selectedQuoteId);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => navigateTo(page, null)} 
        onCreateNew={handleCreateNew}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === 'dashboard' && (
          <Dashboard 
            quotations={quotations}
            settings={settings}
            onNavigate={(page) => navigateTo(page, null)}
            onViewQuote={handleViewQuote}
            onEditQuote={handleEditQuote}
            onPrintQuote={handlePrintQuote}
          />
        )}

        {activePage === 'new-quotation' && (
          <NewQuotation 
            quotations={quotations}
            settings={settings}
            editingQuoteId={selectedQuoteId}
            initialCustomerData={initialCustomerData}
            onSaveQuote={handleSaveQuote}
            onCancel={() => navigateTo('quotations')}
            onShowToast={showToast}
          />
        )}

        {activePage === 'quotations' && (
          <Quotations 
            quotations={quotations}
            settings={settings}
            onViewQuote={handleViewQuote}
            onEditQuote={handleEditQuote}
            onPrintQuote={handlePrintQuote}
            onDeleteQuote={handleDeleteQuote}
            onUpdateStatus={handleUpdateStatus}
            onCreateNew={handleCreateNew}
          />
        )}

        {activePage === 'customers' && (
          <Customers 
            quotations={quotations}
            onCreateQuoteForCustomer={handleCreateQuoteForCustomer}
            onNavigate={(page) => navigateTo(page, null)}
          />
        )}

        {activePage === 'settings' && (
          <Settings 
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onReloadAllData={handleReloadAll}
            onShowToast={showToast}
          />
        )}

        {activePage === 'view-quotation' && (
          <QuotationView 
            quote={currentQuote}
            settings={settings}
            onBack={() => navigateTo('quotations')}
            onEdit={handleEditQuote}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

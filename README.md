# Apex Aluminium & Window Billing / Quotation Web App

A clean, fast, professional, and deployment-friendly Billing and Quotation Web Application designed specifically for Aluminium Fabrication, UPVC, Glass, and Interior Window businesses.

Built with **React + Vite + Vanilla CSS + localStorage**. No backend server, no database installation, no authentication, and zero deployment complexity.

---

## 🌟 Key Features

1. **Executive Dashboard**:
   - Total Quotations, Drafts, Approved Quotes, and Completed Orders.
   - Total Pipeline Value calculation.
   - Active fabrication rates display.
   - Recent Quotations list with quick actions.

2. **Quotation Creation & Transparent Calculation**:
   - Automatic Quotation Numbering (`QT-2026-0001`, `QT-2026-0002`...).
   - Complete client & site location details.
   - Multiple window items with instant square-foot area calculation:
     - $\text{Area} = \text{Width} \times \text{Height}$ (sq.ft)
     - $\text{Profile Cost} = \text{Area} \times \text{Profile Rate}$ (Default ₹175/sq.ft)
     - $\text{Glass Cost} = \text{Area} \times \text{Glass Rate}$ (Default ₹300/sq.ft)
     - $\text{Hardware Cost}$ + $\text{Labour Cost}$ + $\text{Other Charges}$
     - $\text{Window Subtotal} = \text{Unit Cost} \times \text{Quantity}$
   - Additional charges (transportation, loading, installation) & optional discount.
   - Live grand total computation in Indian currency (`₹`).

3. **Quotations Management**:
   - Complete table view of all saved quotations.
   - Search by customer name, quotation number, mobile number, or project.
   - Status filtering: **All, Draft, Quotation, Approved, Completed, Cancelled**.
   - Sort by Newest, Oldest, or Highest Amount.
   - Quick actions: View, Edit, Print, Duplicate, and Delete.

4. **Executive Print / Save as PDF**:
   - Standard A4 document format.
   - Company branding, client details, detailed item breakdown, terms & conditions, bank/UPI payment details, and authorized signature section.
   - Automatic **Amount in Words** generator in Indian numbering format (e.g. *Rupees Thirty-Two Thousand Five Hundred Only*).
   - Dedicated `@media print` CSS: only the invoice document prints cleanly, hiding all UI toolbars, buttons, and navbars. Choose **"Save as PDF"** in your browser's print dialog.

5. **Customers Directory**:
   - Automatically synchronizes clients from created quotations.
   - Tracks client projects, quote count, and total billed value.
   - One-click "+ New Quote" for existing clients.

6. **Settings & Customization**:
   - Editable Company Name, Address, Mobile, Email, and GSTIN.
   - Default Profile Rate and Glass Rate customization.
   - Bank details and UPI ID for invoices.
   - Terms & conditions editor.
   - Local data backup (Export JSON / Import JSON) and Reset to Sample Data.

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18, v20, or higher).

### 1. Installation
Clone or navigate into the project directory:
```bash
cd "c:\Users\Harish\OneDrive\Desktop\Quatation & Billing"
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### 3. Build for Production
To generate the optimized static production bundle:
```bash
npm run build
```
The output files will be created in the `dist/` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```

---

## 📁 Project Structure

```
Quatation & Billing/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Sticky navigation with mobile drawer & shortcuts
│   │   ├── StatusBadge.jsx    # Status indicators (Draft, Approved, Completed, etc.)
│   │   └── Toast.jsx          # Notification toasts
│   │
│   ├── data/
│   │   └── defaultData.js     # Default settings, window types, seed quotations
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx      # Metrics overview & recent quotations
│   │   ├── NewQuotation.jsx   # Create/Edit quotation form with live calculation
│   │   ├── Quotations.jsx     # Searchable, filterable list of all quotes
│   │   ├── Customers.jsx      # Customer directory with aggregated project stats
│   │   ├── Settings.jsx       # Company profile, default rates & data backups
│   │   └── QuotationView.jsx  # Printable A4 executive quotation document
│   │
│   ├── utils/
│   │   └── storage.js         # localStorage helpers, math calculations, number-to-words
│   │
│   ├── App.jsx                # Main application state & hash routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Clean, modern design system and @media print CSS
│
├── public/                    # Static assets
├── .gitignore                 # Standard clean gitignore
├── package.json               # Lightweight dependencies (React + Vite)
├── index.html                 # Main HTML with Inter Google Font
├── vite.config.js             # Standard Vite config
└── README.md                  # Documentation and deployment guide
```

---

## 🚢 Deploying to Vercel (Step-by-Step)

Because this application is a 100% frontend React application using localStorage, it deploys to Vercel in seconds with **zero configuration** and **zero server costs**.

### Method 1: Deploy via GitHub (Recommended)

#### Step 1: Initialize Git and Commit Your Code
Open PowerShell or Terminal in your project folder:
```bash
git init
git add .
git commit -m "Initial commit: Aluminium Window Billing & Quotation App"
```

#### Step 2: Push to GitHub
1. Go to [github.com](https://github.com) and create a **New Repository** (e.g. `billing-quotation`).
2. Do **not** initialize with README or .gitignore (we already have them).
3. In your terminal, run:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/billing-quotation.git
git push -u origin main
```

#### Step 3: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Import your `billing-quotation` repository.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. In ~30 seconds, Vercel gives you your live public URL (e.g., `https://billing-quotation.vercel.app`)!

---

### Method 2: Deploy directly with Vercel CLI (Optional)
If you have Vercel CLI installed:
```bash
npm i -g vercel
vercel
```
Follow the short interactive prompts to get an instant live link.

// Default Configuration & Seed Data for Billing / Quotation Application

export const DEFAULT_SETTINGS = {
  companyName: "Apex Aluminium & Interior Solutions",
  tagline: "Premium Aluminium Fabrication, Windows, Doors & Architectural Glazing",
  address: "#42, 4th Cross, Peenya Industrial Area, Bangalore, Karnataka - 560058",
  phone: "+91 98765 43210",
  email: "contact@apexaluminium.in",
  gstin: "29ABCDE1234F1Z5",
  profileRate: 175, // Default ₹175 per sq.ft
  glassRate: 300,   // Default ₹300 per sq.ft
  bankName: "State Bank of India",
  accountNumber: "38920194850",
  ifscCode: "SBIN0004567",
  upiId: "apexalu@sbi",
  terms: `1. 50% advance along with confirmed work order.
2. 40% payment on delivery of fabricated materials at site.
3. Balance 10% payment upon completion of installation.
4. Quotation is valid for 15 days from the date of issue.
5. Civil alterations, scaffolding & power supply at site to be provided by client.
6. Glass breakage or damages after handover are not covered under warranty.`
};

export const WINDOW_TYPES = [
  "Sliding Window",
  "Openable Window",
  "Fixed Window",
  "Door",
  "Other"
];

export const QUOTATION_STATUSES = [
  "Draft",
  "Quotation",
  "Approved",
  "Completed",
  "Cancelled"
];

export const COMMON_WINDOW_NAMES = [
  "Living Room Window",
  "Master Bedroom Window",
  "Guest Bedroom Window",
  "Kitchen Window",
  "Balcony Sliding Door",
  "Kitchen Utility Window",
  "Bathroom Ventilator",
  "Office Cabin Partition",
  "Staircase Fixed Glazing",
  "Main Entrance Door"
];

export const INITIAL_SAMPLE_QUOTATIONS = [
  {
    id: "QT-2026-0001",
    quoteNumber: "QT-2026-0001",
    date: "2026-03-28",
    status: "Approved",
    customer: {
      name: "Arun Kumar",
      mobile: "+91 98450 12345",
      email: "arun.kumar@gmail.com",
      projectName: "Prestige Lakeview Villa 402",
      projectLocation: "Whitefield, Bangalore",
      address: "Villa 402, Prestige Lakeview, ECC Road, Whitefield",
      notes: "Heavy duty 3-track sliding series with SS fly mesh."
    },
    items: [
      {
        id: "w-1",
        name: "Living Room Balcony Window",
        type: "Sliding Window",
        width: 7.5,
        height: 6.0,
        quantity: 2,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 1800,
        labourCost: 1200,
        otherCharges: 500
      },
      {
        id: "w-2",
        name: "Master Bedroom Window",
        type: "Openable Window",
        width: 5.0,
        height: 4.5,
        quantity: 2,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 1400,
        labourCost: 900,
        otherCharges: 300
      },
      {
        id: "w-3",
        name: "Kitchen Utility Ventilator",
        type: "Fixed Window",
        width: 3.0,
        height: 2.5,
        quantity: 1,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 600,
        labourCost: 500,
        otherCharges: 200
      }
    ],
    additionalCharges: 2500,
    additionalChargesNote: "Transportation & Loading",
    discount: 1500,
    notes: "Delivery in 10 working days after advance confirmation."
  },
  {
    id: "QT-2026-0002",
    quoteNumber: "QT-2026-0002",
    date: "2026-04-02",
    status: "Quotation",
    customer: {
      name: "Priya Venkat",
      mobile: "+91 97412 88990",
      email: "priya.v@outlook.com",
      projectName: "Sobha City Apt 12B",
      projectLocation: "Thanisandra Main Rd, Bangalore",
      address: "Tower 3, Flat 12B, Sobha City",
      notes: "Champagne bronze anodized finish required."
    },
    items: [
      {
        id: "w-4",
        name: "Main Hall French Door",
        type: "Door",
        width: 6.0,
        height: 7.5,
        quantity: 1,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 2400,
        labourCost: 1600,
        otherCharges: 600
      },
      {
        id: "w-5",
        name: "Guest Bedroom Sliding",
        type: "Sliding Window",
        width: 4.5,
        height: 4.0,
        quantity: 2,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 1100,
        labourCost: 800,
        otherCharges: 0
      }
    ],
    additionalCharges: 1800,
    additionalChargesNote: "Site Delivery & Unloading",
    discount: 0,
    notes: "Site measurement verified on 2nd April."
  },
  {
    id: "QT-2026-0003",
    quoteNumber: "QT-2026-0003",
    date: "2026-04-05",
    status: "Draft",
    customer: {
      name: "Vijay Interior Studios",
      mobile: "+91 99001 55442",
      email: "projects@vijaystudios.in",
      projectName: "Tech Park Office Suite 300",
      projectLocation: "Electronic City Phase 1",
      address: "Plot 18, Electronic City Phase 1",
      notes: "12mm Toughened Glass partition with black slim profile."
    },
    items: [
      {
        id: "w-6",
        name: "Conference Room Glass Partition",
        type: "Fixed Window",
        width: 10.0,
        height: 8.0,
        quantity: 2,
        profileRate: 175,
        glassRate: 300,
        hardwareCost: 3500,
        labourCost: 3000,
        otherCharges: 1000
      }
    ],
    additionalCharges: 3000,
    additionalChargesNote: "Heavy Glass Crane Handling & Crane Charge",
    discount: 2000,
    notes: "Work to be executed over the weekend."
  }
];

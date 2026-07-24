import {
  Person,
  LifeTask,
  LifeSharedFinance,
  InsurancePolicy,
  LifeDocument,
  ImportantDate,
  LifeEvent,
  LifeAsset
} from '../types';

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'p-1',
    fullName: 'Eleanor Vance',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    gender: 'Female',
    dateOfBirth: '1962-08-14',
    relationship: 'Mother',
    category: 'Immediate Family',
    phone: '+1 (555) 234-5678',
    email: 'eleanor.vance@family.org',
    address: '742 Evergreen Terrace, Springfield',
    country: 'United States',
    occupation: 'Retired Teacher',
    notes: 'Allergic to penicillin. Prefers morning phone calls. Enjoys gardening.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-2',
    fullName: 'Robert Vance',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    gender: 'Male',
    dateOfBirth: '1959-11-20',
    relationship: 'Father',
    category: 'Immediate Family',
    phone: '+1 (555) 345-6789',
    email: 'robert.vance@family.org',
    address: '742 Evergreen Terrace, Springfield',
    country: 'United States',
    occupation: 'Civil Engineer (Consultant)',
    notes: 'Regular cardiological checkup every 6 months. Loves woodworking.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-3',
    fullName: 'Sophia Vance',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    gender: 'Female',
    dateOfBirth: '1995-04-12',
    relationship: 'Wife',
    category: 'Immediate Family',
    phone: '+1 (555) 876-5432',
    email: 'sophia.vance@designstudio.com',
    address: '100 Innovation Way, Apt 4B, San Francisco',
    country: 'United States',
    occupation: 'Senior UX Architect',
    notes: 'Joint account holder for Family Emergency Savings. Passport renewal in 2028.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-4',
    fullName: 'Leo Vance',
    photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=200',
    gender: 'Male',
    dateOfBirth: '2021-09-05',
    relationship: 'Son',
    category: 'Immediate Family',
    phone: '',
    email: '',
    address: '100 Innovation Way, Apt 4B, San Francisco',
    country: 'United States',
    occupation: 'Toddler',
    notes: 'Pediatric vaccinations up to date. Enjoys swimming and LEGOs.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-5',
    fullName: 'Lucas Vance',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    gender: 'Male',
    dateOfBirth: '1992-03-25',
    relationship: 'Brother',
    category: 'Immediate Family',
    phone: '+1 (555) 654-3210',
    email: 'lucas.vance@techcorp.io',
    address: '320 Market St, Seattle, WA',
    country: 'United States',
    occupation: 'Software Lead',
    notes: 'Co-investor in Family Vacation Cottage.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-6',
    fullName: 'Clara Vance',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    gender: 'Female',
    dateOfBirth: '1998-10-02',
    relationship: 'Sister',
    category: 'Immediate Family',
    phone: '+1 (555) 987-1234',
    email: 'clara.vance@university.edu',
    address: '88 College Ave, Boston, MA',
    country: 'United States',
    occupation: 'Medical Resident',
    notes: 'Receives monthly education stipend support.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'p-7',
    fullName: 'Arthur Vance',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    gender: 'Male',
    dateOfBirth: '1938-01-15',
    relationship: 'Grandfather',
    category: 'Extended Family',
    phone: '+1 (555) 111-2233',
    email: '',
    address: 'Sunrise Senior Care, Room 12, Chicago, IL',
    country: 'United States',
    occupation: 'Retired Veteran',
    notes: 'WWII history enthusiast. Checkup arranged by Father.',
    createdAt: '2026-01-10T10:00:00.000Z'
  }
];

export const INITIAL_TASKS: LifeTask[] = [
  {
    id: 't-1',
    title: "Pay Mother's Annual Health Insurance Premium",
    description: "Submit BlueCross premium renewal payment before due date to keep coverage active.",
    personIds: ['p-1'],
    category: 'Insurance',
    dueDate: '2026-07-28',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-07-01T08:00:00.000Z'
  },
  {
    id: 't-2',
    title: "Arrange Father's Cardiology Checkup",
    description: "Book appointment with Dr. Harrison at City Hospital for semi-annual heart checkup.",
    personIds: ['p-2'],
    category: 'Medical',
    dueDate: '2026-08-05',
    priority: 'Medium',
    status: 'Pending',
    createdAt: '2026-07-10T10:00:00.000Z'
  },
  {
    id: 't-3',
    title: 'Plan Family Summer Vacation in Hawaii',
    description: "Book flights, resort accommodation, and rental car for whole family.",
    personIds: ['p-3', 'p-4', 'p-1', 'p-2'],
    category: 'Family',
    dueDate: '2026-08-15',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-07-12T14:00:00.000Z'
  },
  {
    id: 't-4',
    title: "Transfer Sister's Monthly Education Support",
    description: "Send $800 monthly living expense allowance for residence in Boston.",
    personIds: ['p-6'],
    category: 'Financial',
    dueDate: '2026-08-01',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-07-15T09:00:00.000Z'
  },
  {
    id: 't-5',
    title: "Renew Son's Passport & Visa Documents",
    description: "Take passport photos for Leo and submit application at San Francisco Passport Agency.",
    personIds: ['p-4'],
    category: 'Personal',
    dueDate: '2026-09-10',
    priority: 'Low',
    status: 'Pending',
    createdAt: '2026-07-18T11:00:00.000Z'
  }
];

export const INITIAL_SHARED_FINANCE: LifeSharedFinance[] = [
  {
    id: 'sf-1',
    title: 'Family Emergency Savings Fund',
    type: 'Joint Savings',
    memberIds: ['p-3'], // Me + Wife
    totalAmount: 45000,
    yourContribution: 25000,
    currentBalance: 45000,
    note: 'High-yield savings account allocated for emergency medical or family needs.',
    updatedAt: '2026-07-20T12:00:00.000Z'
  },
  {
    id: 'sf-2',
    title: "Parents' Monthly Living Support",
    type: 'Family Support',
    memberIds: ['p-1', 'p-2'], // Mother & Father
    totalAmount: 2500,
    yourContribution: 1800,
    currentBalance: 2500,
    note: 'Monthly allowance for groceries, utilities, and prescription medicines.',
    updatedAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'sf-3',
    title: 'Lake Tahoe Family Vacation Cottage',
    type: 'Shared Asset',
    memberIds: ['p-5'], // Shared with Brother Lucas
    totalAmount: 320000,
    yourContribution: 160000,
    currentBalance: 320000,
    note: '50-50 joint property ownership with Brother Lucas.',
    updatedAt: '2026-06-15T09:00:00.000Z'
  },
  {
    id: 'sf-4',
    title: "Sister's Medical School Allowance",
    type: 'Family Support',
    memberIds: ['p-6'],
    totalAmount: 800,
    yourContribution: 800,
    currentBalance: 800,
    note: 'Monthly stipend paid on the 1st of every month.',
    updatedAt: '2026-07-01T08:00:00.000Z'
  }
];

export const INITIAL_INSURANCE: InsurancePolicy[] = [
  {
    id: 'ins-1',
    policyName: 'Senior Health Protect Care Plus',
    company: 'BlueCross BlueShield',
    policyNumber: 'BCBS-889210-M',
    policyType: 'Health',
    insuredPersonId: 'p-1', // Mother
    beneficiaryPersonId: 'p-2', // Father
    premiumAmount: 420,
    paymentFrequency: 'Monthly',
    startDate: '2024-08-01',
    expiryDate: '2026-07-31',
    nextPaymentDate: '2026-07-28',
    status: 'Expiring Soon',
    notes: 'Comprehensive hospital coverage with zero deductible on wellness visits.'
  },
  {
    id: 'ins-2',
    policyName: 'Family Term Life Protection ($1M)',
    company: 'Northwestern Mutual',
    policyNumber: 'NW-990124-L',
    policyType: 'Life',
    insuredPersonId: 'p-3', // Wife
    beneficiaryPersonId: 'p-4', // Son
    premiumAmount: 1800,
    paymentFrequency: 'Annually',
    startDate: '2023-11-15',
    expiryDate: '2043-11-15',
    nextPaymentDate: '2026-11-15',
    status: 'Active',
    notes: '20-year level term policy guaranteeing child education security.'
  },
  {
    id: 'ins-3',
    policyName: 'Comprehensive Auto Shield (Tesla Model Y)',
    company: 'GEICO Premier',
    policyNumber: 'GCO-441209-A',
    policyType: 'Car',
    insuredPersonId: 'p-3',
    beneficiaryPersonId: 'p-3',
    premiumAmount: 140,
    paymentFrequency: 'Monthly',
    startDate: '2025-02-10',
    expiryDate: '2027-02-10',
    nextPaymentDate: '2026-08-10',
    status: 'Active',
    notes: '$500 deductible with roadside assistance included.'
  },
  {
    id: 'ins-4',
    policyName: 'Primary Residence Homeowners Insurance',
    company: 'State Farm Insurance',
    policyNumber: 'SF-771239-P',
    policyType: 'Property',
    insuredPersonId: 'p-3',
    beneficiaryPersonId: 'p-3',
    premiumAmount: 1250,
    paymentFrequency: 'Annually',
    startDate: '2024-05-01',
    expiryDate: '2027-05-01',
    nextPaymentDate: '2027-05-01',
    status: 'Active',
    notes: 'Covers San Francisco property against fire, water damage, and liability.'
  }
];

export const INITIAL_DOCUMENTS: LifeDocument[] = [
  {
    id: 'doc-1',
    title: "Mother's US Passport",
    docType: 'Passport',
    ownerPersonId: 'p-1',
    issueDate: '2019-03-10',
    expiryDate: '2029-03-10',
    notes: 'Stored in Home Safe #1. Certified copy backed up digitally.'
  },
  {
    id: 'doc-2',
    title: "Wife's Marriage Certificate",
    docType: 'Marriage Certificate',
    ownerPersonId: 'p-3',
    relatedPersonIds: ['p-3'],
    issueDate: '2020-06-20',
    notes: 'Official San Francisco County registrar seal.'
  },
  {
    id: 'doc-3',
    title: "Son Leo's Birth Certificate",
    docType: 'Birth Certificate',
    ownerPersonId: 'p-4',
    issueDate: '2021-09-08',
    notes: 'Pediatric records attached.'
  },
  {
    id: 'doc-4',
    title: 'BlueCross Health Policy Agreement',
    docType: 'Insurance Policy',
    ownerPersonId: 'p-1',
    issueDate: '2024-08-01',
    expiryDate: '2026-07-31',
    notes: 'Digital copy of full medical policy terms.'
  },
  {
    id: 'doc-5',
    title: 'Lake Tahoe Cottage Deed of Title',
    docType: 'Property Document',
    ownerPersonId: 'p-5',
    relatedPersonIds: ['p-5'],
    issueDate: '2022-04-15',
    notes: 'Joint tenancy with right of survivorship.'
  }
];

export const INITIAL_IMPORTANT_DATES: ImportantDate[] = [
  {
    id: 'id-1',
    title: "Mother's 64th Birthday",
    date: '2026-08-14',
    type: 'Birthday',
    personId: 'p-1',
    reminderDaysBefore: 7,
    notes: 'Order fresh floral bouquet and arrange family dinner.'
  },
  {
    id: 'id-2',
    title: 'Wedding Anniversary with Sophia',
    date: '2026-06-20',
    type: 'Anniversary',
    personId: 'p-3',
    reminderDaysBefore: 14,
    notes: 'Book weekend getaway in Napa Valley.'
  },
  {
    id: 'id-3',
    title: "Son Leo's 5th Birthday Party",
    date: '2026-09-05',
    type: 'Birthday',
    personId: 'p-4',
    reminderDaysBefore: 10,
    notes: 'Superhero theme party with kindergarten friends.'
  },
  {
    id: 'id-4',
    title: "Father's Birthday",
    date: '2026-11-20',
    type: 'Birthday',
    personId: 'p-2',
    reminderDaysBefore: 5,
    notes: 'Gift suggestion: Custom woodworking tool set.'
  },
  {
    id: 'id-5',
    title: "Mother's Health Insurance Renewal Deadline",
    date: '2026-07-31',
    type: 'Renewal',
    personId: 'p-1',
    reminderDaysBefore: 3,
    notes: 'Critical deadline to prevent gap in coverage.'
  }
];

export const INITIAL_LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'le-1',
    title: 'Married Sophia in Carmel-by-the-Sea',
    date: '2020-06-20',
    description: 'Beautiful seaside ceremony attended by close family and friends.',
    category: 'Marriage',
    personIds: ['p-3', 'p-1', 'p-2', 'p-5', 'p-6'],
    location: 'Carmel-by-the-Sea, CA',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'le-2',
    title: 'Birth of Son Leo Vance',
    date: '2021-09-05',
    description: 'Our precious boy Leo was born at UCSF Medical Center weighing 7 lbs 8 oz.',
    category: 'Children',
    personIds: ['p-3', 'p-4', 'p-1', 'p-2'],
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'le-3',
    title: 'Purchased Lake Tahoe Vacation Cottage',
    date: '2022-04-15',
    description: 'Acquired mountain cabin together with Brother Lucas for family retreats.',
    category: 'Property',
    personIds: ['p-5'],
    location: 'Lake Tahoe, CA',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'le-4',
    title: "Sister Clara Started Medical Residency at Harvard",
    date: '2025-07-01',
    description: 'Clara matched at Brigham and Women Hospital in Boston for internal medicine.',
    category: 'Achievement',
    personIds: ['p-6', 'p-1', 'p-2'],
    location: 'Boston, MA',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_LIFE_ASSETS: LifeAsset[] = [
  {
    id: 'ast-1',
    assetName: 'San Francisco Primary Residence (Apt 4B)',
    type: 'House',
    value: 1250000,
    ownerIds: ['p-3'], // Me + Wife
    purchaseDate: '2021-02-14',
    notes: '3-bedroom condo in SOMA district with terrace.'
  },
  {
    id: 'ast-2',
    assetName: 'Lake Tahoe Mountain Vacation Cottage',
    type: 'House',
    value: 640000,
    ownerIds: ['p-5'], // Me + Brother
    purchaseDate: '2022-04-15',
    notes: 'Co-owned 50% with Brother Lucas Vance.'
  },
  {
    id: 'ast-3',
    assetName: '2024 Tesla Model Y Long Range',
    type: 'Vehicle',
    value: 42000,
    ownerIds: ['p-3'],
    purchaseDate: '2024-03-10',
    notes: 'Primary family vehicle.'
  }
];

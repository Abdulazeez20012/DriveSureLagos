
export enum UserRole {
  Driver = 'driver',
  Officer = 'officer',
}

export enum Language {
  EN = 'en',
  YOR = 'yor',
}

export enum Screen {
  Dashboard = 'dashboard',
  Booking = 'booking',
  Documents = 'documents',
  Profile = 'profile',
  Traffic = 'traffic',
  Fines = 'fines',
}

export enum DocumentStatus {
  Valid = 'Valid',
  ExpiringSoon = 'Expiring Soon',
  Expired = 'Expired',
  Missing = 'Missing',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Document {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  status: DocumentStatus;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin: string;
}

export interface UserProfile {
  name: string;
  driverId: string;
  phone: string;
  email: string;
  vehicle: Vehicle;
}

export interface Inspection {
  id:string;
  date: string;
  center: string;
  status: 'Passed' | 'Failed' | 'Pending';
  expiry: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface InspectionCenter {
  id: string;
  name: string;
  address: string;
}

export interface Fine {
    id: string;
    violation: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Unpaid';
}

export interface TrafficReport {
    id: string;
    route: string;
    status: 'Heavy' | 'Moderate' | 'Light';
    lastUpdated: string;
}

export interface UserData {
    profile: UserProfile;
    documents: Document[];
    inspections: Inspection[];
    notifications: Notification[];
    fines: Fine[];
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
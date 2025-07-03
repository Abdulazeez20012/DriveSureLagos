
import { Language, Translations } from './types';

export const translations: Translations = {
  // App Shell
  appTitle: { en: 'DriveSure Lagos', yor: 'DriveSure Eko' },
  driver: { en: 'Driver', yor: 'Awako' },
  officer: { en: 'Officer', yor: 'Dógún-Dógún' },
  online: { en: 'Online', yor: 'Lori Ayelujara' },
  offline: { en: 'Offline', yor: 'Pàápa Ayelujara' },

  // Auth Screen
  loginTitle: { en: 'Welcome Back', yor: 'Kaabọ Pada' },
  loginSubtitle: { en: 'Sign in to access your dashboard', yor: 'Wọle lati wọle si dashboard rẹ' },
  registerTitle: { en: 'Create Account', yor: 'Ṣẹda Akanti' },
  registerSubtitle: { en: 'Get started with DriveSure Lagos', yor: 'Bẹrẹ pẹlu DriveSure Eko' },
  email: { en: 'Email', yor: 'Imeeli' },
  password: { en: 'Password', yor: 'Ọrọigbaniwọle' },
  fullName: { en: 'Full Name', yor: 'Orukọ Kikun' },
  role: { en: 'I am a...', yor: 'Mo jẹ...' },
  login: { en: 'Login', yor: 'Wọle' },
  register: { en: 'Register', yor: 'Forukọsilẹ' },
  goToRegister: { en: "Don't have an account?", yor: 'Ṣe o ko ni akanti bi?' },
  goToLogin: { en: 'Already have an account?', yor: 'Ṣe o ti ni akanti tẹlẹ?' },
  loginError: { en: 'Invalid email or password.', yor: 'Imeeli tabi ọrọigbaniwọle ti ko tọ.' },
  registerError: { en: 'User with this email already exists.', yor: 'Olumulo pẹlu imeeli yii ti wa tẹlẹ.' },
  registering: { en: 'Registering...', yor: 'Nforukọsilẹ...' },
  loggingIn: { en: 'Logging in...', yor: 'N wọle...' },

  // Bottom Nav
  navDashboard: { en: 'Dashboard', yor: 'Ibi Iwaju' },
  navBooking: { en: 'Book', yor: 'Ṣe Iforukọsilẹ' },
  navDocuments: { en: 'Docs', yor: 'Àwọn ìwé' },
  navProfile: { en: 'Profile', yor: 'Àkọọ́lẹ̀' },
  navTraffic: { en: 'Traffic', yor: 'Ìjábọ́' },
  navFines: { en: 'Fines', yor: 'Ìtanràn' },

  // Driver Dashboard
  roadworthinessCertificate: { en: 'Roadworthiness Certificate', yor: 'Iwe-ẹri Yiyẹ Oju-ọna' },
  status: { en: 'Status', yor: 'Ipo' },
  valid: { en: 'Valid', yor: 'Wulo' },
  expires: { en: 'Expires', yor: 'Yoo Pari' },
  viewQrCode: { en: 'View QR Code', yor: 'Wo Koodu QR' },
  notifications: { en: 'Notifications', yor: 'Àwọn ìfitónilétí' },
  renewalReminder: { en: 'Renewal Reminder', yor: 'Ìránnilétí Àtúse' },
  renewalMsg: { en: 'Your certificate expires in 15 days.', yor: 'Iwe-ẹri rẹ yoo pari ni ọjọ 15.' },
  showToOfficer: { en: 'Show this code to the enforcement officer.', yor: 'Fi koodu yii han fun ọlọpa.' },
  
  // Officer Dashboard
  officerPortal: { en: 'Officer Portal', yor: 'Oju-ọna Oṣiṣẹ' },
  scanToVerify: { en: 'Scan to Verify', yor: 'Ṣayẹwo lati Daju' },
  scanPrompt: { en: 'Scan driver\'s QR code to verify roadworthiness.', yor: 'Ṣayẹwo koodu QR awakọ lati jẹrisi yiyẹ oju-ọna.' },
  verifying: { en: 'Verifying...', yor: 'N jẹrisi...' },
  verificationResult: { en: 'Verification Result', yor: 'Esi Ijerisi' },
  vehicleDetails: { en: 'Vehicle Details', yor: 'Awọn alaye Ọkọ' },
  certificateValid: { en: 'Certificate is Valid', yor: 'Iwe-ẹri Wulo' },
  certificateInvalid: { en: 'Certificate is Invalid/Expired', yor: 'Iwe-ẹri Ko Wulo/Ti Pari' },
  startScan: { en: 'Start Scan', yor: 'Bẹrẹ Skena' },
  scanning: { en: 'Scanning...', yor: 'N Skena...' },
  scanAnother: { en: 'Scan Another', yor: 'Ṣayẹwo Omiiran' },
  invalidQrCode: { en: 'Invalid QR Code Data', yor: 'Data Koodu QR ti ko tọ' },

  // Booking
  bookInspection: { en: 'Book Inspection', yor: 'Ṣe Iforukọsilẹ Ayẹwo' },
  step1: { en: 'Step 1: Select a Center', yor: 'Igbesẹ 1: Yan Ile-iṣẹ kan' },
  step2: { en: 'Step 2: Choose Date & Time', yor: 'Igbesẹ 2: Yan Ọjọ & Aago' },
  step3: { en: 'Step 3: Confirmation', yor: 'Igbesẹ 3: Ifẹsẹmulẹ' },
  selectCenter: { en: 'Select an inspection center', yor: 'Yan ile-iṣẹ ayẹwo kan' },
  selectDate: { en: 'Select a date', yor: 'Yan ọjọ kan' },
  selectTime: { en: 'Select a time', yor: 'Yan aago kan' },
  confirmBooking: { en: 'Confirm Booking', yor: 'Fọwọsi Iforukọsilẹ' },
  bookingConfirmed: { en: 'Booking Confirmed!', yor: 'Iforukọsilẹ ti jẹrisi!' },
  bookingSuccessMsg: { en: 'Your inspection is booked. You will receive a notification reminder.', yor: 'A ti ṣe iforukọsilẹ ayẹwo rẹ. Iwọ yoo gba olurannileti iwifunni kan.' },

  // Documents
  myDocuments: { en: 'My Documents', yor: 'Àwọn ìwé mi' },
  uploadDocument: { en: 'Upload Document', yor: 'Gbe iwe soke' },
  vehicleLicense: { en: 'Vehicle License', yor: 'Iwe-aṣẹ ọkọ' },
  insurance: { en: 'Insurance', yor: 'Iṣeduro' },
  inspectionSlip: { en: 'Inspection Slip', yor: 'Iwe Ayẹwo' },
  
  // Profile
  myProfile: { en: 'My Profile', yor: 'Àkọọ́lẹ̀ mi' },
  driverInfo: { en: 'Driver Information', yor: 'Alaye Awakọ' },
  vehicleInfo: { en: 'Vehicle Information', yor: 'Alaye Ọkọ' },
  name: { en: 'Name', yor: 'Orukọ' },
  phone: { en: 'Phone', yor: 'Foonu' },
  plateNumber: { en: 'Plate Number', yor: 'Nọmba Pẹlẹ' },
  vin: { en: 'VIN', yor: 'VIN' },
  logout: { en: 'Logout', yor: 'Jade' },

  // AI Assistant
  aiAssistantTitle: { en: 'Drive-Law Assistant', yor: 'Olùrànlọ́wọ́ Òfin-wakọ̀' },
  aiAssistantWelcome: { en: 'Welcome! Ask me anything about Lagos traffic laws.', yor: 'Kaabo! Beere ohunkohun nipa awọn ofin ijabọ Eko.' },
  aiAssistantPlaceholder: { en: 'Type your question...', yor: 'Kọ ìbéèrè rẹ...' },
  close: { en: 'Close', yor: 'Tì' },

  // Traffic Screen
  trafficReport: { en: 'Traffic Report', yor: 'Ìròyìn Ijabọ' },
  getAIBriefing: { en: 'Get AI Traffic Briefing', yor: 'Gba Àkópọ̀ Ijabọ AI' },
  generatingBriefing: { en: 'Generating briefing...', yor: 'N ṣe àkópọ̀...' },
  trafficBriefing: { en: 'AI Traffic Briefing', yor: 'Àkópọ̀ Ijabọ AI' },
  lastUpdated: { en: 'Last updated', yor: 'Ìgbà tí a ṣe àgbéyẹ̀wò kẹ́hìn' },
  heavy: { en: 'Heavy', yor: 'O Po' },
  moderate: { en: 'Moderate', yor: 'Dede' },
  light: { en: 'Light', yor: 'Fẹẹrẹ' },

  // Fines Screen
  myFines: { en: 'My Fines & Penalties', yor: 'Àwọn Ìtanràn mi' },
  violation: { en: 'Violation', yor: 'Ìrúfin' },
  amount: { en: 'Amount', yor: 'Iye' },
  payNow: { en: 'Pay Now', yor: 'Sanwó Báyìí' },
  paid: { en: 'Paid', yor: 'Sanwó' },
  unpaid: { en: 'Unpaid', yor: 'Aìsan' },
  noFines: { en: 'Great job! You have no outstanding fines.', yor: 'Iṣẹ́ ribiribi! O ko ni ìtanràn kankan.' },
  paying: { en: 'Processing...', yor: 'N ṣiṣẹ...' },
};
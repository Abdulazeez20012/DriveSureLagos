
import { User, UserRole, UserData, Document, DocumentStatus, Inspection, Notification, InspectionCenter, UserProfile, Fine, TrafficReport } from '../types';

const USERS_KEY = 'drivesure_users';
const DATA_KEY = 'drivesure_data';
const LOGGED_IN_USER_KEY = 'drivesure_loggedin_user';

// --- Helper functions to interact with localStorage ---
const getUsersFromStorage = (): Record<string, any> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

const getDataFromStorage = (): Record<string, UserData> => {
    const data = localStorage.getItem(DATA_KEY);
    return data ? JSON.parse(data) : {};
}

const saveUsersToStorage = (users: Record<string, any>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const saveDataToStorage = (data: Record<string, UserData>) => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

// --- Default Data for New Users ---
const createDefaultDriverData = (user: User, profile: UserProfile): UserData => {
    return {
        profile: profile,
        documents: [
            { id: '1', name: 'Vehicle License', issueDate: '2023-11-01', expiryDate: '2024-10-31', status: DocumentStatus.Valid },
            { id: '2', name: 'Insurance', issueDate: '2024-01-15', expiryDate: '2024-08-01', status: DocumentStatus.ExpiringSoon },
            { id: '3', name: 'Inspection Slip', issueDate: '2023-07-20', expiryDate: '2024-07-19', status: DocumentStatus.Expired },
        ],
        inspections: [
            { id: '1', date: '2023-07-20', center: 'LACVIS, Ojodu Berger', status: 'Passed', expiry: '2024-07-19' },
            { id: '2', date: '2022-07-18', center: 'LACVIS, Ikorodu', status: 'Passed', expiry: '2023-07-17' },
        ],
        notifications: [
            {id: '1', title: 'Renewal Reminder', message: 'Your roadworthiness certificate expires in 15 days. Please book an inspection.', date: '2024-07-04', read: false},
            {id: '2', title: 'Regulatory Update', message: 'New documentation requirements will be effective from August 1st, 2024.', date: '2024-06-28', read: true},
        ],
        fines: [
            { id: 'fine1', violation: 'Driving without a valid driver\'s license', date: '2024-06-15', amount: 10000, status: 'Unpaid'},
            { id: 'fine2', violation: 'Parking in a restricted area', date: '2024-05-20', amount: 5000, status: 'Paid'},
        ]
    };
};

const apiCall = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));


const mockInspectionCenters: InspectionCenter[] = [
    {id: '1', name: 'LACVIS, Ojodu Berger', address: '96, Federal Road Safety Corps, Ojodu, Lagos'},
    {id: '2', name: 'LACVIS, Ikorodu', address: 'Ikorodu - Shagamu Rd, Ikorodu, Lagos'},
    {id: '3', name: 'LACVIS, Gbagada', address: 'Oworonshoki Expy, Gbagada, Lagos'},
    {id: '4', name: 'LACVIS, Epe', address: 'Epe-Ijebu-Ode Road, Epe, Lagos'},
];

const mockTrafficRoutes = [
    'Third Mainland Bridge', 'Lagos-Ibadan Expressway', 'Ikorodu Road',
    'Apapa-Oshodi Expressway', 'Lekki-Epe Expressway', 'Agege Motor Road',
    'Badagry Expressway'
];


// --- CloudStore Object ---
export const cloudStore = {
    async register(name: string, email: string, password: string, role: UserRole): Promise<User | null> {
        const users = getUsersFromStorage();
        if (users[email]) {
            return apiCall(null, 300); // User already exists
        }
        
        const id = `user_${Date.now()}`;
        const newUser: User = { id, name, email, role };
        users[email] = { ...newUser, password }; // Storing password for simulation
        saveUsersToStorage(users);

        // If driver, create default data
        if (role === UserRole.Driver) {
            const allData = getDataFromStorage();
            const userProfile: UserProfile = {
                name: name,
                driverId: `LAG-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                phone: '+234 800 000 0000',
                email: email,
                vehicle: {
                    make: 'Toyota',
                    model: 'Camry',
                    year: 2020,
                    plateNumber: `KJA-${Math.floor(100 + Math.random() * 900)}-BC`,
                    vin: `JN8AZ08W${Date.now().toString().slice(-10)}`,
                },
            };
            allData[id] = createDefaultDriverData(newUser, userProfile);
            saveDataToStorage(allData);
        }

        return apiCall(newUser);
    },

    async login(email: string, password: string): Promise<User | null> {
        const users = getUsersFromStorage();
        const userRecord = users[email];

        if (userRecord && userRecord.password === password) {
            const { password, ...user } = userRecord; // Don't return password
            return apiCall(user);
        }
        return apiCall(null);
    },
    
    setLoggedInUser(user: User) {
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    },

    getLoggedInUser(): User | null {
        const user = localStorage.getItem(LOGGED_IN_USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    
    clearLoggedInUser() {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
    },
    
    async getUserData(userId: string): Promise<UserData | null> {
        const allData = getDataFromStorage();
        return apiCall(allData[userId] || null);
    },

    fetchInspectionCenters: () => apiCall(mockInspectionCenters),

    async bookInspection(userId: string, centerName: string, date: string, time: string) {
        const allData = getDataFromStorage();
        const userData = allData[userId];
        if (!userData) return apiCall({ success: false });

        const newInspection: Inspection = {
            id: `insp_${Date.now()}`,
            date: date,
            center: centerName,
            status: 'Pending',
            expiry: 'N/A'
        };
        
        const newNotification: Notification = {
             id: `notif_${Date.now()}`,
             title: 'Booking Confirmed!',
             message: `Your inspection at ${centerName} is confirmed for ${date}.`,
             date: new Date().toISOString().split('T')[0],
             read: false,
        }

        userData.inspections.unshift(newInspection);
        userData.notifications.unshift(newNotification);

        saveDataToStorage(allData);
        return apiCall({ success: true, message: 'Booking confirmed.' }, 1000);
    },

    async fetchTrafficReports(): Promise<TrafficReport[]> {
        const statuses: Array<'Heavy' | 'Moderate' | 'Light'> = ['Heavy', 'Moderate', 'Light'];
        const reports = mockTrafficRoutes.map((route, i) => ({
            id: `traffic_${i}`,
            route: route,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastUpdated: `${Math.floor(Math.random() * 10) + 1}m ago`,
        }));
        return apiCall(reports, 800);
    },

    async payFine(userId: string, fineId: string): Promise<{ success: boolean }> {
        const allData = getDataFromStorage();
        const userData = allData[userId];
        if (!userData || !userData.fines) return apiCall({ success: false });

        const fineIndex = userData.fines.findIndex(f => f.id === fineId);
        if (fineIndex !== -1) {
            userData.fines[fineIndex].status = 'Paid';
            saveDataToStorage(allData);
            return apiCall({ success: true }, 1200);
        }
        return apiCall({ success: false });
    }
};
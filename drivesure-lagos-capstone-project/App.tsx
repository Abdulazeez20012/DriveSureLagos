import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { UserRole, Language, Screen, User } from './types';
import { translations as appTranslations } from './constants';
import DashboardDriver from './components/DashboardDriver';
import DashboardOfficer from './components/DashboardOfficer';
import BookingScreen from './components/BookingScreen';
import DocumentsScreen from './components/DocumentsScreen';
import ProfileScreen from './components/ProfileScreen';
import AIAssistant from './components/AIAssistant';
import AuthScreen from './components/AuthScreen';
import TrafficScreen from './components/TrafficScreen';
import FinesScreen from './components/FinesScreen';
import { HomeIcon, CalendarIcon, DocumentTextIcon, UserCircleIcon, SparklesIcon, TrafficIcon, TicketIcon } from './components/icons';
import { cloudStore } from './services/cloudStore';

// --- Localization Context ---
interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within a LocalizationProvider');
  return context;
};

const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = useCallback((key: string): string => {
    return appTranslations[key]?.[language] || key;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// --- Auth Context ---
interface AuthContextType {
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

// --- Main App Component ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = cloudStore.getLoggedInUser();
    if(loggedInUser) {
        setCurrentUser(loggedInUser);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    cloudStore.setLoggedInUser(user);
  }

  const logout = () => {
    setCurrentUser(null);
    cloudStore.clearLoggedInUser();
  }

  if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      );
  }

  return (
    <LocalizationProvider>
      <AuthContext.Provider value={{ currentUser, login, logout }}>
          <div className="min-h-screen bg-gray-900 flex justify-center items-center p-2 sm:p-4">
            <div className="relative w-full max-w-sm h-[800px] max-h-[90vh] bg-gray-50 text-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {currentUser ? <AppLayout /> : <AuthScreen />}
            </div>
          </div>
      </AuthContext.Provider>
    </LocalizationProvider>
  );
};

// --- App Layout (when logged in) ---
const AppLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Dashboard);
  const [isOnline, setIsOnline] = useState(true); // This can remain as a simulation of network status
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const renderScreen = () => {
    if (currentUser?.role === UserRole.Officer) {
      return <DashboardOfficer isOnline={isOnline} />;
    }

    switch (activeScreen) {
      case Screen.Dashboard:
        return <DashboardDriver isOnline={isOnline} />;
      case Screen.Booking:
        return <BookingScreen isOnline={isOnline} />;
      case Screen.Documents:
        return <DocumentsScreen isOnline={isOnline} />;
      case Screen.Traffic:
        return <TrafficScreen isOnline={isOnline} />;
      case Screen.Fines:
        return <FinesScreen isOnline={isOnline} />;
      case Screen.Profile:
        return <ProfileScreen isOnline={isOnline} />;
      default:
        return <DashboardDriver isOnline={isOnline} />;
    }
  };
  
  return (
      <>
        <AppHeader isOnline={isOnline} setIsOnline={setIsOnline} />
        <main className="flex-grow overflow-y-auto bg-gray-100 p-4">
          {renderScreen()}
        </main>
        {currentUser?.role === UserRole.Driver && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} isOnline={isOnline} />}
        
        {isOnline && (
          <button
              onClick={() => setIsAIAssistantOpen(true)}
              title="AI Assistant"
              className="absolute bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
              aria-label="Open AI Law Assistant"
              >
              <SparklesIcon className="w-8 h-8" />
          </button>
        )}

        {isAIAssistantOpen && <AIAssistant isOnline={isOnline} onClose={() => setIsAIAssistantOpen(false)} />}
      </>
  );
}


// --- Header Component ---
interface AppHeaderProps {
    isOnline: boolean;
    setIsOnline: (online: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ isOnline, setIsOnline }) => {
    const { t, language, setLanguage } = useLocalization();
    const { currentUser } = useAuth();

    return (
        <header className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-blue-900">{t('appTitle')}</h1>
            <div className="flex items-center space-x-2">
                 <div 
                    onClick={() => setIsOnline(!isOnline)}
                    className={`cursor-pointer text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1 transition-all ${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    <span>{isOnline ? t('online') : t('offline')}</span>
                 </div>
                
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">{currentUser?.role}</span>

                <button 
                    onClick={() => setLanguage(language === Language.EN ? Language.YOR : Language.EN)}
                    className="text-xs font-semibold p-1 rounded-md bg-gray-100 w-10 text-center hover:bg-gray-200"
                >
                    {language === Language.EN ? 'YOR' : 'EN'}
                </button>
            </div>
        </header>
    );
}

// --- Bottom Navigation Component ---
interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  isOnline: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, isOnline }) => {
    const { t } = useLocalization();

  const navItems = [
    { screen: Screen.Dashboard, label: t('navDashboard'), icon: HomeIcon, onlineOnly: false },
    { screen: Screen.Traffic, label: t('navTraffic'), icon: TrafficIcon, onlineOnly: true },
    { screen: Screen.Booking, label: t('navBooking'), icon: CalendarIcon, onlineOnly: true },
    { screen: Screen.Fines, label: t('navFines'), icon: TicketIcon, onlineOnly: false },
    { screen: Screen.Documents, label: t('navDocuments'), icon: DocumentTextIcon, onlineOnly: false },
    { screen: Screen.Profile, label: t('navProfile'), icon: UserCircleIcon, onlineOnly: false },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 flex justify-around p-2 pt-3 shadow-inner z-10">
      {navItems.map((item) => {
        const isButtonDisabled = item.onlineOnly && !isOnline;
        const isActive = activeScreen === item.screen;
        return (
            <button
              key={item.screen}
              onClick={() => !isButtonDisabled && setActiveScreen(item.screen)}
              disabled={isButtonDisabled}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
              } ${isButtonDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
            </button>
        );
      })}
    </nav>
  );
};

export default App;
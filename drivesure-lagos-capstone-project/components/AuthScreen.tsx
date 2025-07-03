import React, { useState } from 'react';
import { useLocalization, useAuth } from '../App';
import { UserRole } from '../types';
import { cloudStore } from '../services/cloudStore';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon, AppLogoIcon } from './icons';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useLocalization();
  
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center p-4 sm:p-6">
        <div className="text-center mb-6">
            <AppLogoIcon className="w-16 h-16 mx-auto" />
            <h1 className="text-3xl font-bold text-blue-900 mt-2">DriveSure Lagos</h1>
        </div>
        
        <div className="w-full max-w-sm bg-white p-6 pt-4 rounded-2xl shadow-xl">
            {/* Tab buttons */}
            <div className="flex rounded-lg bg-gray-200 p-1 mb-5">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                        isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-300'
                    }`}
                >
                    {t('login')}
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                        !isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-300'
                    }`}
                >
                    {t('register')}
                </button>
            </div>
            
            {isLogin ? <Login /> : <Register />}
        </div>
    </div>
  );
};

const Login = () => {
    const { t } = useLocalization();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const user = await cloudStore.login(email, password);
        setIsLoading(false);
        if (user) {
            login(user);
        } else {
            setError(t('loginError'));
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('loginTitle')}</h2>
                <p className="text-gray-500 text-sm">{t('loginSubtitle')}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <InputGroup icon={<EnvelopeIcon className="w-5 h-5 text-gray-400"/>} type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
                <InputGroup icon={<LockClosedIcon className="w-5 h-5 text-gray-400"/>} type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                    {isLoading ? t('loggingIn') : t('login')}
                </button>
            </form>
        </div>
    );
};

const Register = () => {
    const { t } = useLocalization();
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Driver);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const user = await cloudStore.register(name, email, password, role);
        setIsLoading(false);
        if (user) {
            login(user);
        } else {
            setError(t('registerError'));
        }
    };

    return (
        <div className="w-full">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('registerTitle')}</h2>
                <p className="text-gray-500 text-sm">{t('registerSubtitle')}</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
                 <InputGroup icon={<UserCircleIcon className="w-5 h-5 text-gray-400"/>} type="text" placeholder={t('fullName')} value={name} onChange={e => setName(e.target.value)} required />
                 <InputGroup icon={<EnvelopeIcon className="w-5 h-5 text-gray-400"/>} type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} required />
                 <InputGroup icon={<LockClosedIcon className="w-5 h-5 text-gray-400"/>} type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required />
                
                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-3 bg-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={UserRole.Driver}>{t('driver')}</option>
                    <option value={UserRole.Officer}>{t('officer')}</option>
                </select>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                    {isLoading ? t('registering') : t('register')}
                </button>
            </form>
        </div>
    );
};

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ icon, ...props}) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input 
                {...props}
                className="w-full p-3 pl-10 bg-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )
}

export default AuthScreen;

import React, { useState, useEffect } from 'react';
import { useLocalization, useAuth } from '../App';
import { UserProfile as UserProfileType } from '../types';
import { cloudStore } from '../services/cloudStore';
import { UserCircleIcon } from './icons';

interface ProfileScreenProps {
  isOnline: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
        if (!currentUser) return;
        setIsLoading(true);
        const data = await cloudStore.getUserData(currentUser.id);
        setProfile(data?.profile || null);
        setIsLoading(false);
    }
    loadProfile();
  }, [currentUser]);

  const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value || '...'}</span>
    </div>
  );

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center pt-4 pb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <UserCircleIcon className="w-20 h-20 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile?.name || '...'}</h2>
        <p className="text-gray-500">{profile?.driverId || '...'}</p>
      </div>

      <Section title={t('driverInfo')}>
        {isLoading ? <p>Loading...</p> : (
            <>
                <InfoRow label={t('phone')} value={profile?.phone} />
                <InfoRow label={t('email')} value={profile?.email} />
            </>
        )}
      </Section>

      <Section title={t('vehicleInfo')}>
      {isLoading ? <p>Loading...</p> : (
            <>
                <InfoRow label="Make/Model" value={profile ? `${profile.vehicle.make} ${profile.vehicle.model}`: '...'} />
                <InfoRow label={t('plateNumber')} value={profile?.vehicle.plateNumber} />
                <InfoRow label={t('vin')} value={profile?.vehicle.vin} />
            </>
      )}
      </Section>

      {isOnline && (
        <button 
          onClick={logout}
          className="w-full mt-4 bg-red-50 text-red-600 font-bold py-3 rounded-lg hover:bg-red-100 transition-colors">
            {t('logout')}
        </button>
      )}
    </div>
  );
};

export default ProfileScreen;

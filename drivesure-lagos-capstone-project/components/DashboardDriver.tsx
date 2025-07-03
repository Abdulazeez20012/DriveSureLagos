
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useLocalization, useAuth } from '../App';
import { Inspection, Notification, UserProfile } from '../types';
import { cloudStore } from '../services/cloudStore';
import { BellIcon, CheckCircleIcon } from './icons';

interface DashboardDriverProps {
  isOnline: boolean;
}

const DashboardDriver: React.FC<DashboardDriverProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [latestInspection, setLatestInspection] = useState<Inspection | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isOnline && currentUser) {
        setIsLoading(true);
        const data = await cloudStore.getUserData(currentUser.id);
        if (data) {
          setProfile(data.profile);
          setLatestInspection(data.inspections?.[0] || null);
          setNotifications(data.notifications);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOnline, currentUser]);

  useEffect(() => {
    if (profile && latestInspection) {
      const data = {
        name: profile.name,
        driverId: profile.driverId,
        plateNumber: profile.vehicle.plateNumber,
        vehicle: `${profile.vehicle.make} ${profile.vehicle.model}`,
        expiryDate: latestInspection.expiry,
        status: 'Valid',
      };
      setQrCodeValue(JSON.stringify(data));
    }
  }, [profile, latestInspection]);

  const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
  
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <h2 className="font-medium text-blue-200">{t('roadworthinessCertificate')}</h2>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-blue-300">{t('status')}</p>
            <p className="text-2xl font-bold text-green-300 flex items-center space-x-2">
                <CheckCircleIcon className="w-7 h-7" />
                <span>{t('valid')}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-300 text-right">{t('expires')}</p>
            <p className="text-lg font-semibold">{latestInspection?.expiry || 'N/A'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowQrCode(true)}
          disabled={!isOnline || !qrCodeValue}
          className="mt-6 w-full bg-white text-blue-800 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {t('viewQrCode')}
        </button>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <BellIcon className="w-6 h-6 mr-2 text-gray-500" />
          {t('notifications')}
        </h3>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${n.read ? 'border-gray-300' : 'border-yellow-400'}`}>
              <p className="font-bold">{t(n.title.replace(/\s/g, '')) || n.title}</p>
              <p className="text-sm text-gray-600">{t(n.message.replace(/\s|\.|/g, '')) || n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{n.date}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">{ isOnline ? 'No new notifications.' : 'Notifications unavailable offline.'}</p>
        )}
      </div>

      {showQrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setShowQrCode(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{t('roadworthinessCertificate')}</h3>
            <div className="p-4 bg-gray-100 rounded-lg">
                {qrCodeValue ? (
                    <QRCode
                        value={qrCodeValue}
                        size={256}
                        viewBox={`0 0 256 256`}
                        className="w-56 h-56 mx-auto"
                    />
                ) : (
                    <p>Generating QR Code...</p>
                )}
            </div>
            <p className="mt-4 text-sm text-gray-600">{t('showToOfficer')}</p>
            <button
              onClick={() => setShowQrCode(false)}
              className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDriver;

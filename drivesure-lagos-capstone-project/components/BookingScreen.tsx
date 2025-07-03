
import React, { useState, useEffect } from 'react';
import { useLocalization, useAuth } from '../App';
import { InspectionCenter } from '../types';
import { cloudStore } from '../services/cloudStore';
import { ChevronLeftIcon } from './icons';

interface BookingScreenProps {
  isOnline: boolean;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [centers, setCenters] = useState<InspectionCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setIsLoading(true);
      cloudStore.fetchInspectionCenters().then(data => {
        setCenters(data);
        setIsLoading(false);
      });
    }
  }, [isOnline]);

  const handleConfirm = async () => {
    if (!selectedCenter || !selectedDate || !selectedTime || !currentUser) return;
    setIsLoading(true);
    await cloudStore.bookInspection(currentUser.id, selectedCenter, selectedDate, selectedTime);
    setIsLoading(false);
    setStep(3);
  };
  
  if (!isOnline) {
      return <div className="text-center p-8 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold text-gray-700">{t('bookingNotAvailable')}</h2>
          <p className="text-gray-500 mt-2">Booking an inspection requires an internet connection. Please connect to a network and try again.</p>
      </div>;
  }
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('step1')}</h3>
            <div className="space-y-3">
              {centers.map(center => (
                <button
                  key={center.id}
                  onClick={() => {
                    const centerInfo = centers.find(c => c.id === center.id);
                    setSelectedCenter(centerInfo?.name || '');
                    setStep(2);
                  }}
                  className="w-full text-left p-4 bg-white rounded-lg border-2 border-transparent hover:border-blue-500 focus:border-blue-500 transition-all"
                >
                  <p className="font-bold">{center.name}</p>
                  <p className="text-sm text-gray-500">{center.address}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('step2')}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">{t('selectDate')}</label>
                <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">{t('selectTime')}</label>
                <input type="time" id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
              </div>
              <button 
                onClick={handleConfirm} 
                disabled={!selectedDate || !selectedTime || isLoading}
                className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Confirming...' : t('confirmBooking')}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center p-6">
            <h3 className="text-2xl font-bold text-green-600">{t('bookingConfirmed')}</h3>
            <p className="mt-2 text-gray-600">{t('bookingSuccessMsg')}</p>
            <button onClick={() => {
                setStep(1);
                setSelectedCenter('');
                setSelectedDate('');
                setSelectedTime('');
            }} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Book Another</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="p-2 rounded-full hover:bg-gray-200 mr-2">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-800">{t('bookInspection')}</h2>
      </div>
      {isLoading && centers.length === 0 ? <p>Loading centers...</p> : renderStep()}
    </div>
  );
};

export default BookingScreen;

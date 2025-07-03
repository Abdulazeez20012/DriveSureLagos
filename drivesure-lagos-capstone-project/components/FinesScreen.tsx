import React, { useState, useEffect } from 'react';
import { useLocalization, useAuth } from '../App';
import { Fine } from '../types';
import { cloudStore } from '../services/cloudStore';

interface FinesScreenProps {
  isOnline: boolean;
}

const FinesScreen: React.FC<FinesScreenProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [fines, setFines] = useState<Fine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [payingFineId, setPayingFineId] = useState<string | null>(null);

  const fetchFines = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const data = await cloudStore.getUserData(currentUser.id);
    setFines(data?.fines || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFines();
  }, [currentUser]);

  const handlePayFine = async (fineId: string) => {
    if (!currentUser || !isOnline) return;
    setPayingFineId(fineId);
    await cloudStore.payFine(currentUser.id, fineId);
    await fetchFines(); // Re-fetch fines to update status
    setPayingFineId(null);
  };

  const hasUnpaidFines = fines.some(f => f.status === 'Unpaid');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('myFines')}</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      ) : !hasUnpaidFines ? (
        <div className="text-center p-8 bg-green-50 rounded-lg">
          <h3 className="text-xl font-bold text-green-700">{t('noFines')}</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {fines.map(fine => (
            <div key={fine.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{fine.violation}</p>
                  <p className="text-sm text-gray-500">{fine.date}</p>
                </div>
                <div className={`text-sm font-bold px-2 py-1 rounded-full ${fine.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {t(fine.status.toLowerCase() as 'paid' | 'unpaid')}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-xs text-gray-500">{t('amount')}</p>
                  <p className="text-lg font-semibold">₦{fine.amount.toLocaleString()}</p>
                </div>
                {fine.status === 'Unpaid' && (
                  <button
                    onClick={() => handlePayFine(fine.id)}
                    disabled={payingFineId === fine.id || !isOnline}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {payingFineId === fine.id ? t('paying') : t('payNow')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinesScreen;

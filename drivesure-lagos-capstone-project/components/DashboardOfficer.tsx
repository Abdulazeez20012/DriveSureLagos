
import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../App';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircleIcon, XCircleIcon, QrCodeIcon } from './icons';

interface DashboardOfficerProps {
  isOnline: boolean;
}

type VerificationStatus = 'idle' | 'scanning' | 'success' | 'error';

interface ScannedData {
  name: string;
  driverId: string;
  plateNumber: string;
  vehicle: string;
  expiryDate: string;
  status: string;
}

const DashboardOfficer: React.FC<DashboardOfficerProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<ScannedData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
            console.error("Failed to clear html5-qrcode-scanner.", error);
        });
        scannerRef.current = null;
    }
    try {
      const data: ScannedData = JSON.parse(decodedText);
      // Basic validation of scanned data
      if (data && data.driverId && data.expiryDate) {
        setResult(data);
        setStatus('success');
      } else {
        throw new Error("Missing essential data in QR code.");
      }
    } catch (e) {
      setErrorMsg(t('invalidQrCode'));
      setStatus('error');
    }
  };

  const handleScanError = (errorMessage: string) => {
    // This function can be noisy, so we'll log errors selectively.
    // console.error(`QR Scanner Error: ${errorMessage}`);
  };

  useEffect(() => {
    if (status === 'scanning' && isOnline) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false // verbose
      );
      scanner.render(handleScanSuccess, handleScanError);
      scannerRef.current = scanner;
    }
    
    return () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear html5-qrcode-scanner on cleanup.", error);
            });
            scannerRef.current = null;
        }
    };
  }, [status, isOnline]);
  
  const reset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  };

  const startScanning = () => {
      if (!isOnline) {
          alert("Verification requires an internet connection.");
          return;
      }
      setStatus('scanning');
  }

  const renderContent = () => {
    switch(status) {
      case 'scanning':
        return (
          <div className="w-full">
            <div id="qr-reader" className="w-full rounded-lg overflow-hidden"/>
            <p className="text-lg font-semibold text-gray-700 mt-4 text-center">{t('scanning')}</p>
          </div>
        );
      case 'success':
      case 'error':
        const isSuccess = status === 'success' && result;
        const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
        const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
        const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

        return (
          <div className="flex flex-col h-full w-full">
            <h3 className="text-xl font-bold text-center mb-4">{t('verificationResult')}</h3>
            <div className={`p-4 rounded-lg ${bgColor} flex items-center space-x-3`}>
              <Icon className={`w-8 h-8 ${textColor}`} />
              <p className={`text-lg font-bold ${textColor}`}>
                {isSuccess ? t('certificateValid') : (errorMsg || t('certificateInvalid'))}
              </p>
            </div>
            {isSuccess && result && (
              <div className="mt-4 space-y-3 text-sm flex-grow">
                <h4 className="font-bold text-gray-800">{t('driverInfo')}</h4>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-gray-500">{t('name')}: <span className="font-semibold text-gray-900">{result.name}</span></p>
                </div>
                <h4 className="font-bold text-gray-800 pt-2">{t('vehicleDetails')}</h4>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-gray-500">Make/Model: <span className="font-semibold text-gray-900">{result.vehicle}</span></p>
                  <p className="text-gray-500">{t('plateNumber')}: <span className="font-semibold text-gray-900">{result.plateNumber}</span></p>
                  <p className="text-gray-500">{t('expires')}: <span className="font-semibold text-gray-900">{result.expiryDate}</span></p>
                </div>
              </div>
            )}
            <button onClick={reset} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('scanAnother')}
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-2xl font-bold text-gray-800">{t('officerPortal')}</h2>
            <p className="text-gray-500 mt-2 mb-8">{t('scanPrompt')}</p>
            <button 
              onClick={startScanning}
              disabled={!isOnline}
              className="w-48 h-48 bg-blue-600 text-white rounded-full flex flex-col items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              <QrCodeIcon className="w-20 h-20" />
              <span className="mt-2 font-bold text-xl">{t('startScan')}</span>
            </button>
             {!isOnline && <p className="text-red-600 text-sm mt-4">Internet connection required.</p>}
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {renderContent()}
    </div>
  );
};

export default DashboardOfficer;

import React, { useState, useEffect } from 'react';
import { useLocalization, useAuth } from '../App';
import { Document, DocumentStatus } from '../types';
import { cloudStore } from '../services/cloudStore';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, DocumentTextIcon } from './icons';

interface DocumentsScreenProps {
  isOnline: boolean;
}

const DocumentItem: React.FC<{ doc: Document }> = ({ doc }) => {
  const { t } = useLocalization();
  
  const statusInfo = {
    [DocumentStatus.Valid]: {
      icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    [DocumentStatus.ExpiringSoon]: {
      icon: <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />,
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    [DocumentStatus.Expired]: {
      icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
    },
    [DocumentStatus.Missing]: {
      icon: <ExclamationCircleIcon className="w-6 h-6 text-gray-500" />,
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
  };

  const currentStatus = statusInfo[doc.status];

  return (
    <div className={`p-4 rounded-lg flex items-center space-x-4 bg-white shadow-sm border ${currentStatus.bgColor.replace('bg-', 'border-')}`}>
      <div className={`p-3 rounded-full ${currentStatus.bgColor}`}>
        {currentStatus.icon}
      </div>
      <div className="flex-grow">
        <p className="font-bold text-gray-800">{t(doc.name.replace(/\s/g, '')) || doc.name}</p>
        <p className={`text-sm font-semibold ${currentStatus.textColor}`}>
          {t(doc.status.replace(/\s/g, '')) || doc.status}
        </p>
      </div>
      <div className="text-right text-xs text-gray-500">
        <p>Expires</p>
        <p>{doc.expiryDate}</p>
      </div>
    </div>
  );
};

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
        if (!currentUser) return;
        setIsLoading(true);
        const data = await cloudStore.getUserData(currentUser.id);
        setDocuments(data?.documents || []);
        setIsLoading(false);
    }
    loadDocs();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('myDocuments')}</h2>
      
      {isLoading ? (
        <p>Loading documents...</p>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <DocumentItem key={doc.id} doc={doc} />
          ))}
        </div>
      )}

      {isOnline && (
          <button className="w-full mt-8 bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
            <DocumentTextIcon className="w-5 h-5" />
            <span>{t('uploadDocument')}</span>
          </button>
      )}
    </div>
  );
};

export default DocumentsScreen;

import React, { useState, useEffect } from 'react';
import { useLocalization } from '../App';
import { TrafficReport } from '../types';
import { cloudStore } from '../services/cloudStore';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TrafficScreenProps {
  isOnline: boolean;
}

const TrafficScreen: React.FC<TrafficScreenProps> = ({ isOnline }) => {
  const { t } = useLocalization();
  const [reports, setReports] = useState<TrafficReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiBriefing, setAiBriefing] = useState('');
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setIsLoading(true);
      cloudStore.fetchTrafficReports().then(data => {
        setReports(data);
        setIsLoading(false);
      });
    } else {
        setIsLoading(false);
    }
  }, [isOnline]);
  
  const handleGetAIBriefing = async () => {
    if (!isOnline || reports.length === 0 || isBriefingLoading) return;
    setIsBriefingLoading(true);
    setAiBriefing('');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `Based on the following real-time traffic data for Lagos, provide a concise and helpful summary for a driver in markdown format. Highlight the most congested routes to avoid, and suggest potential alternative routes if applicable. Keep it brief and easy to read.
        
        Current Traffic Data:
        ${JSON.stringify(reports, null, 2)}
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        setAiBriefing(response.text);
    } catch (error) {
        console.error('Failed to generate traffic briefing:', error);
        setAiBriefing('Could not generate AI briefing at this time. Please try again later.');
    } finally {
        setIsBriefingLoading(false);
    }
  };

  const getStatusColor = (status: 'Heavy' | 'Moderate' | 'Light') => {
      switch(status) {
          case 'Heavy': return 'bg-red-500';
          case 'Moderate': return 'bg-yellow-500';
          case 'Light': return 'bg-green-500';
      }
  }

  if (!isOnline && reports.length === 0) {
    return <div className="text-center p-8 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold text-gray-700">{t('trafficReport')} unavailable</h2>
        <p className="text-gray-500 mt-2">This feature requires an internet connection.</p>
    </div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('trafficReport')}</h2>

      <button
        onClick={handleGetAIBriefing}
        disabled={isBriefingLoading || isLoading || !isOnline}
        className="w-full mb-6 bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isBriefingLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-white border-dashed rounded-full animate-spin"></div>
                <span>{t('generatingBriefing')}</span>
            </>
        ) : (
            <>
                <SparklesIcon className="w-5 h-5" />
                <span>{t('getAIBriefing')}</span>
            </>
        )}
      </button>

      {aiBriefing && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">{t('trafficBriefing')}</h3>
            <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiBriefing}</ReactMarkdown>
            </div>
          </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
            <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-600"></div>
            </div>
        ) : (
            reports.map(report => (
                <div key={report.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-gray-800">{report.route}</p>
                        <p className="text-xs text-gray-500">{t('lastUpdated')} {report.lastUpdated}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></span>
                        <span className="font-semibold text-gray-700 text-sm">{t(report.status.toLowerCase() as 'heavy' | 'moderate' | 'light')}</span>
                    </div>
                </div>
            ))
        )}
      </div>
       <style>{`
        .prose { font-size: 0.9rem; line-height: 1.5; }
        .prose h1, .prose h2, .prose h3 { margin-bottom: 0.5em; margin-top: 1em; font-weight: bold;}
        .prose p { margin-bottom: 0.5em; margin-top: 0.5em; }
        .prose ul, .prose ol { margin-left: 1.5em; margin-bottom: 0.5em; padding-left: 1em; }
        .prose li { margin-bottom: 0.25em; }
        .prose strong { font-weight: bold; }
        .prose a { color: #2563eb; text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default TrafficScreen;

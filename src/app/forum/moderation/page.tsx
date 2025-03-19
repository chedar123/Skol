"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import ForumLayout from '@/components/forum/ForumLayout';
import { Report } from '@/types/forum';
import { timeAgo } from '@/lib/utils';

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [resolutionText, setResolutionText] = useState<string>('');
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [rejectingReportId, setRejectingReportId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAdmin = session?.user?.role === 'ADMIN';
  const isModerator = session?.user?.role === 'MODERATOR';
  
  useEffect(() => {
    // Omdirigera om användaren inte är admin eller moderator
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/forum/moderation');
      return;
    }
    
    if (status === 'authenticated' && !(isAdmin || isModerator)) {
      router.push('/forum');
      return;
    }
    
    if (status === 'authenticated' && (isAdmin || isModerator)) {
      fetchReports();
    }
  }, [status, isAdmin, isModerator, router, activeTab]);
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const status = activeTab === 'pending' ? 'PENDING' : ['RESOLVED', 'REJECTED'].join(',');
      const response = await fetch(`/api/forum/reports?status=${status}`);
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta rapporter');
      }
      
      const data = await response.json();
      setReports(data.reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResolveReport = async (reportId: string) => {
    if (!resolutionText.trim()) {
      alert('Du måste ange en resolution');
      return;
    }
    
    try {
      setResolvingReportId(reportId);
      
      const response = await fetch(`/api/forum/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolution: resolutionText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Kunde inte hantera rapporten');
      }
      
      setResolutionText('');
      fetchReports();
    } catch (err) {
      console.error('Error resolving report:', err);
      alert(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setResolvingReportId(null);
    }
  };
  
  const handleRejectReport = async (reportId: string) => {
    try {
      setRejectingReportId(reportId);
      
      const response = await fetch(`/api/forum/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          resolution: 'Rapporten avslogs av moderator',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Kunde inte avslå rapporten');
      }
      
      fetchReports();
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setRejectingReportId(null);
    }
  };
  
  return (
    <ForumLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Moderation</h1>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('pending')}
              className={`mr-4 py-2 px-1 ${
                activeTab === 'pending'
                  ? 'border-b-2 border-pink-500 font-medium text-pink-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Väntande rapporter
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`mr-4 py-2 px-1 ${
                activeTab === 'resolved'
                  ? 'border-b-2 border-pink-500 font-medium text-pink-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hanterade rapporter
            </button>
          </nav>
        </div>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Laddar rapporter...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchReports}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Försök igen
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'Det finns inga väntande rapporter just nu.' 
                : 'Det finns inga hanterade rapporter än.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">Rapporterad av:</span>
                        <Link 
                          href={`/profil/${report.user.name ? report.user.name : report.user.id}`}
                          className="ml-2 hover:text-pink-600 hover:underline"
                        >
                          {report.user.name || 'Okänd användare'}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <Clock className="inline-block w-4 h-4 mr-1 -mt-0.5" />
                        {timeAgo(new Date(report.createdAt))}
                      </div>
                    </div>
                    
                    {report.status !== 'PENDING' && (
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        report.status === 'RESOLVED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status === 'RESOLVED' ? 'Åtgärdad' : 'Avvisad'}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <p className="font-medium text-gray-700">Anledning:</p>
                    <p className="mt-1 text-gray-600 bg-gray-50 p-2 rounded">{report.reason}</p>
                  </div>
                  
                  {report.status !== 'PENDING' && report.resolution && (
                    <div className="mt-3">
                      <p className="font-medium text-gray-700">Resultat:</p>
                      <p className="mt-1 text-gray-600 bg-gray-50 p-2 rounded">{report.resolution}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hanterad av {' '}
                        {report.resolvedBy ? (
                          <Link 
                            href={`/profil/${report.resolvedBy.name ? report.resolvedBy.name : report.resolvedBy.id}`}
                            className="hover:text-pink-600 hover:underline"
                          >
                            {report.resolvedBy.name || 'Okänd moderator'}
                          </Link>
                        ) : (
                          'Okänd moderator'
                        )}{' '}
                        {report.resolvedAt && timeAgo(new Date(report.resolvedAt))}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Rapporterat innehåll:</p>
                  <div 
                    className="prose prose-sm max-w-none text-gray-700 bg-white p-3 rounded border border-gray-200"
                    dangerouslySetInnerHTML={{ __html: report.post.content }}
                  />
                  
                  <div className="mt-3 text-sm">
                    <Link 
                      href={`/forum/thread/${report.post.thread.id}/${report.post.thread.slug}#post-${report.post.id}`}
                      className="text-pink-600 hover:text-pink-800 hover:underline"
                    >
                      Visa i tråden: {report.post.thread.title}
                    </Link>
                  </div>
                </div>
                
                {activeTab === 'pending' && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 pr-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resolution (hur du hanterade rapporten)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          rows={2}
                          placeholder="Beskriv åtgärden du vidtagit..."
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRejectReport(report.id)}
                          disabled={!!rejectingReportId}
                          className="inline-flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Avslå
                          {rejectingReportId === report.id && (
                            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          disabled={!!resolvingReportId}
                          className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Åtgärda
                          {resolvingReportId === report.id && (
                            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ForumLayout>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailDetail from '@/components/EmailDetail';
import Compose from '@/components/Compose';
import { WebSocketProvider } from '@/components/WebSocketProvider';

export default function Dashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('focused');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [composing, setComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    fetchEmails();
  }, [activeView, searchQuery]);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      
      const response = await fetch(
        `${apiUrl}/emails?category=${activeView}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      
      await fetch(`${apiUrl}/emails/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh emails after sync
      setTimeout(() => fetchEmails(), 2000);
    } catch (error) {
      console.error('Error syncing emails:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <WebSocketProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onCompose={() => setComposing(true)}
          onSync={handleSync}
        />

        {composing ? (
          <Compose
            onClose={() => setComposing(false)}
            onSent={() => {
              setComposing(false);
              fetchEmails();
            }}
          />
        ) : selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmail(null)}
            onUpdate={fetchEmails}
          />
        ) : (
          <EmailList
            emails={emails}
            onSelectEmail={setSelectedEmail}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
      </div>
    </WebSocketProvider>
  );
}

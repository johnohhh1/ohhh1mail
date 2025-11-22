'use client';

import { useState, useEffect } from 'react';
import EmailList from '@/components/EmailList';
import EmailDetail from '@/components/EmailDetail';
import Sidebar from '@/components/Sidebar';

interface Email {
    id: number;
    message_id: string;
    from_address: string;
    from_name?: string;
    subject: string;
    ai_summary?: string;
    preview?: string;
    is_read: boolean;
    is_starred: boolean;
    received_at: string;
    body_text?: string;
}

export default function InboxPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');

            if (!token) {
                window.location.href = '/';
                return;
            }

            const response = await fetch('http://localhost:8001/emails', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch emails');
            }

            const data = await response.json();
            setEmails(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching emails:', err);
            setError('Failed to load emails');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleEmailSelect = async (email: Email) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:8001/emails/${email.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const fullEmail = await response.json();
                setSelectedEmail(fullEmail);
            }
        } catch (err) {
            console.error('Error fetching email details:', err);
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const filteredEmails = emails.filter(email => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        return (
            email.subject.toLowerCase().includes(search) ||
            email.from_address.toLowerCase().includes(search) ||
            email.from_name?.toLowerCase().includes(search) ||
            email.preview?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-1">
                {loading ? (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-gray-500">Loading emails...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-red-500">{error}</div>
                    </div>
                ) : (
                    <>
                        <div className="w-96 border-r border-gray-200">
                            <EmailList
                                emails={filteredEmails}
                                onSelectEmail={handleEmailSelect}
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                        </div>

                        {selectedEmail ? (
                            <div className="flex-1">
                                <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select an email to view
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

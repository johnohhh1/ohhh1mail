'use client';

import { useState, useEffect } from 'react';
import { Plus, MoreVertical, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import AddAccountModal from './AddAccountModal';
import IMAPConfig from './IMAPConfig';

interface Account {
    id: string;
    email: string;
    type: string;
    status: string;
    lastSync: string;
}

export default function AccountSettings() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showIMAPConfig, setShowIMAPConfig] = useState(false);
    const [initialIMAPConfig, setInitialIMAPConfig] = useState<any>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8001/settings/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = (type: 'gmail' | 'outlook' | 'imap') => {
        setShowAddModal(false);

        let config = {};
        if (type === 'gmail') {
            config = {
                imapServer: 'imap.gmail.com',
                imapPort: '993',
                smtpServer: 'smtp.gmail.com',
                smtpPort: '465',
                provider: 'gmail'
            };
        } else if (type === 'outlook') {
            config = {
                imapServer: 'outlook.office365.com',
                imapPort: '993',
                smtpServer: 'smtp.office365.com',
                smtpPort: '587',
                provider: 'outlook'
            };
        }

        setInitialIMAPConfig(config);
        setShowIMAPConfig(true);
    };

    const handleIMAPSave = async (config: any) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8001/settings/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setShowIMAPConfig(false);
                fetchAccounts();
            } else {
                const error = await res.json();
                alert(`Failed to add account: ${error.detail}`);
            }
        } catch (error) {
            console.error('Failed to save account:', error);
            alert('Failed to save account. Please try again.');
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8001/settings/accounts/${accountId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchAccounts();
                setOpenMenuId(null);
            }
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    if (showIMAPConfig) {
        return (
            <IMAPConfig
                onBack={() => setShowIMAPConfig(false)}
                onSave={handleIMAPSave}
                initialConfig={initialIMAPConfig}
            />
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Email Accounts</h2>
                    <p className="text-gray-600 mt-1">Manage your connected email accounts and sync preferences.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Account
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No accounts connected. Click "Add Account" to get started.
                    </div>
                ) : (
                    accounts.map((account) => (
                        <div key={account.id} className="p-4 flex items-center justify-between border-b border-gray-200 last:border-0 hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${account.type === 'gmail' ? 'bg-red-100 text-red-600' :
                                    account.type === 'outlook' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {account.type === 'gmail' ? 'G' : account.type === 'outlook' ? 'O' : 'I'}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{account.email}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="capitalize">{account.type}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            {account.status === 'synced' ? (
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                            )}
                                            Synced {account.lastSync}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === account.id ? null : account.id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {openMenuId === account.id && (
                                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                                        <button
                                            onClick={() => {
                                                alert('Set as Primary - Coming soon!');
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Set as Primary
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert('Edit Settings - Coming soon!');
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert('Sign Out - Coming soon!');
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Sign Out
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => handleDeleteAccount(account.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Remove Account
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddModal && (
                <AddAccountModal
                    onClose={() => setShowAddModal(false)}
                    onSelectType={handleAddAccount}
                />
            )}
        </div>
    );
}

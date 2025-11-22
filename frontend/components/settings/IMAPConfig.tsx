'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Loader2, AlertCircle } from 'lucide-react';

interface IMAPConfigProps {
    onBack: () => void;
    onSave: (config: any) => void;
    initialConfig?: {
        email?: string;
        imapServer?: string;
        imapPort?: string;
        smtpServer?: string;
        smtpPort?: string;
        provider?: 'gmail' | 'outlook' | 'other';
    };
}

export default function IMAPConfig({ onBack, onSave, initialConfig }: IMAPConfigProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'credentials' | 'server' | 'testing'>('credentials');

    const [formData, setFormData] = useState({
        email: initialConfig?.email || '',
        password: '',
        name: '',
        imapServer: initialConfig?.imapServer || '',
        imapPort: initialConfig?.imapPort || '993',
        imapSecurity: 'ssl',
        smtpServer: initialConfig?.smtpServer || '',
        smtpPort: initialConfig?.smtpPort || '465',
        smtpSecurity: 'ssl',
        domainFilter: '',  // Comma-separated list of domains
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoDetect = async () => {
        setLoading(true);
        setError('');

        // Simulate auto-detection delay
        setTimeout(() => {
            const domain = formData.email.split('@')[1];
            if (domain === 'icloud.com' || domain === 'me.com') {
                setFormData(prev => ({
                    ...prev,
                    imapServer: 'imap.mail.me.com',
                    smtpServer: 'smtp.mail.me.com',
                    imapPort: '993',
                    smtpPort: '587',
                    smtpSecurity: 'starttls'
                }));
                setStep('server');
            } else if (domain === 'yahoo.com') {
                setFormData(prev => ({
                    ...prev,
                    imapServer: 'imap.mail.yahoo.com',
                    smtpServer: 'smtp.mail.yahoo.com',
                    imapPort: '993',
                    smtpPort: '465'
                }));
                setStep('server');
            } else {
                // Fallback to manual
                setStep('server');
            }
            setLoading(false);
        }, 1500);
    };

    const handleTestConnection = async () => {
        setLoading(true);
        setStep('testing');
        setError('');

        // Simulate connection test
        setTimeout(() => {
            // For now, just succeed
            // In real implementation, this would call the backend
            onSave(formData);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-gray-200 rounded-full transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <h3 className="font-semibold text-gray-800">Configure IMAP Account</h3>
            </div>

            <div className="p-6">
                {step === 'credentials' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="user@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {initialConfig?.provider === 'gmail' ? (
                                    <span>
                                        Use an <strong>App Password</strong>, not your regular password.
                                        <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                            Get one here &rarr;
                                        </a>
                                    </span>
                                ) : initialConfig?.provider === 'outlook' ? (
                                    <span>
                                        Use an <strong>App Password</strong> if 2FA is enabled.
                                        <a href="https://account.live.com/proofs/manage/additional" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                            Manage here &rarr;
                                        </a>
                                    </span>
                                ) : (
                                    "For iCloud, Yahoo, etc., use an App-Specific Password."
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Domain Filter (Optional)</label>
                            <input
                                type="text"
                                name="domainFilter"
                                value={formData.domainFilter}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example.com, company.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Only import emails from these domains. Leave empty to import all.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleAutoDetect}
                                disabled={!formData.email || !formData.password || loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'server' && (
                    <div className="space-y-6">
                        {/* IMAP Settings */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Incoming Mail (IMAP)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Server Hostname</label>
                                    <input
                                        type="text"
                                        name="imapServer"
                                        value={formData.imapServer}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Port</label>
                                    <input
                                        type="text"
                                        name="imapPort"
                                        value={formData.imapPort}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Security</label>
                                    <select
                                        name="imapSecurity"
                                        value={formData.imapSecurity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="ssl">SSL/TLS</option>
                                        <option value="starttls">STARTTLS</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SMTP Settings */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Outgoing Mail (SMTP)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Server Hostname</label>
                                    <input
                                        type="text"
                                        name="smtpServer"
                                        value={formData.smtpServer}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Port</label>
                                    <input
                                        type="text"
                                        name="smtpPort"
                                        value={formData.smtpPort}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Security</label>
                                    <select
                                        name="smtpSecurity"
                                        value={formData.smtpSecurity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="ssl">SSL/TLS</option>
                                        <option value="starttls">STARTTLS</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={() => setStep('credentials')}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleTestConnection}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Test Connection
                            </button>
                        </div>
                    </div>
                )}

                {step === 'testing' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900">Testing Connection...</h4>
                            <p className="text-gray-500">Verifying credentials and server settings</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

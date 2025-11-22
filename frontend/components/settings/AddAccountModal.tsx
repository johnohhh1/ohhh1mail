'use client';

import { X, Mail, Server } from 'lucide-react';

interface AddAccountModalProps {
    onClose: () => void;
    onSelectType: (type: 'gmail' | 'outlook' | 'imap') => void;
}

export default function AddAccountModal({ onClose, onSelectType }: AddAccountModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Add Email Account</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <button
                        onClick={() => onSelectType('gmail')}
                        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group text-left"
                    >
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-200 transition">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Google / Gmail</div>
                            <div className="text-sm text-gray-500">Connect via App Password</div>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelectType('outlook')}
                        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group text-left"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Microsoft Outlook</div>
                            <div className="text-sm text-gray-500">Connect via App Password</div>
                        </div>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or manually configure</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onSelectType('imap')}
                        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition group text-left"
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition">
                            <Server className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">IMAP / SMTP</div>
                            <div className="text-sm text-gray-500">Any email provider</div>
                        </div>
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                    We support most major email providers including iCloud, Yahoo, and Fastmail.
                </div>
            </div>
        </div>
    );
}

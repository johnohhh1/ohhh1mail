'use client';

import { Search, Star, Sparkles } from 'lucide-react';

interface Email {
  id: number;
  from_address: string;
  from_name?: string;
  subject: string;
  ai_summary: string;
  preview: string;
  is_read: boolean;
  is_starred: boolean;
  received_at: string;
}

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function EmailList({
  emails,
  onSelectEmail,
  searchQuery,
  onSearchChange,
}: EmailListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return '1d ago';
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No emails found. Try syncing your inbox!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                  email.is_read ? '' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        email.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}
                    >
                      {email.from_name || email.from_address}
                    </span>
                    {email.is_starred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(email.received_at)}
                  </span>
                </div>
                <div className={`text-sm mb-2 ${email.is_read ? '' : 'font-medium'}`}>
                  {email.subject}
                </div>
                {email.ai_summary && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="italic">{email.ai_summary}</span>
                  </div>
                )}
                <div className="text-sm text-gray-500 truncate">{email.preview}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

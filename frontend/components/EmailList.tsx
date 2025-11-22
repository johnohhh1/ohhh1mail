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
  selectedEmailId?: number;
}

export default function EmailList({
  emails,
  onSelectEmail,
  searchQuery,
  onSearchChange,
  selectedEmailId
}: EmailListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-md text-sm focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-sm">No emails found</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`group flex items-center px-4 py-3 cursor-pointer transition-colors ${selectedEmailId === email.id
                    ? 'bg-blue-50/50'
                    : 'hover:bg-gray-50'
                  } ${!email.is_read ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                {/* Sender */}
                <div className={`w-48 flex-shrink-0 truncate text-sm ${!email.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}>
                  {email.from_name || email.from_address}
                </div>

                {/* Subject & Preview */}
                <div className="flex-1 min-w-0 mx-4 flex items-center text-sm">
                  <span className={`truncate ${!email.is_read ? 'font-medium text-gray-900' : 'text-gray-700'
                    }`}>
                    {email.subject}
                  </span>
                  <span className="mx-2 text-gray-300">-</span>
                  <span className="truncate text-gray-500">
                    {email.preview}
                  </span>
                  {email.ai_summary && (
                    <Sparkles className="w-3 h-3 text-purple-400 ml-2 flex-shrink-0" />
                  )}
                </div>

                {/* Date & Actions */}
                <div className="flex-shrink-0 flex items-center gap-3 pl-2">
                  <span className={`text-xs ${!email.is_read ? 'text-blue-600 font-medium' : 'text-gray-400'
                    }`}>
                    {formatTime(email.received_at)}
                  </span>
                  {email.is_starred && (
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Users, Star, Mail, Settings, RefreshCw, Inbox, PenSquare } from 'lucide-react';

interface SidebarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
  onCompose?: () => void;
  onSync?: () => void;
}

export default function Sidebar({ activeView, onViewChange, onCompose, onSync }: SidebarProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const categories = [
    { id: 'focused', name: 'Focused', icon: Zap },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'vip', name: 'VIP', icon: Star },
    { id: 'other', name: 'Other', icon: Mail },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8001/emails/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onSync?.();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50/50 h-screen flex flex-col border-r border-gray-200/60 backdrop-blur-xl">
      <div className="p-4">
        <button
          onClick={() => onCompose?.()}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-2.5 px-4 rounded-lg shadow-sm border border-gray-200/80 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <PenSquare className="w-4 h-4 text-blue-600" />
          Compose
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 space-y-0.5">
          <Link
            href="/inbox"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          >
            <Inbox className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            Inbox
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Smart Views
          </div>

          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeView === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onViewChange?.(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isActive
                    ? 'bg-gray-200/60 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  {category.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200/60 space-y-1">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm px-3 py-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
          Sync Emails
        </button>
        <Link
          href="/settings"
          className="w-full flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md text-sm px-3 py-2 transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </Link>
      </div>
    </div>
  );
}

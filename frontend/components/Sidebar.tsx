'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Users, Star, Mail, Send, Settings, RefreshCw } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCompose: () => void;
  onSync: () => void;
}

export default function Sidebar({ activeView, onViewChange, onCompose, onSync }: SidebarProps) {
  const router = useRouter();
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
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8001/emails/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
        onSync(); // Trigger parent refresh
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={onCompose}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center gap-2 transition-all"
        >
          <span className="text-xl font-light text-blue-600">+</span>
          Compose
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeView === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onViewChange(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                  {category.name}
                </div>
                {category.count > 0 && (
                  <span className="text-xs text-gray-500">{category.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm px-2 py-1 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Emails'}
        </button>
        <Link
          href="/settings"
          className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm px-2 py-1"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Zap, Send, Check, MoreHorizontal, Reply, Trash2, Archive } from 'lucide-react';
import { emailAPI, aiAPI } from '@/lib/api';

interface EmailDetailProps {
  email: any;
  onBack: () => void;
  onUpdate: () => void;
}

export default function EmailDetail({ email, onBack, onUpdate }: EmailDetailProps) {
  const [replyText, setReplyText] = useState('');
  const [quickReplies, setQuickReplies] = useState<any[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuickReplies = async () => {
    setIsGenerating(true);
    setShowQuickReplies(true);
    try {
      const data = await aiAPI.generateQuickReplies(email.id);
      setQuickReplies(data.replies || []);
    } catch (error) {
      console.error('Error generating replies:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReply = async (text: string) => {
    try {
      await emailAPI.sendEmail({
        to_address: email.from_address,
        subject: `Re: ${email.subject}`,
        body_text: text,
      });
      alert('Reply sent!');
      onUpdate();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  };

  const toggleStar = async () => {
    try {
      await emailAPI.starEmail(email.id, !email.is_starred);
      onUpdate();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            title="Back to Inbox"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <button
            className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
            title="Mark as unread"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleStar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Star
              className={`w-5 h-5 ${email.is_starred
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400'
                }`}
            />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {/* Subject */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 leading-tight">
            {email.subject}
          </h1>

          {/* Sender Info */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-sm">
                {(email.from_name || email.from_address)[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {email.from_name || email.from_address}
                </div>
                <div className="text-sm text-gray-500">
                  {email.from_address}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(email.received_at).toLocaleString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* AI Summary */}
          {email.ai_summary && (
            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">AI Summary</div>
                  <div className="text-sm text-purple-900/80 leading-relaxed">{email.ai_summary}</div>
                </div>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="prose prose-gray max-w-none mb-12 text-gray-800 leading-relaxed">
            <div className="whitespace-pre-wrap font-sans text-[15px]">
              {email.body_text}
            </div>
          </div>

          {/* Quick Replies & Reply Box */}
          <div className="border-t border-gray-100 pt-8">
            {!showQuickReplies ? (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={generateQuickReplies}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                >
                  <Zap className="w-4 h-4 text-purple-500" />
                  {isGenerating ? 'Thinking...' : 'Generate AI Replies'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                  <Reply className="w-4 h-4 text-gray-500" />
                  Reply
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {quickReplies.map((reply: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(reply.text)}
                    className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-blue-600">
                      {reply.tone}
                    </div>
                    <div className="text-sm text-gray-700 line-clamp-3 group-hover:text-gray-900">
                      {reply.text}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none min-h-[120px] text-sm"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => sendReply(replyText)}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

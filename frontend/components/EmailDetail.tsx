'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Zap, Send, Check } from 'lucide-react';
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
    <div className="flex-1 overflow-y-auto p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inbox
          </button>
          <button onClick={toggleStar}>
            <Star
              className={`w-6 h-6 ${
                email.is_starred
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{email.subject}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">
                  {email.from_name || email.from_address}
                </span>
                <span className="text-gray-400">•</span>
                <span>{email.from_address}</span>
              </div>
            </div>
          </div>

          {email.ai_summary && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-purple-900 mb-1">AI Summary</div>
                  <div className="text-purple-800">{email.ai_summary}</div>
                </div>
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {email.body_text}
          </div>
        </div>

        {/* Quick Replies */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Instant Reply</span>
          </div>

          {!showQuickReplies ? (
            <button
              onClick={generateQuickReplies}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isGenerating ? 'Generating replies...' : 'Generate Quick Replies'}
            </button>
          ) : (
            <div className="space-y-3 mb-4">
              {quickReplies.map((reply: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-blue-200 rounded-lg p-4 hover:border-blue-400 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-blue-600 uppercase mb-1">
                        {reply.tone}
                      </div>
                      <div className="text-gray-800">{reply.text}</div>
                    </div>
                    <button
                      onClick={() => sendReply(reply.text)}
                      className="ml-4 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Or write your own reply..."
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => sendReply(replyText)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

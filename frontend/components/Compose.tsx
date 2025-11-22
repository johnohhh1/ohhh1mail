'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { emailAPI, aiAPI } from '@/lib/api';

interface ComposeProps {
  onClose: () => void;
  onSent: () => void;
}

export default function Compose({ onClose, onSent }: ComposeProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const generateEmail = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const data = await aiAPI.composeEmail(aiPrompt);
      setBody(data.email_text || '');
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!to || !subject || !body) {
      alert('Please fill in all fields');
      return;
    }

    setIsSending(true);
    try {
      await emailAPI.sendEmail({
        to_address: to,
        subject: subject,
        body_text: body,
      });
      alert('Email sent!');
      onSent();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={sendEmail}
            disabled={isSending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none focus:border-blue-500"
          />

          {/* AI Prompt */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Write with AI</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tell AI what you want to write... (e.g., 'Thank the team for great Q4 results')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateEmail()}
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={generateEmail}
                disabled={isGenerating}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
            className="w-full h-96 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

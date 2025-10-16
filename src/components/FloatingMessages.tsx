'use client';

import { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface FloatingMessagesProps {
  unreadCount?: number;
}

export default function FloatingMessages({ unreadCount = 9 }: FloatingMessagesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // ✅ NEW

  // optional: Esc key se close + hide
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsVisible(false); // ✅ hide widget entirely
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // ❗️If hidden, render nothing (display: none effect)
  if (!isVisible) return null;

  const recentParticipants = [
    { id: '1', name: 'nomeer_ahsan', avatar: '/images/person-headshot.png' },
    { id: '2', name: 'faiq_afaq_18', avatar: '/images/portrait-avatar.png' },
    { id: '3', name: 'sarah_khan', avatar: '/images/person-headshot.png' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Messages Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-3 group"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="relative">
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
              {unreadCount}+
            </div>
          )}
        </div>
        <span className="font-medium">Messages</span>
        <div className="flex -space-x-2">
          {recentParticipants.slice(0, 3).map((p, i) => (
            <img
              key={p.id}
              src={p.avatar}
              alt={p.name}
              className="w-6 h-6 rounded-full border-2 border-gray-800"
              style={{ zIndex: recentParticipants.length - i }}
            />
          ))}
        </div>
      </button>

      {/* Messages Dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Messages"
          className="absolute bottom-16 right-0 bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-80 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Messages</h3>
              {/* ✅ Close & hide entire widget */}
              <button
                onClick={() => { setIsOpen(false); setIsVisible(false); }}
                className="text-gray-400 hover:text-white"
                aria-label="Close messages"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wide px-2 py-1 mb-2">
                Recent
              </div>
              {recentParticipants.map((p) => (
                <div key={p.id} className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium truncate">{p.name}</p>
                      <span className="text-gray-400 text-xs">2m</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">Hey! How are you doing?</p>
                  </div>
                  {p.id === '1' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              ))}
            </div>

            {/* Suggested */}
            <div className="p-2 border-t border-gray-700">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wide px-2 py-1 mb-2">
                Suggested for you
              </div>
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                <img src="/images/person-headshot.png" alt="Suggested user" className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium truncate">tech_guru_2024</p>
                    <span className="text-gray-400 text-xs">5m</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">Check out my latest post!</p>
                </div>
                <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">Follow</button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors text-sm font-medium">
              View All Messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

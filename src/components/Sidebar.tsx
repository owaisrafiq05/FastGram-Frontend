'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ add
import {
  HomeIcon, MagnifyingGlassIcon, MapIcon, PlayIcon,
  ChatBubbleLeftRightIcon, HeartIcon, PlusCircleIcon, UserCircleIcon,
  Bars3Icon, Squares2X2Icon, XMarkIcon,
} from '@heroicons/react/24/outline';

type NavId =
  | 'home' | 'search' | 'explore' | 'reels' | 'messages'
  | 'notifications' | 'create' | 'profile' | 'more' | 'also-from-meta';

interface SidebarProps { currentPage?: NavId }

export default function Sidebar({ currentPage = 'profile' }: SidebarProps) {
  const router = useRouter();                       // ✅ init router
  const [unreadMessages] = useState(9);
  const [active, setActive] = useState<NavId>(currentPage);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(['https_owais']);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ map nav IDs to routes (adjust to your folders)
  const routeById: Partial<Record<NavId, string>> = {
    home: '/Home',                 // or '/' if your home is app/page.tsx
    profile: '/UserProfile',      // rename folder to 'profile' if you want '/profile'
    explore: '/Explore',           // only if such pages exist
    reels: '/Reels',
    messages: '/Messages',
    notifications: '/Notifications',
    create: '/Create',
  };

  useEffect(() => {
    if (active === 'search') {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [active]);

  const navigationItems = useMemo(
    () => [
      { id: 'home' as const, label: 'Home', icon: HomeIcon },
      { id: 'search' as const, label: 'Search', icon: MagnifyingGlassIcon },
      { id: 'explore' as const, label: 'Explore', icon: MapIcon },
      { id: 'reels' as const, label: 'Reels', icon: PlayIcon },
      {
        id: 'messages' as const, label: 'Messages',
        icon: ChatBubbleLeftRightIcon, badge: unreadMessages > 0 ? `${unreadMessages}+` : null,
      },
      { id: 'notifications' as const, label: 'Notifications', icon: HeartIcon },
      { id: 'create' as const, label: 'Create', icon: PlusCircleIcon },
      { id: 'profile' as const, label: 'Profile', icon: UserCircleIcon },
    ],
    [unreadMessages]
  );

  const onClickItem = (id: NavId) => {
    if (id === 'search') {
      setActive(prev => (prev === 'search' ? currentPage : 'search'));
      return;
    }
    setActive(id);
    const href = routeById[id];
    if (href) router.push(href);   // ✅ navigate
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setRecent(prev => {
      const next = [query.trim(), ...prev.filter(r => r !== query.trim())];
      return next.slice(0, 8);
    });
    // optional: router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  };

  const removeRecent = (name: string) => setRecent(prev => prev.filter(r => r !== name));
  const clearAll = () => setRecent([]);

  return (
    <>
      {/* LEFT NAV BAR */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col z-30">
        {/* Logo (click to Home) */}
        <div className="p-6">
          <button
            onClick={() => { setActive('home'); router.push(routeById.home!); }}
            className="text-2xl italic font-bold text-white font-serif text-left"
          >
            FastGram
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onClickItem(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
                      isActive ? 'text-white bg-gray-800' : ''
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    <span className="font-medium">{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-gray-800 my-4" />

          {/* More */}
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => onClickItem('more')}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bars3Icon className="w-6 h-6 mr-3" />
                <span className="font-medium">More</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onClickItem('also-from-meta')}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Squares2X2Icon className="w-6 h-6 mr-3" />
                <span className="font-medium">Also from Meta</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom user */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center px-4 py-3">
            <img src="/images/portrait-avatar.png" alt="Profile" className="w-8 h-8 rounded-full mr-3" />
            <div>
              <div className="text-white font-medium text-sm">muhib_ali</div>
              <div className="text-gray-400 text-xs">Muhib Ali</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL (unchanged) */}
      {active === 'search' && (
        <div className="fixed top-0 left-64 h-full w-[24rem] bg-black border-r border-gray-800 z-20 flex flex-col" aria-label="Search panel">
          {/* ... existing search UI ... */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Search</h2>
              <button type="button" onClick={() => setActive(currentPage)} className="p-2 rounded hover:bg-gray-800" aria-label="Close search">
                <XMarkIcon className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mt-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-xl py-2.5 pl-4 pr-10 outline-none border border-gray-800 focus:border-gray-600"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200" aria-label="Clear query">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="border-t border-gray-800" />
          {/* ... recent list as you already have ... */}
        </div>
      )}
    </>
  );
}

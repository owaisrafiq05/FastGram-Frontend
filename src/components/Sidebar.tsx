'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatePostModal from './CreatePostModal';
import { mockCreatePost } from './../utils/mockApi';
import {
  HomeIcon, MagnifyingGlassIcon, MapIcon, PlayIcon,
  ChatBubbleLeftRightIcon, HeartIcon, PlusCircleIcon, UserCircleIcon,
  Cog6ToothIcon, Squares2X2Icon, XMarkIcon, UserGroupIcon,
} from '@heroicons/react/24/outline'; // ✅ replaced Bars3Icon with Cog6ToothIcon
import { logout } from '@/services/auth';
import { getUserByUsername } from '@/services/users';

type NavId =
  | 'home' | 'search' | 'explore' | 'reels' | 'messages'
  | 'notifications' | 'create' | 'profile' | 'groups' | 'settings' | 'also-from-meta'; // ✅ changed 'more' to 'settings'

interface SidebarProps { currentPage?: NavId }

export default function Sidebar({ currentPage = 'profile' }: SidebarProps) {
  const router = useRouter();
  const [unreadMessages] = useState(9);
  const [active, setActive] = useState<NavId>(currentPage);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(['https_owais']);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const routeById: Partial<Record<NavId, string>> = {
    home: '/Home',
    profile: '/UserProfile',
    explore: '/Explore',
    reels: '/Reels',
    messages: '/Messages',
    notifications: '/Notifications',
    create: '/Create',
    groups: '/Groups',
    settings: '/Settings', // ✅ optional: add a route if you have a settings page
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
      { id: 'groups' as const, label: 'Groups', icon: UserGroupIcon },
      { id: 'profile' as const, label: 'Profile', icon: UserCircleIcon },
    ],
    [unreadMessages]
  );

  const onClickItem = (id: NavId) => {
    if (id === 'search') {
      setActive(prev => (prev === 'search' ? currentPage : 'search'));
      return;
    }
    if (id === 'create') {
      setOpenCreate(true);
      setActive(id);
      return;
    }
    setActive(id);
    const href = routeById[id];
    if (href) router.push(href);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const name = query.trim();
    if (!name) return;
    setRecent(prev => {
      const next = [name, ...prev.filter(r => r !== name)];
      return next.slice(0, 8);
    });
    router.push(`/u/${encodeURIComponent(name)}`);
  };

  useEffect(() => {
    let t: any;
    if (active === 'search') {
      const name = query.trim();
      if (name.length >= 2) {
        setSearchLoading(true);
        setSearchResult(null);
        t = setTimeout(async () => {
          try {
            const res = await getUserByUsername(name);
            setSearchResult(res.data.user);
          } catch {
            setSearchResult(null);
          } finally {
            setSearchLoading(false);
          }
        }, 300);
      } else {
        setSearchResult(null);
        setSearchLoading(false);
      }
    }
    return () => t && clearTimeout(t);
  }, [active, query]);

  const removeRecent = (name: string) => setRecent(prev => prev.filter(r => r !== name));
  const clearAll = () => setRecent([]);

  return (
    <>
      {/* LEFT NAV BAR */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col z-30">
        {/* Logo */}
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
                    className={`w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-[#262626]  rounded-lg transition-colors ${isActive ? 'text-white bg-[#262626] ' : ''
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

          {/* ✅ Settings instead of More */}
          <ul className="space-y-1">
            <li>
              <button
               onClick={() => router.push('../UserEditProfile')}
                type="button"
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-[#262626]  rounded-lg transition-colors"
              >
                <Cog6ToothIcon className="w-6 h-6 mr-3" />
                <span className="font-medium">Settings</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={async () => { try { await logout(); } catch {} finally { router.push('/login'); } }}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
              >
                Logout
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

        {/* Bottom user (minimal) */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center px-4 py-3">
            <img src="/images/portrait-avatar.png" alt="Profile" className="w-8 h-8 rounded-full mr-3" />
            <div>
              <div className="text-white font-medium text-sm">Profile</div>
              <div className="text-gray-400 text-xs">Signed In</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL */}
      {active === 'search' && (
        <div className="fixed top-0 left-64 h-full w-[24rem] bg-black border-r border-gray-800 z-20 flex flex-col" aria-label="Search panel">
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
            <div className="mt-4">
              {searchLoading && (
                <div className="text-gray-400 text-sm">Searching…</div>
              )}
              {!searchLoading && query.trim().length >= 2 && !searchResult && (
                <div className="text-gray-500 text-sm">No user found</div>
              )}
              {!searchLoading && searchResult && (
                <button
                  onClick={() => router.push(`/u/${encodeURIComponent(searchResult.username)}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-[#262626] text-left"
                >
                  <img src={searchResult.profilePictureUrl || '/images/portrait-avatar.png'} alt={searchResult.username} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-white text-sm font-medium">{searchResult.username}</div>
                    <div className="text-xs text-gray-400">{searchResult.fullName}</div>
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="border-t border-gray-800" />
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </>
  );
}

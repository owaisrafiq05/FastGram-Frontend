'use client';

import { useState } from 'react';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  MapIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  PlusCircleIcon,
  UserCircleIcon,
  Bars3Icon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPage?: string;
}

export default function Sidebar({ currentPage = 'profile' }: SidebarProps) {
  const [unreadMessages] = useState(9);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, active: false },
    { id: 'search', label: 'Search', icon: MagnifyingGlassIcon, active: false },
    { id: 'explore', label: 'Explore', icon: MapIcon, active: false },
    { id: 'reels', label: 'Reels', icon: PlayIcon, active: false },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: ChatBubbleLeftRightIcon, 
      active: false,
      badge: unreadMessages > 0 ? `${unreadMessages}+` : null
    },
    { id: 'notifications', label: 'Notifications', icon: HeartIcon, active: false },
    { id: 'create', label: 'Create', icon: PlusCircleIcon, active: false },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon, active: currentPage === 'profile' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col">
      {/* Instagram Logo */}
      <div className="p-6">
        <h1 className="text-2xl italic font-bold text-white font-serif">FastGram</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${
                    item.active ? 'text-white bg-gray-800' : ''
                  }`}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Separator */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* More Options */}
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bars3Icon className="w-6 h-6 mr-3" />
              <span className="font-medium">More</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Squares2X2Icon className="w-6 h-6 mr-3" />
              <span className="font-medium">Also from Meta</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center px-4 py-3">
          <img
            src="/images/portrait-avatar.png"
            alt="Profile"
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="text-white font-medium text-sm">muhib_ali</div>
            <div className="text-gray-400 text-xs">Muhib Ali</div>
          </div>
        </div>
      </div>
    </div>
  );
}

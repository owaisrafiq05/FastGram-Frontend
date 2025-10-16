'use client';

import Sidebar from '@/components/Sidebar';
import UserProfileHeader from '@/components/UserProfileHeader';
import PostsGrid from '@/components/PostsGrid';
import FloatingMessages from '@/components/FloatingMessages';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar currentPage="profile" />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* User Profile Header */}
        <UserProfileHeader />
        
        {/* Posts Grid */}
        <PostsGrid />
      </div>
      
      {/* Floating Messages */}
      <FloatingMessages />
    </div>
  );
}

'use client';

import Sidebar from '@/components/Sidebar';
import UserProfileHeader from '@/components/UserProfileHeader';
import PostsGrid from '@/components/PostsGrid';
import FloatingMessages from '@/components/FloatingMessages';
import { useEffect, useState } from 'react';
import { getMyProfile, getUserByUsername } from '@/services/users';
import { getPostsByUsername } from '@/services/posts';

export default function UserProfilePage() {
  const [headerUser, setHeaderUser] = useState<any | null>(null);
  const [gridPosts, setGridPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMyProfile();
        const username = me.data.user.username;
        const pub = await getUserByUsername(username);
        const u = pub.data.user;
        const [firstName, ...rest] = (me.data.user.fullName || '').split(' ');
        const lastName = rest.join(' ');
        setHeaderUser({
          id: String(u.id),
          username: u.username,
          firstName: firstName || '',
          lastName: lastName || '',
          bio: u.bio,
          avatarUrl: u.profilePictureUrl,
          department: '',
          semester: 0,
          program: '',
          batchYear: new Date(u.createdAt).getFullYear(),
          followersCount: u.followersCount,
          followingCount: u.followingCount,
          postsCount: u.postsCount,
          isFollowing: false,
        });
        const first = await getPostsByUsername(username, 1, 9);
        setGridPosts(first.posts as any);
        setPage(2);
        const totalPages = first.pagination?.totalPages ?? 1;
        setHasMore(2 <= totalPages);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const onUpdated = (e: any) => {
      const updated = e?.detail as any;
      if (!updated) return;
      setGridPosts((prev) => prev.map((p: any) => (p.id === updated.id ? { ...p, content: updated.content } : p)));
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fg_post_updated', onUpdated as any);
      return () => window.removeEventListener('fg_post_updated', onUpdated as any);
    }
  }, []);

  useEffect(() => {
    const onUpdated = async () => {
      try {
        const me = await getMyProfile();
        const username = me.data.user.username;
        const pub = await getUserByUsername(username);
        const u = pub.data.user;
        const [firstName, ...rest] = (me.data.user.fullName || '').split(' ');
        const lastName = rest.join(' ');
        setHeaderUser({
          id: String(u.id),
          username: u.username,
          firstName: firstName || '',
          lastName: lastName || '',
          bio: u.bio,
          avatarUrl: u.profilePictureUrl,
          department: '',
          semester: 0,
          program: '',
          batchYear: new Date(u.createdAt).getFullYear(),
          followersCount: u.followersCount,
          followingCount: u.followingCount,
          postsCount: u.postsCount,
          isFollowing: false,
        });
      } catch {}
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fg_profile_updated', onUpdated);
      return () => window.removeEventListener('fg_profile_updated', onUpdated);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar currentPage="profile" />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* User Profile Header */}
        <UserProfileHeader userProfile={headerUser ?? undefined} isCurrentUser />
        
        {/* Posts Grid */}
        <PostsGrid posts={gridPosts as any} />
        {hasMore && (
          <div className="flex justify-center py-6">
            <button
              onClick={async () => {
                const username = headerUser?.username;
                if (!username) return;
                const res = await getPostsByUsername(username, page, 9);
                setGridPosts((p) => [...p, ...(res.posts as any)]);
                setPage((pg) => pg + 1);
                const totalPages = res.pagination?.totalPages ?? page;
                setHasMore(page < totalPages);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Load more
            </button>
          </div>
        )}
      </div>
      
      {/* Floating Messages */}
      <FloatingMessages />
    </div>
  );
}

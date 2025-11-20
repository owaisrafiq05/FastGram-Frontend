'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserProfileHeader from '@/components/UserProfileHeader';
import PostsGrid from '@/components/PostsGrid';
import FloatingMessages from '@/components/FloatingMessages';
import { getUserByUsername, getMyProfile, listFollowing } from '@/services/users';
import { getPostsByUsername } from '@/services/posts';

export default function PublicUserPage() {
  const { username } = useParams() as { username: string };
  const [userHeader, setUserHeader] = useState<any | null>(null);
  const [gridPosts, setGridPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pub = await getUserByUsername(username);
        if (!mounted) return;
        const u = pub.data.user;
        const names = (u.fullName || '').split(' ');
        const first = names[0] || '';
        const last = names.slice(1).join(' ');
        let isFollowing = false;
        try {
          const me = await getMyProfile();
          const myUsername = me.data.user.username;
          const following = await listFollowing(myUsername, 1, 100);
          const arr = (following?.data?.following ?? following?.data?.followers ?? []) as any[];
          isFollowing = Array.isArray(arr) && arr.some((f) => f?.username === username);
        } catch {}

        setUserHeader({
          id: String(u.id),
          username: u.username,
          firstName: first,
          lastName: last,
          bio: u.bio,
          avatarUrl: u.profilePictureUrl,
          department: '',
          semester: 0,
          program: '',
          batchYear: new Date(u.createdAt).getFullYear(),
          followersCount: u.followersCount,
          followingCount: u.followingCount,
          postsCount: u.postsCount,
          isFollowing,
        });
        const firstPage = await getPostsByUsername(username, 1, 9);
        setGridPosts(firstPage.posts as any);
        setPage(2);
        const totalPages = firstPage.pagination?.totalPages ?? 1;
        setHasMore(2 <= totalPages);
        setLoading(false);
      } catch (e: any) {
        setErrorMsg(e?.message || 'Failed to load profile');
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar currentPage="profile" />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="animate-spin inline-block w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full" />
            <span className="text-gray-300">Loading…</span>
          </div>
        </div>
        <FloatingMessages />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar currentPage="profile" />
      <div className="flex-1 ml-64">
        {errorMsg ? (
          <div className="p-12 text-center text-red-400">{errorMsg}</div>
        ) : (
          <>
            <UserProfileHeader userProfile={userHeader ?? undefined} isCurrentUser={false} />
            <PostsGrid posts={gridPosts as any} />
            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={async () => {
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
          </>
        )}
      </div>
      <FloatingMessages />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Category, PostDetail } from './../types/posts';
import { mockGetFeed, mockDeletePost } from '@/utils/mockApi';
import PostCard from '@/components/PostCard';
import PostDetailDrawer from '@/components/PostDetailDrawer';
import ConfirmDialog from '@/components/ConfirmDialog';

const tabs: { key?: Category; label: string }[] = [
  { label: 'All' },
  { key: 'academic', label: 'Academic' },
  { key: 'social', label: 'Social' },
  { key: 'announcement', label: 'Announcement' },
  { key: 'event', label: 'Event' },
  { key: 'general', label: 'General' },
];

export default function Feed() {
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  // initial load + on category change
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await mockGetFeed({ limit: 5, offset: 0, category });
      setPosts(res.data.posts);
      setOffset(res.data.posts.length);
      setHasMore(res.data.hasMore);
      setLoading(false);
    })();
  }, [category]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const res = await mockGetFeed({ limit: 5, offset, category });
    setPosts((p) => [...p, ...res.data.posts]);
    setOffset((o) => o + res.data.posts.length);
    setHasMore(res.data.hasMore);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!openDeleteId) return;
    const id = openDeleteId;
    setOpenDeleteId(null);

    // optimistic remove
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selected === id) setSelected(null);

    // mock backend (later replace with DELETE /posts/:id)
    const res = await mockDeletePost(id);
    if (!res.success) {
      // optional rollback/toast
      console.warn('Delete failed (mock).');
    }
  };

  return (
    <>
      {/* ===== Filters header (CATEGORIES) ===== */}
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur border-b border-gray-900">
        <div className="flex gap-2 px-2 py-2">
          {tabs.map((t) => {
            const active = t.key ? category === t.key : category === undefined;
            return (
              <button
                key={t.label}
                onClick={() => setCategory(t.key)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Feed list ===== */}
      <div className="space-y-6 mt-4">
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onOpenDetail={() => setSelected(p.id)}
            onRequestDelete={(id) => setOpenDeleteId(id)}
          />
        ))}

        {hasMore && (
          <div className="flex justify-center py-6">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}

        {!posts.length && !loading && (
          <div className="text-center text-gray-400 py-12">No posts yet.</div>
        )}
      </div>

      {/* ===== Detail drawer ===== */}
      <PostDetailDrawer
        postId={selected}
        onClose={() => setSelected(null)}
        onRequestDelete={(id) => setOpenDeleteId(id)}
      />

      {/* ===== Delete confirm ===== */}
      <ConfirmDialog
        open={!!openDeleteId}
        title="Delete post?"
        message="This action cannot be undone. The post will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDeleteId(null)}
      />
    </>
  );
}

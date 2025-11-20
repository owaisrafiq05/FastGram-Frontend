'use client';

import { useEffect, useState } from 'react';
import { Category, PostDetail } from './../types/posts';
import { getFeedTimeline, deletePost } from '@/services/posts';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  // initial load + on category change
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await getFeedTimeline(1, 10);
      if (!mounted) return;
      setPosts(res.posts);
      setPage(2);
      setHasMore(res.posts.length > 0);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [category]);

  useEffect(() => {
    const handler = (e: any) => {
      const post = e?.detail as PostDetail;
      if (post) setPosts((prev) => [post, ...prev]);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fg_post_created', handler as any);
      return () => window.removeEventListener('fg_post_created', handler as any);
    }
  }, []);

  useEffect(() => {
    const onUpdated = (e: any) => {
      const updated = e?.detail as PostDetail;
      if (!updated) return;
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, content: updated.content } : p)));
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('fg_post_updated', onUpdated as any);
      return () => window.removeEventListener('fg_post_updated', onUpdated as any);
    }
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await getFeedTimeline(page, 10);
    setPosts((p) => [...p, ...res.posts]);
    setPage((pg) => pg + 1);
    setHasMore(res.posts.length > 0);
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!openDeleteId) return;
    const id = openDeleteId;
    setOpenDeleteId(null);

    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selected === id) setSelected(null);
    try {
      await deletePost(id);
    } catch {}
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
            onRequestDelete={(id) => setOpenDeleteId(id)} // only mine will trigger inside PostCard
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
        onRequestDelete={(id) => setOpenDeleteId(id)} // delete from inside drawer (only mine)
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

'use client';

import { useEffect, useState } from 'react';
import { PostComment } from './../types/posts';
import { addComment as apiAddComment, getComments as apiGetComments, deleteComment as apiDeleteComment } from '@/services/posts';

export default function PostComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load first page whenever postId changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await apiGetComments(postId, 1, 10);
      if (!mounted) return;
      setComments(res.comments as any);
      setTotal(res.pagination?.totalComments ?? res.comments.length);
      setHasMore((res.pagination?.page ?? 1) < (res.pagination?.totalPages ?? 1));
      setPage(2);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [postId]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await apiGetComments(postId, page, 10);
    setComments((prev) => [...prev, ...(res.comments as any)]);
    setHasMore((res.pagination?.page ?? page) < (res.pagination?.totalPages ?? page));
    setPage((pg) => pg + 1);
    setLoading(false);
  };

  const addComment = async () => {
    const text = input.trim();
    if (!text) return;
    setSending(true);

    const tempId = `temp_${Date.now()}`;
    const optimistic: PostComment = {
      id: tempId,
      user: {
        id: 'u_me',
        username: '_muhib_ali_',
        firstName: 'Muhib',
        lastName: 'Ali',
        avatarUrl: '/images/portrait-avatar.png',
      },
      text,
      createdAt: new Date().toISOString(),
      canDelete: true,
    };

    setComments((prev) => [optimistic, ...prev]);
    setTotal((t) => t + 1);
    setInput('');

    try {
      const created = await apiAddComment(postId, text);
      setComments((prev) => prev.map((c) => (c.id === tempId ? (created as any) : c)));
    } finally {
      setSending(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment? This cannot be undone.')) return;
    if (deletingId) return;
    setDeletingId(id);

    const snapshot = comments;
    setComments((prev) => prev.filter((c) => c.id !== id));
    setTotal((t) => Math.max(0, t - 1));

    try {
      await apiDeleteComment(postId, id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Comments list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.user.avatarUrl || '/images/person-headshot.png'}
              className="w-7 h-7 rounded-full"
              alt={c.user.username}
            />
            <div className="text-sm flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-semibold mr-2">{c.user.username}</span>
                  <span className="break-words">{c.text}</span>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                    {typeof c.repliesCount === 'number' && c.repliesCount > 0 && (
                      <span className="ml-2 text-blue-400 cursor-pointer">
                        View {c.repliesCount} replies
                      </span>
                    )}
                  </div>
                </div>

                {(c.canDelete || c.user?.id === 'u_me') && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    disabled={deletingId === c.id}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 disabled:opacity-60 flex-none"
                    title="Delete comment"
                  >
                    {deletingId === c.id ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!comments.length && !loading && (
          <div className="text-gray-500 text-sm">No comments yet. Be the first to comment!</div>
        )}

        {hasMore && (
          <div className="pt-3">
            <button
              onClick={loadMore}
              disabled={loading}
              className="text-blue-400 text-sm hover:text-blue-300 disabled:opacity-60"
            >
              {loading ? 'Loading…' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addComment();
            }}
            aria-label="Add a comment"
          />
          <button
            onClick={addComment}
            disabled={sending || !input.trim()}
            className="text-sm text-blue-500 hover:text-blue-400 font-semibold disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PostDetail } from './../types/posts';
import { getPost } from '@/services/posts';
import { updatePostCaption } from '@/services/posts';
import PostComments from '@/components/PostComments';

export default function PostDetailDrawer({
  postId,
  onClose,
  onRequestDelete,                      // ✅ NEW
}: {
  postId: string | null;
  onClose: () => void;
  onRequestDelete?: (id: string) => void; // ✅ NEW
}) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const res = await getPost(postId);
      setPost(res as any);
      setCaption(res.content || '');
    })();
  }, [postId]);

  if (!postId) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[860px] max-w-[95vw] bg-black border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="text-white font-semibold">Post</div>
          <div className="flex items-center gap-2">
            {post && post.canDelete &&  (
              <button
                onClick={() => onRequestDelete?.(post.id)}   // ✅ call parent trigger
                className="px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-500 text-white"
              >
                Delete
              </button>
            )}
            {post && post.canDelete && (
              <button
                onClick={() => setEditing((v)=>!v)}
                className="px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 text-white"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-800" aria-label="Close">
              <XMarkIcon className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {editing && post && (
          <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
            <input
              value={caption}
              onChange={(e)=>setCaption(e.target.value)}
              maxLength={2200}
              className="flex-1 bg-black border border-gray-700 rounded p-2 text-sm text-white"
            />
            <button
              disabled={saving}
              onClick={async ()=>{
                if (!post) return;
                setSaving(true);
                try {
                  const updated = await updatePostCaption(post.id, caption);
                  setPost(updated as any);
                  setEditing(false);
                  try {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('fg_post_updated', { detail: updated }));
                    }
                  } catch {}
                } catch {} finally {
                  setSaving(false);
                }
              }}
              className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}

        {/* Body */}
        {!post ? (
          <div className="h-full flex items-center justify-center text-gray-400">Loading…</div>
        ) : (
          <div className="grid grid-cols-2 h-[calc(100%-49px)]">
            <div className="border-r border-gray-800 overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.mediaUrls[0] || '/images/placeholder-image.png'}
                alt=""
                className="max-h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.avatarUrl || '/images/portrait-avatar.png'}
                    className="w-8 h-8 rounded-full"
                    alt={post.user.username}
                  />
                </div>
                <p className="text-sm mt-3 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* <div className="flex-1 overflow-auto p-4 space-y-3">
                {(post.comments || []).map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <img
                      src={c.user.avatarUrl || '/images/person-headshot.png'}
                      className="w-7 h-7 rounded-full"
                      alt={c.user.username}
                    />
                    <div className="text-sm">
                      <span className="font-semibold mr-2">{c.user.username}</span>
                      {c.text}
                      <div className="text-[11px] text-gray-500 mt-1">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}
              <PostComments postId={post.id} />

              <div className="p-3 border-t border-gray-800">
                <input
                  placeholder="Add a comment…"
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

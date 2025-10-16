'use client';

import Image from 'next/image';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { PostDetail } from './../types/posts'; // ✅ fix path

export default function PostCard({
  post,
  onOpenDetail,
  onRequestDelete, // ✅ delete trigger from parent (Feed)
}: {
  post: PostDetail;
  onOpenDetail?: () => void;
  onRequestDelete?: (id: string) => void;
}) {
  const [liked, setLiked] = useState(post.isLiked);

  return (
    <article className="border border-gray-800 rounded-lg overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatarUrl || '/images/portrait-avatar.png'}
            alt={post.user.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">{post.user.username}</div>
            <div className="text-[11px] text-gray-400">{post.category}</div>
          </div>
        </div>

        {/* More (tap to request delete) */}
        <button
          className="p-2 rounded hover:bg-gray-800"
          onClick={() => onRequestDelete?.(post.id)} // ✅ just call it
          aria-label="More"
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* media (first only for feed) */}
      <div className="relative w-full bg-black">
        <Image
          src={post.mediaUrls[0] || '/images/placeholder-image.png'}
          alt="post"
          width={1080}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`p-1 rounded hover:bg-gray-800 ${
                liked ? 'text-red-500' : 'text-white'
              }`}
              aria-label="Like"
            >
              <HeartIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onOpenDetail}
              className="p-1 rounded hover:bg-gray-800"
              aria-label="Comment"
            >
              <ChatBubbleOvalLeftIcon className="w-6 h-6" />
            </button>
            <button className="p-1 rounded hover:bg-gray-800" aria-label="Share">
              <PaperAirplaneIcon className="w-6 h-6 -rotate-12" />
            </button>
          </div>
          <button className="p-1 rounded hover:bg-gray-800" aria-label="Save">
            <BookmarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-2 text-sm">
          {post.likesCount + (liked && !post.isLiked ? 1 : 0)} likes
        </div>

        <p className="mt-1 text-sm">
          <span className="font-semibold mr-2">{post.user.username}</span>
          {post.content}
        </p>

        <button
          onClick={onOpenDetail}
          className="mt-1 text-xs text-gray-400 hover:text-gray-300"
        >
          View all {post.commentsCount} comments
        </button>
      </div>
    </article>
  );
}

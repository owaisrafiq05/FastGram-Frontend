'use client';

import Sidebar from '@/components/Sidebar';
import FloatingMessages from '@/components/FloatingMessages';
import {
  EllipsisHorizontalIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

type Story = { id: string; name: string; avatar: string; hasNew?: boolean };
type Post = {
  id: string;
  author: { username: string; avatar: string };
  image: string;
  likedBy?: string;
  caption?: string;
  time: string; // e.g. "1h"
};

const mockStories: Story[] = [
  { id: 's1', name: 'slumpedat...', avatar: '/images/person-headshot.png', hasNew: true },
  { id: 's2', name: 'theengine...', avatar: '/images/portrait-avatar.png', hasNew: true },
  { id: 's3', name: 'hira3068', avatar: '/images/person-headshot.png' },
  { id: 's4', name: 'shahsaad.s', avatar: '/images/portrait-avatar.png' },
  { id: 's5', name: 'shrutzhaas...', avatar: '/images/person-headshot.png' },
  { id: 's6', name: 'engr.tahas...', avatar: '/images/portrait-avatar.png' },
];

type FeedPostType = Post;

const mockPosts: FeedPostType[] = [
  {
    id: 'p1',
    author: { username: 'backdoor_security_agency', avatar: '/images/portrait-avatar.png' },
    image: '/images/social-media-post.png',
    likedBy: 'sec_ops_daily',
    caption:
      'Windows 10 — End of Support. No more security updates. Upgrade now and stay safe.',
    time: '1h',
  },
  {
    id: 'p2',
    author: { username: 'art.sketches', avatar: '/images/person-headshot.png' },
    image: '/images/community-badge.jpg',
    likedBy: 'designer_hub',
    caption: 'Shading practice ✏️',
    time: '3h',
  },
];

const suggestions = [
  { id: 'u1', name: 'mahnoorandmore', sub: 'Followed by faiq_afaq_18', avatar: '/images/person-headshot.png' },
  { id: 'u2', name: 'emaan_2153', sub: 'Followed by faiq_afaq_18', avatar: '/images/portrait-avatar.png' },
  { id: 'u3', name: 'lushaura.1', sub: 'Suggested for you', avatar: '/images/person-headshot.png' },
  { id: 'u4', name: 'arsalanmarkar', sub: 'Followed by o.w.a.i.s + 4 more', avatar: '/images/person-headshot.png' },
  { id: 'u5', name: 'procomdaily', sub: 'Followed by faiq_afaq_18 + 1 more', avatar: '/images/portrait-avatar.png' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <Sidebar currentPage="home" />

      {/* Main content area */}
      <div className="flex-1 ml-64">
        <div className="mx-auto max-w-5xl px-4 xl:px-0">
          <div className="flex gap-8">
            {/* Center feed */}
            <main className="flex-1 max-w-2xl mx-auto">
              <StoriesBar stories={mockStories} />

              <div className="space-y-6 mt-6 pb-10">
                {mockPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </div>
            </main>

            {/* Right rail (suggestions) */}
            <aside className="hidden lg:block w-[360px] pt-6">
              <ProfileMini />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm font-semibold">Suggested for you</h3>
                  <button className="text-xs text-gray-400 hover:text-gray-200">See All</button>
                </div>

                <div className="space-y-3">
                  {suggestions.map((s) => (
                    <SuggestionRow key={s.id} name={s.name} sub={s.sub} avatar={s.avatar} />
                  ))}
                </div>

                <div className="text-[11px] text-gray-500 mt-8 space-x-2">
                  <span>About</span>
                  <span>Help</span>
                  <span>Press</span>
                  <span>API</span>
                  <span>Jobs</span>
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Locations</span>
                  <span>Language</span>
                  <span>Meta Verified</span>
                </div>

                <div className="text-[11px] text-gray-500 mt-4">
                  &copy; 2025 FASTGRAM FROM META
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Floating messages */}
      <FloatingMessages />
    </div>
  );
}

/* ------------------------- sub-components ------------------------- */

function StoriesBar({ stories }: { stories: Story[] }) {
  return (
    <div className="pt-6">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center shrink-0">
            <div
              className={`w-[66px] h-[66px] rounded-full p-[2px] ${
                s.hasNew
                  ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500'
                  : 'bg-gray-700'
              }`}
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-gray-300 mt-2 max-w-[70px] truncate">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedPost({ post }: { post: FeedPostType }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">{post.author.username}</div>
            <div className="text-[11px] text-gray-400">{post.time}</div>
          </div>
        </div>
        <button className="p-2 rounded hover:bg-gray-800" aria-label="More">
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full bg-black">
        <Image
          src={post.image}
          alt="post"
          width={1080}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked((v) => !v)}
              className={`p-1 rounded hover:bg-gray-800 ${liked ? 'text-red-500' : 'text-white'}`}
              aria-label="Like"
            >
              <HeartIcon className="w-6 h-6" />
            </button>
            <button className="p-1 rounded hover:bg-gray-800" aria-label="Comment">
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

        {/* Likes */}
        {post.likedBy && (
          <div className="mt-2 text-sm">
            Liked by <span className="font-semibold">{post.likedBy}</span> and others
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="mt-1 text-sm">
            <span className="font-semibold mr-2">{post.author.username}</span>
            {post.caption}
          </p>
        )}

        {/* Add a comment */}
        <div className="flex items-center gap-2 mt-3 py-2 border-t border-gray-800">
          <FaceSmileIcon className="w-6 h-6 text-gray-400" />
          <input
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          <button className="text-sm text-blue-500 hover:text-blue-400 font-semibold">Post</button>
        </div>
      </div>
    </article>
  );
}

function ProfileMini() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="/images/portrait-avatar.png"
          alt="_muhib_ali_"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="leading-tight">
          <div className="text-sm font-semibold">_muhib_ali_</div>
          <div className="text-xs text-gray-400">Muhib Ali</div>
        </div>
      </div>
      <button className="text-blue-500 text-sm font-semibold hover:text-blue-400">Switch</button>
    </div>
  );
}

function SuggestionRow({ name, sub, avatar }: { name: string; sub: string; avatar: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
        <div className="leading-tight">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-400">{sub}</div>
        </div>
      </div>
      <button className="text-blue-500 text-sm font-semibold hover:text-blue-400">Follow</button>
    </div>
  );
}

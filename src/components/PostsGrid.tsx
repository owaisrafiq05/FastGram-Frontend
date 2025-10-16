'use client';

import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/24/outline';

type Post = {
  id: string;
  imageUrl: string;
  type: 'image' | 'reel';
  caption?: string;
  likes: number;
  comments: number;
};

type PostsGridProps = {
  posts?: Post[];
};

const mockPosts: Post[] = [
  { id: '1', imageUrl: '/images/social-media-post.png', type: 'reel', caption: '#Tum hi ho', likes: 245, comments: 12 },
  { id: '2', imageUrl: '/images/team-badge.png', type: 'image', caption: 'Team Badge', likes: 189, comments: 8 },
  { id: '3', imageUrl: '/images/community-badge.jpg', type: 'image', caption: 'Community Badge', likes: 156, comments: 15 },
  { id: '4', imageUrl: '/images/person-headshot.png', type: 'image', caption: 'Person Headshot', likes: 298, comments: 22 },
  { id: '5', imageUrl: '/images/portrait-avatar.png', type: 'image', caption: 'Portrait Avatar', likes: 423, comments: 31 },
  { id: '6', imageUrl: '/images/heart-icon-on-teal.jpg', type: 'reel', caption: 'Heart Icon', likes: 167, comments: 9 },
];

export default function PostsGrid({ posts }: PostsGridProps) {
  const displayPosts = posts?.length ? posts : mockPosts;

  return (
    <div className="bg-black">
      <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
        {displayPosts.map((post, index) => (
          <div key={post.id} className="relative aspect-square group cursor-pointer bg-gray-800 rounded-sm overflow-hidden">
            <Image
              src={post.imageUrl || '/images/placeholder-image.png'}
              alt={post.caption || `Post ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 320px"
              className="object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.src = '/images/placeholder-image.png';
              }}
              priority={index < 6}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-6 text-white">
                <div className="flex items-center space-x-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold">{post.comments}</span>
                </div>
              </div>
            </div>

            {post.type === 'reel' && (
              <div className="absolute top-2 right-2">
                <PlayIcon className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            )}

            {post.type === 'reel' && post.caption && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                  <p className="text-white text-xs font-medium">{post.caption}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center py-8">
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
          Load More Posts
        </button>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Cog6ToothIcon, PlusIcon, PlayIcon } from '@heroicons/react/24/outline';

type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  department: string;
  semester: number;
  program: string;
  batchYear: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
};

type Props = {
  userProfile?: UserProfile;
  /** pass true if viewing own profile; else false */
  isCurrentUser?: boolean;
};

export default function UserProfileHeader({ userProfile, isCurrentUser = true }: Props) {
  // ---- Mock (used only when userProfile prop not provided) ----
  const mockProfile: UserProfile = {
    id: '1',
    username: '_muhib_ali',
    firstName: 'Muhib',
    lastName: 'Ali',
    bio:
      "Software Engineer from Karachi, Pk 🇵🇰\n" +
      "10x National Hackathon Winner 💻\n" +
      "Engineering @NovaSphere Sol\n" +
      "🎓 FAST NUCES '27\n" +
      '🔗 https_owais',
    avatarUrl: '/images/portrait-avatar.png',
    department: 'Computer Science',
    semester: 7,
    program: 'BSCS',
    batchYear: 2027,
    followersCount: 70,
    followingCount: 94,
    postsCount: 3,
    isFollowing: false,
  };

  // Prefer prop, else mock
  const profile = useMemo(() => userProfile ?? mockProfile, [userProfile]);

  // Follow state seeds from profile
  const [isFollowing, setIsFollowing] = useState<boolean>(!!profile.isFollowing);

  // Handlers
  const toggleFollow = () => setIsFollowing((v) => !v);

  return (
    <>
    <div className='flex justify-center items-center'>
          <div className="bg-black text-white">
      {/* Profile Header */}
      <div className="px-6 py-6">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatarUrl || '/images/portrait-avatar.png'}
              alt={`${profile.username} avatar`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
            />
            <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
              Note...
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            {/* Username + settings */}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">{profile.username}</h1>

              {/* Settings always visible (you can gate behind isCurrentUser if you want) */}
              <button
                type="button"
                aria-label="Settings"
                className="p-1 rounded hover:bg-gray-800/60 transition"
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Real name */}
            <div className="mb-4">
              <h2 className="text-lg font-normal">
                {profile.firstName} {profile.lastName}
              </h2>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-4 text-sm">
              <div>
                <span className="font-semibold">{profile.postsCount}</span> posts
              </div>
              <div>
                <span className="font-semibold">{profile.followersCount}</span> followers
              </div>
              <div>
                <span className="font-semibold">{profile.followingCount}</span> following
              </div>
            </div>

            {/* Actions: current user vs other user */}
            <div className="flex gap-3 mb-4">
              {isCurrentUser ? (
                <>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
                    aria-label="Create new"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleFollow}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-600 hover:bg-gray-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Message
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors"
                    aria-label="More"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bio */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {profile.bio || ''}
            </div>

            {/* Followed by (static demo) */}
            <div className="flex items-center mt-4 text-sm">
              <div className="flex -space-x-2 mr-3">
                <img
                  src="/images/person-headshot.png"
                  alt="Follower"
                  className="w-6 h-6 rounded-full border-2 border-black"
                />
                <img
                  src="/images/person-headshot.png"
                  alt="Follower"
                  className="w-6 h-6 rounded-full border-2 border-black"
                />
                <img
                  src="/images/person-headshot.png"
                  alt="Follower"
                  className="w-6 h-6 rounded-full border-2 border-black"
                />
              </div>
              <span className="text-gray-300">
                Followed by <span className="text-white font-medium">nomeer_ahsan</span>,
                <span className="text-white font-medium"> faiq_afaq_18</span> + 9 more
              </span>
            </div>
          </div>
        </div>

        {/* Story Highlights (demo) */}
        <div className="flex gap-6 mt-6">
          {[
            { icon: '🎓', label: 'Fast Uni Diar...' },
            { icon: '🎬', label: 'My World 🌎' },
            { icon: '❤️✨', label: '❤️✨' },
          ].map((h) => (
            <div key={h.label} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-lg">{h.icon}</span>
                </div>
              </div>
              <span className="text-xs mt-2 text-center">{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs (static icons for now) */}
      <div className="flex justify-center border-t border-gray-800">
        <div className="flex gap-8">
          <button className="py-4 px-2 border-t-2 border-white text-white" aria-label="Posts grid">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
            </svg>
          </button>
          <button className="py-4 px-2 text-gray-400 hover:text-white transition-colors" aria-label="Reels">
            <PlayIcon className="w-6 h-6" />
          </button>
          <button className="py-4 px-2 text-gray-400 hover:text-white transition-colors" aria-label="Stats">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </button>
          <button className="py-4 px-2 text-gray-400 hover:text-white transition-colors" aria-label="Tagged">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
    </>

  );
}

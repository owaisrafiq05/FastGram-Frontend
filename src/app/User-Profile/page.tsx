"use client"

import useSWR from "swr"
import Sidebar from "../components/Sidebar"
import { FaPlayCircle, FaBook, FaUserTag } from "react-icons/fa"
import { FaTableCellsLarge } from "react-icons/fa6"

type UserProfileData = {
  id: string
  username: string
  firstName: string
  lastName: string
  bio?: string
  avatarUrl?: string
  department: string
  semester: number
  program: string
  batchYear: number
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing?: boolean
}

type ApiResponse<T> = {
  success: true
  data: T
}

const mockApiResponse: ApiResponse<UserProfileData> = {
  success: true,
  data: {
    id: "u_001",
    username: "theinstagramexpert",
    firstName: "Sue",
    lastName: "Zimmerman",
    bio: "IG Marketing | Biz Coach\nTeaching women 45+ → Make Impact & Increase Income.",
    avatarUrl: "/placeholder-user.jpg",
    department: "Marketing",
    semester: 7,
    program: "BBA",
    batchYear: 2025,
    followersCount: 153000,
    followingCount: 301,
    postsCount: 2710,
    isFollowing: true,
  },
}

const fetchProfile = async (): Promise<ApiResponse<UserProfileData>> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockApiResponse), 250))
}

export default function UserProfilePage() {
  const { data, isLoading } = useSWR<ApiResponse<UserProfileData>>("user-profile:current", fetchProfile)

  const profile = data?.data
  const activeTab = "posts" // Declare the activeTab variable

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar avatarUrl={profile?.avatarUrl} username={profile?.username} />

      <main className="flex-1">
        {!profile || isLoading ? (
          <div className="p-10 text-muted-foreground">Loading…</div>
        ) : (
          <div className="mx-auto max-w-5xl px-6 py-8">
            {/* Header */}
            <section className="flex items-start gap-10">
              <div className="relative">
                {/* Story ring */}
                <div className="rounded-full p-[3px] bg-[conic-gradient(at_top_left,_#ff7a45,_#ffb347,_#ffd166)]">
                  <img
                    src={profile.avatarUrl || "/placeholder-user.jpg"}
                    alt="Profile avatar"
                    className="h-32 w-32 rounded-full object-cover bg-background border border-border"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold">{profile.username}</h1>

                  <button
                    className={`rounded-md border border-border px-3 py-1 text-sm font-medium ${
                      profile.isFollowing
                        ? "bg-muted hover:bg-muted/70"
                        : "bg-foreground text-background hover:opacity-90"
                    }`}
                    aria-label={profile.isFollowing ? "Following" : "Follow"}
                  >
                    {profile.isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    className="rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-muted/60"
                    aria-label="Message"
                  >
                    Message
                  </button>
                  <button
                    className="rounded-md border border-border px-3 py-1 text-sm font-medium hover:bg-muted/60"
                    aria-label="More options"
                    title="More"
                  >
                    …
                  </button>
                </div>

                <ul className="mt-4 flex flex-wrap gap-6 text-sm">
                  <li>
                    <strong className="font-semibold">{profile.postsCount.toLocaleString()}</strong> posts
                  </li>
                  <li>
                    <strong className="font-semibold">{profile.followersCount.toLocaleString()}</strong> followers
                  </li>
                  <li>
                    <strong className="font-semibold">{profile.followingCount.toLocaleString()}</strong> following
                  </li>
                </ul>

                <div className="mt-4">
                  <div className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </div>
                  {profile.bio ? (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{profile.bio}</p>
                  ) : null}
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{profile.department}</span> • {profile.program} •
                    Semester {profile.semester} • Batch {profile.batchYear}
                  </div>
                  <a href="#" className="mt-1 inline-block text-sm font-medium underline underline-offset-4">
                    fastgram.app/create
                  </a>
                </div>
              </div>
            </section>

            {/* Highlights */}
            <section className="mt-8">
              <ul className="flex items-center gap-6 overflow-x-auto pb-2">
                {highlightItems.map((h) => (
                  <li key={h.label} className="shrink-0 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full border border-border bg-muted p-[2px]">
                      <img
                        src={h.src || "/placeholder.svg"}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{h.label}</div>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="my-6 border-border" />

            {/* Tabs */}
            <section aria-label="Profile content tabs">
              <div className="flex items-center justify-center gap-8 text-xs tracking-wider">
                <button className="flex items-center gap-2 border-t-2 px-2 py-3 uppercase border-foreground text-foreground">
                  <FaTableCellsLarge aria-hidden="true" /> Posts
                </button>
                <button className="flex items-center gap-2 border-t-2 px-2 py-3 uppercase border-transparent text-muted-foreground hover:text-foreground">
                  <FaPlayCircle aria-hidden="true" /> Reels
                </button>
                <button className="flex items-center gap-2 border-t-2 px-2 py-3 uppercase border-transparent text-muted-foreground hover:text-foreground">
                  <FaBook aria-hidden="true" /> Guides
                </button>
                <button className="flex items-center gap-2 border-t-2 px-2 py-3 uppercase border-transparent text-muted-foreground hover:text-foreground">
                  <FaUserTag aria-hidden="true" /> Tagged
                </button>
              </div>
            </section>

            {/* Content */}
            <section className="mt-4">
              {activeTab === "posts" && (
                <div className="grid grid-cols-3 gap-1 md:gap-2" role="list" aria-label="Posts grid">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <a key={i} href="#" className="block aspect-square bg-muted hover:opacity-90" role="listitem">
                      <img
                        src={`/images/social-media-post.png?height=600&width=600&query=post%20${i + 1}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}

              {activeTab !== "posts" && (
                <div className="py-20 text-center text-sm text-muted-foreground">Nothing here yet.</div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

const highlightItems: { label: string; src: string }[] = [
    { label: "Clients", src: "/images/clients-logo.jpg" },
    { label: "Our Peeps", src: "/images/community-badge.jpg" },
    { label: "Sue", src: "/images/person-headshot.png" },
    { label: "FAV Brands", src: "/images/heart-icon-on-teal.jpg" },
    { label: "BTS", src: "/images/team-badge.png" },
    { label: "CEO", src: "/images/portrait-avatar.png" },
    { label: "Speaker", src: "/images/microphone-icon-teal.jpg" },
  ]
  
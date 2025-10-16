"use client"

import Link from "next/link"
import {
  FaHome,
  FaSearch,
  FaRegCompass,
  FaPlayCircle,
  FaRegPaperPlane,
  FaRegHeart,
  FaPlusSquare,
  FaRegUserCircle,
  FaBars,
} from "react-icons/fa"

type SidebarProps = {
  avatarUrl?: string
  username?: string
}

const nav = [
  { name: "Home", href: "/", icon: FaHome },
  { name: "Search", href: "#", icon: FaSearch },
  { name: "Explore", href: "#", icon: FaRegCompass },
  { name: "Reels", href: "#", icon: FaPlayCircle },
  { name: "Messages", href: "#", icon: FaRegPaperPlane },
  { name: "Notifications", href: "#", icon: FaRegHeart },
  { name: "Create", href: "#", icon: FaPlusSquare },
  { name: "Profile", href: "/user-profile", icon: FaRegUserCircle },
]

export default function Sidebar({ avatarUrl, username }: SidebarProps) {
  return (
    <aside
      className="sticky top-0 h-screen w-64 border-r border-border bg-background text-foreground flex flex-col"
      aria-label="Primary"
    >
      <div className="px-6 py-6">
        <span className="block text-2xl font-semibold">FastGram</span>
      </div>

      <nav className="flex-1 px-2">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/60 transition"
                >
                  <Icon className="text-xl shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{item.name}</span>

                  {item.name === "Profile" && avatarUrl ? (
                    <img
                      src={avatarUrl || "/placeholder.svg"}
                      alt=""
                      className="ml-auto h-6 w-6 rounded-full object-cover border border-border"
                    />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto px-2 pb-4">
        <button
          type="button"
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/60 transition"
        >
          <FaBars className="text-xl" aria-hidden="true" />
          <span className="text-sm font-medium">More</span>
          <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
            <FaRegUserCircle aria-hidden="true" />
            <span className="truncate max-w-[120px]">{username || "Profile"}</span>
          </span>
        </button>
      </div>
    </aside>
  )
}

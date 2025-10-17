"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function Settings() {
  const router = useRouter()

  return (
    <div className="w-[24rem] bg-gray-950 border-r border-gray-800 min-h-screen">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Accounts Center Section */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="text-sm font-semibold text-white mb-3">Accounts Center</h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-300">Personal details</li>
            <li className="text-sm text-gray-300">Password and security</li>
            <li className="text-sm text-gray-300">Ad preferences</li>
          </ul>
          <div className="mt-4">
            <a
              href="#"
              className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            >
              See more in Accounts Center
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-3">Account Settings</h3>

          <button
            onClick={() => router.push("/UserEditProfile")}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-sm font-medium text-gray-100">Edit profile</span>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
          </button>

          <button
            onClick={() => router.push("/Notification")}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-sm font-medium text-gray-100">Notifications</span>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
          </button>

          <button
            onClick={() => router.push("/AccountPrivacy")}
            className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 px-4 py-3 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-sm font-medium text-gray-100">Account privacy</span>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}

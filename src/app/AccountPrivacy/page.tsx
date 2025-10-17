"use client"

import Sidebar from "@/components/Sidebar"
import Settings from "@/components/Settings"
import { useState } from "react"

export default function AccountPrivacy() {
  const [privacy, setPrivacy] = useState({
    isPrivate: false,
    showLastSeen: true,
    allowTags: true,
    showActivityStatus: true,
    allowMessagesFrom: "everyone",
  })

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar currentPage="settings" />
      <div className="flex-1 ml-64 flex">
        <Settings />

        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Account Privacy</h2>
              <p className="text-gray-400 text-sm">
                Manage your privacy settings and control who can interact with your account
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Account Privacy</h3>
              <div className="space-y-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Private Account</p>
                    <p className="text-xs text-gray-400 mt-1">Only approved followers can see your posts and profile</p>
                  </div>
                  <button
                    onClick={() => handleToggle("isPrivate")}
                    className={`w-12 h-6 flex items-center rounded-full transition-all ${
                      privacy.isPrivate ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full m-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Visibility</h3>
              <div className="space-y-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div>
                    <p className="font-medium text-white">Show Last Seen</p>
                    <p className="text-xs text-gray-400 mt-1">Let others see when you were last active</p>
                  </div>
                  <button
                    onClick={() => handleToggle("showLastSeen")}
                    className={`w-12 h-6 flex items-center rounded-full transition-all ${
                      privacy.showLastSeen ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full m-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div>
                    <p className="font-medium text-white">Show Activity Status</p>
                    <p className="text-xs text-gray-400 mt-1">Display when you're online or active</p>
                  </div>
                  <button
                    onClick={() => handleToggle("showActivityStatus")}
                    className={`w-12 h-6 flex items-center rounded-full transition-all ${
                      privacy.showActivityStatus ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full m-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Allow Tags in Posts</p>
                    <p className="text-xs text-gray-400 mt-1">Let others tag you in their posts</p>
                  </div>
                  <button
                    onClick={() => handleToggle("allowTags")}
                    className={`w-12 h-6 flex items-center rounded-full transition-all ${
                      privacy.allowTags ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full m-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Messaging</h3>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="block mb-3">
                  <p className="font-medium text-white mb-2">Allow Messages From</p>
                  <p className="text-xs text-gray-400 mb-3">Control who can send you direct messages</p>
                </label>
                <select
                  value={privacy.allowMessagesFrom}
                  onChange={(e) => setPrivacy((prev) => ({ ...prev, allowMessagesFrom: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                >
                  <option value="everyone">Everyone</option>
                  <option value="followers">Followers Only</option>
                  <option value="noone">No One</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                Save Changes
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors border border-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Sidebar from "@/components/Sidebar"
import Settings from "@/components/Settings"
import { useState } from "react"

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    likeNotifications: true,
    commentNotifications: true,
    newFollower: true,
    messageNotifications: true,
    tagNotifications: true,
    emailUpdates: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar currentPage="settings" />
      <div className="flex-1 ml-64 flex">
        <Settings />

        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Notification Settings</h2>
              <p className="text-gray-400 text-sm">Manage how you receive notifications across the platform</p>
            </div>

            {/* In-App Notifications Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">In-App Notifications</h3>
              <div className="space-y-3 bg-black border border-gray-800 rounded-xl p-6">
                {Object.entries({
                  likeNotifications: {
                    label: "Likes on your posts",
                    description: "Get notified when someone likes your content",
                  },
                  commentNotifications: {
                    label: "Comments on your posts",
                    description: "Get notified when someone comments on your posts",
                  },
                  newFollower: { label: "New followers", description: "Get notified when someone follows you" },
                  tagNotifications: {
                    label: "Tagged in posts",
                    description: "Get notified when you're tagged in posts",
                  },
                  messageNotifications: {
                    label: "Direct messages",
                    description: "Get notified when you receive new messages",
                  },
                }).map(([key, { label, description }]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-[#262626] border border-gray-800 rounded-lg hover:bg-gray-800 hover:border-gray-700 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(key as keyof typeof settings)}
                      className={`ml-4 w-12 h-6 flex items-center rounded-full transition-all duration-200 flex-shrink-0 ${
                        settings[key as keyof typeof settings]
                          ? "bg-blue-600 justify-end shadow-lg shadow-blue-600/50"
                          : "bg-gray-700 justify-start"
                      }`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full m-1 shadow-md" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Notifications Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Email Notifications</h3>
              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between p-4 bg-[#262626] border border-gray-800 rounded-lg hover:bg-gray-800 hover:border-gray-700 transition-all duration-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Email updates & announcements</p>
                    <p className="text-xs text-gray-500 mt-1">Receive important updates and announcements via email</p>
                  </div>
                  <button
                    onClick={() => handleToggle("emailUpdates")}
                    className={`ml-4 w-12 h-6 flex items-center rounded-full transition-all duration-200 flex-shrink-0 ${
                      settings.emailUpdates
                        ? "bg-blue-600 justify-end shadow-lg shadow-blue-600/50"
                        : "bg-gray-700 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 bg-white rounded-full m-1 shadow-md" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-600/50">
                Save Changes
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 border border-gray-700">
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

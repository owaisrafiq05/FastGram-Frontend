"use client"

import type React from "react"

import Sidebar from "@/components/Sidebar"
import Settings from "@/components/Settings" // ✅ newly added
import { useState, useRef } from "react"

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    department: "",
    semester: "",
    avatar: null as File | null,
    avatarPreview: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("firstName", profile.firstName || "")
    formData.append("lastName", profile.lastName || "")
    formData.append("bio", profile.bio || "")
    formData.append("department", profile.department || "")
    formData.append("semester", profile.semester || "")

    if (profile.avatar) {
      formData.append("avatar", profile.avatar)
    }

    try {
      const res = await fetch("/users/profile", {
        method: "PUT",
        headers: {
          Authorization: "Bearer <token>",
        },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update profile")
      setMessage("Profile updated successfully!")
      setProfile((p) => ({ ...p, ...data.data }))
    } catch (err: any) {
      setMessage(err.message || "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Settings (left panel) */}
      <Sidebar currentPage="settings" />

      <div className="flex-1 ml-64 flex">
        {/* ✅ Imported Settings component replaces inline settings code */}
        <Settings />

        <div className="flex-1 p-12">
          <div className="max-w-2xl">
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Edit Profile</h2>
              <p className="text-gray-400 text-sm">Update your personal information and profile picture</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={profile.avatarPreview || "/images/portrait-avatar.png"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover bg-gray-800 border-2 border-gray-700"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="Tell us about yourself"
                    maxLength={150}
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">Add a short bio to your profile</p>
                    <span className="text-xs text-gray-500">{profile.bio.length}/150</span>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                    <input
                      type="number"
                      name="semester"
                      min={1}
                      value={profile.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-md text-sm font-medium ${message.includes("successfully") ? "bg-green-900 border border-green-700 text-green-200" : "bg-red-900 border border-red-700 text-red-200"}`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-md font-semibold text-base transition-colors duration-200"
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

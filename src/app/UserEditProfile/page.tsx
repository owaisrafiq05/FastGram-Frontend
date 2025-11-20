"use client"

import type React from "react"

import Sidebar from "@/components/Sidebar"
import Settings from "@/components/Settings" // ✅ newly added
import { useEffect, useState, useRef } from "react"
import { getMyProfile, updateMyProfile, changePassword, uploadProfileImage } from '@/services/users'

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
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
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState("")
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

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        const u = res.data.user;
        const [firstName, ...rest] = u.fullName?.split(' ') || [''];
        const lastName = rest.join(' ');
        setProfile((prev) => ({
          ...prev,
          username: u.username || prev.username,
          email: u.email || prev.email,
          firstName: firstName || '',
          lastName: lastName || '',
          bio: u.bio || '',
          avatarPreview: u.profilePictureUrl || prev.avatarPreview,
        }));
      } catch {}
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      const payload: any = { fullName, bio: profile.bio };
      if (profile.username) payload.username = profile.username;
      if (profile.email) payload.email = profile.email;
      if (profile.avatar) {
        try {
          const url = await uploadProfileImage(profile.avatar);
          payload.profilePictureUrl = url;
        } catch (e: any) {
          setMessage(e?.message || 'Profile picture upload failed');
        }
      }
      const res = await updateMyProfile(payload);
      setMessage("Profile updated successfully!");
      const u = res.data.user;
      const [firstName, ...rest] = u.fullName?.split(' ') || [''];
      const lastName = rest.join(' ');
      setProfile((p) => ({
        ...p,
        firstName: firstName || '',
        lastName: lastName || '',
        bio: u.bio || '',
        avatarPreview: u.profilePictureUrl || p.avatarPreview,
      }));
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('fg_profile_updated', { detail: u }));
        }
      } catch {}
    } catch (err: any) {
      setMessage(err?.message || "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwdLoading) return;
    setPwdLoading(true);
    setPwdMsg("");
    try {
      const res = await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      if (res.success) {
        setPwdMsg("Password updated successfully!");
        setPwd({ currentPassword: "", newPassword: "" });
      }
    } catch (err: any) {
      setPwdMsg(err?.message || "Error updating password");
    } finally {
      setPwdLoading(false);
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
              <div className="bg-black rounded-lg p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Profile Picture</h3>
                <div className="flex items-center  justify-between bg-[#262626] py-3.5 rounded-4xl px-4 gap-6">
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
                      className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

            {/* Personal Information Section */}
            <div className=" rounded-lg p-6 border border-gray-800">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wide">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Enter first name"
                  />
                </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
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
              <div className=" rounded-lg p-6 border border-gray-800">
                <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wide">
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Semester</label>
                    <input
                      type="number"
                      name="semester"
                      min={1}
                      value={profile.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-md  border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
            className="w-full bg-blue-800 hover:bg-blue-900 cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-md font-semibold text-base transition-colors duration-200"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>

            {/* Change Password */}
            <div className="mt-10 rounded-lg p-6 border border-gray-800">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wide">Change Password</h3>
              <form onSubmit={submitPassword} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={pwd.currentPassword}
                      onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={pwd.newPassword}
                      onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                {pwdMsg && (
                  <div className={`p-4 rounded-md text-sm font-medium ${pwdMsg.includes("successfully") ? "bg-green-900 border border-green-700 text-green-200" : "bg-red-900 border border-red-700 text-red-200"}`}>{pwdMsg}</div>
                )}
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="bg-blue-800 hover:bg-blue-900 cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-md font-semibold"
                >
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

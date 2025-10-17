'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useRef } from 'react';

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    department: '',
    semester: '',
    avatar: null as File | null,
    avatarPreview: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('firstName', profile.firstName || '');
    formData.append('lastName', profile.lastName || '');
    formData.append('bio', profile.bio || '');
    formData.append('department', profile.department || '');
    formData.append('semester', profile.semester || '');

    if (profile.avatar) {
      formData.append('avatar', profile.avatar);
    }

    try {
      // --- FRONTEND: API request ---
      const res = await fetch('/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer <token>',
          // No 'Content-Type' needed for FormData
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setMessage('Profile updated successfully!');
      setProfile(p => ({ ...p, ...data.data }));
    } catch (err: any) {
      setMessage(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  // --- BACKEND: Node/Express/Fastify example, COMMENTED OUT ---
  /*
  // Express Backend (for reference, comment out in frontend)
  app.put('/users/profile', authenticate, upload.single('avatar'), async (req, res) => {
    const { firstName, lastName, bio, department, semester } = req.body;
    const avatarFile = req.file;
    // Update DB...
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUserProfile
    });
  });
  */

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Settings (left panel) */}
      <Sidebar currentPage="settings" />
      <div className="flex-1 ml-64 flex">
        {/* Settings Center Panel (as on Instagram left) */}
        <div className="w-[24rem] p-8 bg-gray-950 border-r border-gray-800 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Accounts Center</h2>
            <ul>
              <li>Personal details</li>
              <li>Password and security</li>
              <li>Ad preferences</li>
            </ul>
            <div className="my-2">
              <a href="#" className="text-blue-400 text-sm hover:underline">
                See more in Accounts Center
              </a>
            </div>
          </div>
          <div className="space-y-3">
            {/* Add Settings options here */}
            <div>Edit profile</div>
            <div>Notifications</div>
            <div>Account privacy</div>
            {/* More sections as needed */}
          </div>
        </div>
        {/* Edit profile Panel (right panel) */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">Edit profile</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-xl">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={profile.avatarPreview || '/images/portrait-avatar.png'}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover bg-gray-700"
              />
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
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-medium"
                >
                  Change photo
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="First name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Last name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Bio"
                maxLength={150}
                rows={3}
              />
              <div className="text-right text-xs text-gray-400">{profile.bio.length}/150</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Department"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Semester</label>
              <input
                type="number"
                name="semester"
                min={1}
                value={profile.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Semester"
              />
            </div>
            {message && (
              <div className="mb-4 text-green-400">{message}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
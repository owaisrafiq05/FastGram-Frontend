import { authStorage } from '@/services/auth';
import { fetchWithAuth, handleJson } from '@/services/http';

export type CurrentUserResponse = {
  success: boolean;
  message: string;
  data: { user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    bio: string;
    profilePictureUrl: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  } };
};

export type UpdateUserProfilePayload = Partial<{
  username: string;
  email: string;
  fullName: string;
  bio: string;
  profilePictureUrl: string;
}>;

export type UpdateProfileResponse = CurrentUserResponse;

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
  data: {};
};

export type PublicUserResponse = {
  success: boolean;
  message: string;
  data: { user: {
    id: number;
    username: string;
    fullName: string;
    bio: string;
    profilePictureUrl: string;
    isVerified: boolean;
    createdAt: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  } };
};

const API_BASE = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL as string)) || 'http://localhost:3000';

// use shared handleJson

function authHeader() {
  const token = authStorage.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMyProfile(): Promise<CurrentUserResponse> {
  const res = await fetchWithAuth(`${API_BASE}/api/users/profile`, {
    method: 'GET',
    headers: authHeader(),
  });
  return handleJson<CurrentUserResponse>(res);
}

export async function updateMyProfile(payload: UpdateUserProfilePayload): Promise<UpdateProfileResponse> {
  const res = await fetchWithAuth(`${API_BASE}/api/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handleJson<UpdateProfileResponse>(res);
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<ChangePasswordResponse> {
  const res = await fetchWithAuth(`${API_BASE}/api/users/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  return handleJson<ChangePasswordResponse>(res);
}

export async function getUserByUsername(username: string): Promise<PublicUserResponse> {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: authHeader(),
  });
  return handleJson<PublicUserResponse>(res);
}

export async function followUser(username: string) {
  const res = await fetchWithAuth(`${API_BASE}/api/users/${encodeURIComponent(username)}/follow`, {
    method: 'POST',
    headers: authHeader(),
  });
  return handleJson<any>(res);
}

export async function unfollowUser(username: string) {
  const res = await fetchWithAuth(`${API_BASE}/api/users/${encodeURIComponent(username)}/follow`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  return handleJson<any>(res);
}

export async function listFollowers(username: string, page = 1, limit = 20) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}/followers?page=${page}&limit=${limit}`);
  return handleJson<any>(res);
}

export async function listFollowing(username: string, page = 1, limit = 20) {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}/following?page=${page}&limit=${limit}`);
  return handleJson<any>(res);
}

export async function uploadProfileImage(file: File): Promise<string> {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.type)) throw new Error('Invalid image type');
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
  const cloudName = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) as string;
  const preset = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) as string;
  if (!cloudName || !preset) throw new Error('Upload not configured');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'Upload failed');
  return json.secure_url as string;
}
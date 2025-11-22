import { authStorage } from '@/services/auth';
import { fetchWithAuth, handleJson } from '@/services/http';
import type {
  Group,
  GroupMember,
  GroupPost,
  CreateGroupPayload,
  UpdateGroupPayload,
  AddMemberPayload,
} from '@/types/groups';

const API_BASE = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL as string)) || 'http://localhost:3000';

// Helper to map snake_case to camelCase
function mapGroupFromAPI(data: any): Group {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    isPrivate: data.is_private,
    ownerId: data.owner_id,
    membersCount: data.members_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ownerUsername: data.owner_username,
    ownerFullName: data.owner_full_name,
    ownerProfilePicture: data.owner_profile_picture,
  };
}

function mapMemberFromAPI(data: any): GroupMember {
  return {
    userId: data.user_id,
    role: data.role,
    joinedAt: data.joined_at,
    username: data.username,
    fullName: data.full_name,
    profilePictureUrl: data.profile_picture_url,
  };
}

function mapPostFromAPI(data: any): GroupPost {
  return {
    id: data.id,
    userId: data.user_id,
    caption: data.caption,
    imageUrl: data.image_url,
    groupId: data.group_id,
    likesCount: data.likes_count,
    commentsCount: data.comments_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    username: data.username,
    fullName: data.full_name,
    profilePictureUrl: data.profile_picture_url,
  };
}

// ========== Group Management ==========

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups`, {
    method: 'POST',
    headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      isPrivate: payload.isPrivate,
    }),
  });
  const json = await handleJson<any>(res);
  return mapGroupFromAPI(json.data.group);
}

export async function getGroup(groupId: number): Promise<Group> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const json = await handleJson<any>(res);
  return mapGroupFromAPI(json.data.group);
}

export async function updateGroup(groupId: number, payload: UpdateGroupPayload): Promise<Group> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}`, {
    method: 'PUT',
    headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      description: payload.description,
      isPrivate: payload.isPrivate,
    }),
  });
  const json = await handleJson<any>(res);
  return mapGroupFromAPI(json.data.group);
}

export async function deleteGroup(groupId: number): Promise<void> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  await handleJson<any>(res);
}

export async function joinGroup(groupId: number): Promise<void> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  await handleJson<any>(res);
}

export async function listAllGroups(): Promise<Group[]> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const json = await handleJson<any>(res);
  return (json.data?.groups || []).map(mapGroupFromAPI);
}

export async function listMyGroups(): Promise<Group[]> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const json = await handleJson<any>(res);
  return (json.data?.groups || []).map(mapGroupFromAPI);
}

// ========== Member Management ==========

export async function addMember(groupId: number, payload: AddMemberPayload): Promise<void> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/members`, {
    method: 'POST',
    headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: payload.userId }),
  });
  await handleJson<any>(res);
}

export async function removeMember(groupId: number, memberId: number): Promise<void> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/members/${memberId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  await handleJson<any>(res);
}

export async function listMembers(groupId: number, page = 1, limit = 50): Promise<GroupMember[]> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/members?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const json = await handleJson<any>(res);
  return (json.data.members || []).map(mapMemberFromAPI);
}

// ========== Group Posts ==========

export async function createGroupPost(groupId: number, file?: File, caption?: string): Promise<GroupPost> {
  const token = authStorage.getAccessToken();
  const fd = new FormData();
  if (caption) fd.append('caption', caption);
  if (file) fd.append('image', file);

  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/posts`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });
  const json = await handleJson<any>(res);
  return mapPostFromAPI(json.data.post);
}

export async function listGroupPosts(groupId: number, page = 1, limit = 20): Promise<GroupPost[]> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/posts?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const json = await handleJson<any>(res);
  return (json.data.posts || []).map(mapPostFromAPI);
}

export async function deleteGroupPost(groupId: number, postId: number): Promise<void> {
  const token = authStorage.getAccessToken();
  const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/posts/${postId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  await handleJson<any>(res);
}

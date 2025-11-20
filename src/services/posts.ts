import { authStorage } from '@/services/auth';
import { fetchWithAuth, handleJson } from '@/services/http';
import type { PostDetail, PostComment, UserProfile } from '@/types/posts';

const API_BASE = (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL as string)) || 'http://localhost:3000';

function authHeader() {
  const token = authStorage.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// use shared handleJson

function splitName(fullName: string | undefined) {
  const parts = (fullName || '').trim().split(' ');
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ');
  return { first, last };
}

async function getMe() {
  try {
    const res = await fetch(`${API_BASE}/api/users/profile`, { headers: authHeader() });
    const json = await res.json();
    return json?.data?.user;
  } catch {
    return null;
  }
}

function mapUser(u: any): UserProfile {
  const names = splitName(u?.fullName);
  return {
    id: String(u?.id ?? u?.userId ?? ''),
    username: String(u?.username || ''),
    firstName: names.first,
    lastName: names.last,
    avatarUrl: String(u?.profilePictureUrl || ''),
  };
}

function mapPost(p: any, meId?: number | string): PostDetail {
  const user = mapUser(p?.user);
  const canDelete = meId != null && String(p?.userId) === String(meId);
  if (meId != null && String(p?.userId) === String(meId)) {
    user.username = 'You';
  }
  return {
    id: String(p?.id || ''),
    user,
    content: String(p?.caption || ''),
    category: 'general',
    mediaUrls: p?.imageUrl ? [String(p.imageUrl)] : [],
    likesCount: Number(p?.likesCount || 0),
    commentsCount: Number(p?.commentsCount || 0),
    sharesCount: 0,
    isLiked: Boolean(p?.isLiked || false),
    createdAt: String(p?.createdAt || new Date().toISOString()),
    updatedAt: String(p?.updatedAt || new Date().toISOString()),
    canDelete,
  };
}

export async function createPost(file: File, caption?: string) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.type)) throw new Error('Invalid image type');
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
  if (caption && caption.length > 2200) throw new Error('Caption too long');
  const fd = new FormData();
  fd.append('image', file);
  if (caption) fd.append('caption', caption);
  const res = await fetchWithAuth(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: authHeader(),
    body: fd,
  });
  const json = await handleJson<any>(res);
  const created = json.data.post;
  // Fetch full post if backend did not include user object
  if (!created?.user) {
    try {
      const resFull = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(created.id)}`);
      const fullJson = await handleJson<any>(resFull);
      const me = await getMe();
      return mapPost(fullJson.data.post, me?.id);
    } catch {}
  }
  const me = await getMe();
  return mapPost(created, me?.id);
}

export async function getPost(postId: string): Promise<PostDetail> {
  const res = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(postId)}`);
  const json = await handleJson<any>(res);
  const me = await getMe();
  return mapPost(json.data.post, me?.id);
}

export async function updatePostCaption(postId: string, caption: string): Promise<PostDetail> {
  if (caption.length > 2200) throw new Error('Caption too long');
  const res = await fetchWithAuth(`${API_BASE}/api/posts/${encodeURIComponent(postId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ caption }),
  });
  const json = await handleJson<any>(res);
  const me = await getMe();
  return mapPost(json.data.post, me?.id);
}

export async function deletePost(postId: string) {
  const res = await fetchWithAuth(`${API_BASE}/api/posts/${encodeURIComponent(postId)}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  await handleJson<any>(res);
}

export async function getPostsByUsername(username: string, page = 1, limit = 9): Promise<{ posts: PostDetail[]; pagination: any }> {
  const res = await fetch(`${API_BASE}/api/posts/user/${encodeURIComponent(username)}?page=${page}&limit=${limit}`);
  const json = await handleJson<any>(res);
  const me = await getMe();
  const posts = (json.data.posts || []).map((p: any) => mapPost(p, me?.id));
  return { posts, pagination: json.data.pagination };
}

export async function getFeedTimeline(page = 1, limit = 10): Promise<{ posts: PostDetail[]; pagination: any }> {
  const res = await fetchWithAuth(`${API_BASE}/api/posts/feed/timeline?page=${page}&limit=${limit}`, {
    headers: authHeader(),
  });
  const json = await handleJson<any>(res);
  const me = await getMe();
  const posts = (json.data.posts || []).map((p: any) => mapPost(p, me?.id));
  return { posts, pagination: json.data.pagination };
}

export async function likePost(postId: string) {
  const res = await fetchWithAuth(`${API_BASE}/api/posts/${encodeURIComponent(postId)}/like`, {
    method: 'POST',
    headers: authHeader(),
  });
  await handleJson<any>(res);
}

export async function unlikePost(postId: string) {
  const res = await fetchWithAuth(`${API_BASE}/api/posts/${encodeURIComponent(postId)}/like`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  await handleJson<any>(res);
}

export async function addComment(postId: string, commentText: string): Promise<PostComment> {
  const len = commentText.trim().length;
  if (len < 1 || len > 500) throw new Error('Invalid comment length');
  const res = await fetchWithAuth(`${API_BASE}/api/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ commentText }),
  });
  const json = await handleJson<any>(res);
  const u = json.data.comment;
  const me = await getMe();
  const user = mapUser(me || {});
  return {
    id: String(u.id),
    user,
    text: String(u.commentText),
    createdAt: String(u.createdAt),
  };
}

export async function getComments(postId: string, page = 1, limit = 10): Promise<{ comments: PostComment[]; pagination: any }> {
  const res = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(postId)}/comments?page=${page}&limit=${limit}`);
  const json = await handleJson<any>(res);
  const me = await getMe();
  const comments: PostComment[] = (json.data.comments || []).map((c: any) => {
    const user = mapUser(c.user);
    if (me && String(c.user?.id) === String(me.id)) user.username = 'You';
    return {
      id: String(c.id),
      user,
      text: String(c.commentText),
      createdAt: String(c.createdAt),
    };
  });
  return { comments, pagination: json.data.pagination };
}

export async function deleteComment(postId: string, commentId: string) {
  const res = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  await handleJson<any>(res);
}
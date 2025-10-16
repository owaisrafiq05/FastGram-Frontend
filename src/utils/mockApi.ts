import { PostDetail, Category } from './../types/posts';

let POSTS: PostDetail[] = [
  {
    id: 'p_1',
    user: { id: 'u_1', username: '_muhib_ali_', firstName: 'Muhib', lastName: 'Ali', avatarUrl: '/images/portrait-avatar.png' },
    content: 'Windows 10 — End of Support. Upgrade now and stay safe.',
    category: 'announcement',
    mediaUrls: ['/images/social-media-post.png'],
    likesCount: 120, commentsCount: 8, sharesCount: 2, isLiked: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'p_2',
    user: { id: 'u_2', username: 'art.sketches', firstName: 'Art', lastName: 'Hub', avatarUrl: '/images/person-headshot.png' },
    content: 'Shading practice ✏️',
    category: 'general',
    mediaUrls: ['/images/community-badge.jpg'],
    likesCount: 80, commentsCount: 3, sharesCount: 0, isLiked: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export async function mockGetFeed(params: { limit: number; offset: number; category?: Category }) {
  await new Promise(r => setTimeout(r, 350));
  const filtered = params.category ? POSTS.filter(p => p.category === params.category) : POSTS;
  const slice = filtered.slice(params.offset, params.offset + params.limit);
  return { success: true, data: { posts: slice, hasMore: params.offset + params.limit < filtered.length } } as const;
}

export async function mockCreatePost(input: {
  content: string; category?: Category; visibility?: string; media?: File[]; groupId?: string;
}) {
  await new Promise(r => setTimeout(r, 500));
  const id = `p_${Date.now()}`;
  const mediaUrls = (input.media || []).map((f) => URL.createObjectURL(f));
  const post: PostDetail = {
    id,
    user: { id: 'u_me', username: '_muhib_ali_', firstName: 'Muhib', lastName: 'Ali', avatarUrl: '/images/portrait-avatar.png' },
    content: input.content,
    category: input.category || 'general',
    mediaUrls,
    likesCount: 0, commentsCount: 0, sharesCount: 0, isLiked: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  POSTS = [post, ...POSTS]; // prepend to feed
  return { success: true, data: post } as const;
}

export async function mockGetPost(postId: string) {
  await new Promise(r => setTimeout(r, 300));
  const p = POSTS.find(x => x.id === postId);
  return { success: true, data: { ...(p as any), comments: [
    { id: 'c1', text: 'Nice!', createdAt: new Date().toISOString(), user: { id: 'u2', username: 'ali_', firstName:'Ali', lastName:'Raza', avatarUrl:'/images/person-headshot.png' } }
  ]}} as const;
}

export async function mockDeletePost(postId: string) {
  await new Promise((r) => setTimeout(r, 300));
  const before = POSTS.length;
  POSTS = POSTS.filter(p => p.id !== postId);
  const deleted = POSTS.length < before;
  return { success: deleted } as const;
}
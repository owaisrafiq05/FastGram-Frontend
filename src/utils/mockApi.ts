import { PostDetail, Category, UserProfile, PostComment } from './../types/posts';

/* -------------------------------------------------------
   In-memory POSTS
------------------------------------------------------- */
let POSTS: PostDetail[] = [
  {
    id: 'p_1',
    user: {
      id: 'u_1',
      username: '_muhib_ali_',
      firstName: 'Muhib',
      lastName: 'Ali',
      avatarUrl: '/images/portrait-avatar.png',
    },
    content: 'Windows 10 — End of Support. Upgrade now and stay safe.',
    category: 'announcement',
    mediaUrls: ['/images/social-media-post.png'],
    likesCount: 120,
    commentsCount: 8,
    sharesCount: 2,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p_2',
    user: {
      id: 'u_2',
      username: 'art.sketches',
      firstName: 'Art',
      lastName: 'Hub',
      avatarUrl: '/images/person-headshot.png',
    },
    content: 'Shading practice ✏️',
    category: 'general',
    mediaUrls: ['/images/community-badge.jpg'],
    likesCount: 80,
    commentsCount: 3,
    sharesCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ME_ID = 'u_me';

/* -------------------------------------------------------
   Feed (GET)
   - injects canDelete per post
------------------------------------------------------- */
export async function mockGetFeed(params: {
  limit: number;
  offset: number;
  category?: Category;
}) {
  await new Promise((r) => setTimeout(r, 350));
  const filtered = params.category
    ? POSTS.filter((p) => p.category === params.category)
    : POSTS;

  const slice = filtered.slice(params.offset, params.offset + params.limit);

  // add canDelete on the fly (does not mutate store)
  const withFlags = slice.map(
    (p) =>
      ({
        ...p,
        canDelete: p.user.id === ME_ID,
      } as PostDetail & { canDelete: boolean })
  );

  return {
    success: true,
    data: {
      posts: withFlags,
      hasMore: params.offset + params.limit < filtered.length,
    },
  } as const;
}

/* -------------------------------------------------------
   Create Post (POST)
   - returns canDelete: true for the created post
------------------------------------------------------- */
export async function mockCreatePost(input: {
  content: string;
  category?: Category;
  visibility?: string;
  media?: File[];
  groupId?: string;
}) {
  await new Promise((r) => setTimeout(r, 500));
  const id = `p_${Date.now()}`;
  const mediaUrls = (input.media || []).map((f) => URL.createObjectURL(f));

  const basePost: PostDetail = {
    id,
    user: {
      id: ME_ID,
      username: '_muhib_ali_',
      firstName: 'Muhib',
      lastName: 'Ali',
      avatarUrl: '/images/portrait-avatar.png',
    },
    content: input.content,
    category: input.category || 'general',
    mediaUrls,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    isLiked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // store without extra flags
  POSTS = [basePost, ...POSTS];

  // return with delete capability for UI
  const returned = { ...basePost, canDelete: true } as PostDetail & {
    canDelete: boolean;
  };

  return { success: true, data: returned } as const;
}

/* -------------------------------------------------------
   Get Single Post (GET /posts/:id)
   - injects canDelete and some mock comments
------------------------------------------------------- */
export async function mockGetPost(postId: string) {
  await new Promise((r) => setTimeout(r, 300));
  const p = POSTS.find((x) => x.id === postId);
  if (!p) {
    return { success: false, data: null } as const;
  }

  const withFlag = { ...p, canDelete: p.user.id === ME_ID } as PostDetail & {
    canDelete: boolean;
  };

  // minimal inline comment to show structure (main list comes from comments API)
  const demoComments: PostComment[] = [
    {
      id: 'c1',
      text: 'Nice!',
      createdAt: new Date().toISOString(),
      user: {
        id: 'u2',
        username: 'ali_',
        firstName: 'Ali',
        lastName: 'Raza',
        avatarUrl: '/images/person-headshot.png',
      },
      repliesCount: 0,
      canDelete: false,
    },
  ];

  return { success: true, data: { ...withFlag, comments: demoComments } } as const;
}

/* -------------------------------------------------------
   Delete Post (DELETE)
------------------------------------------------------- */
export async function mockDeletePost(postId: string) {
  await new Promise((r) => setTimeout(r, 300));
  const before = POSTS.length;
  POSTS = POSTS.filter((p) => p.id !== postId);
  const deleted = POSTS.length < before;
  return { success: deleted } as const;
}

/* =======================================================
   COMMENTS MOCKS
======================================================= */

type _StoreComment = {
  id: string;
  postId: string;
  user: UserProfile;
  text: string;
  createdAt: string;
  parentCommentId?: string;
};

let COMMENTS: _StoreComment[] = [
  {
    id: 'c_seed_1',
    postId: 'p_1',
    user: {
      id: 'u2',
      username: 'ali_',
      firstName: 'Ali',
      lastName: 'Raza',
      avatarUrl: '/images/person-headshot.png',
    },
    text: 'Nice!',
    createdAt: new Date().toISOString(),
  },
];

function _countReplies(id: string) {
  return COMMENTS.filter((c) => c.parentCommentId === id).length;
}

/* ---- Get Comments (paginated) ---- */
export async function mockGetComments(
  postId: string,
  limit = 10,
  offset = 0
) {
  await new Promise((r) => setTimeout(r, 250));
  const all = COMMENTS
    .filter((c) => c.postId === postId && !c.parentCommentId)
    .sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );

  const page = all.slice(offset, offset + limit);

  const data: PostComment[] = page.map((c) => ({
    id: c.id,
    user: c.user,
    text: c.text,
    createdAt: c.createdAt,
    repliesCount: _countReplies(c.id),
    canDelete: c.user.id === ME_ID,
  }));

  return {
    success: true,
    data: {
      comments: data,
      total: all.length,
      hasMore: offset + limit < all.length,
    },
  } as const;
}

/* ---- Create Comment ---- */
export async function mockCreateComment(
  postId: string,
  content: string,
  parentCommentId?: string
) {
  await new Promise((r) => setTimeout(r, 200));
  const me: UserProfile = {
    id: ME_ID,
    username: '_muhib_ali_',
    firstName: 'Muhib',
    lastName: 'Ali',
    avatarUrl: '/images/portrait-avatar.png',
  };
  const id = `c_${Date.now()}`;
  const item: _StoreComment = {
    id,
    postId,
    user: me,
    text: content,
    createdAt: new Date().toISOString(),
    parentCommentId,
  };
  COMMENTS = [item, ...COMMENTS];

  const created: PostComment = {
    id,
    user: me,
    text: content,
    createdAt: item.createdAt,
    parentCommentId,
    repliesCount: 0,
    canDelete: true,
  };

  return { success: true, data: created } as const;
}

/* ---- Delete Comment ---- */
export async function mockDeleteComment(commentId: string) {
  await new Promise((r) => setTimeout(r, 200));
  const before = COMMENTS.length;
  COMMENTS = COMMENTS.filter(
    (c) => c.id !== commentId && c.parentCommentId !== commentId
  ); // also remove its replies
  return { success: COMMENTS.length < before } as const;
}

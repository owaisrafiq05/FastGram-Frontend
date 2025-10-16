export type Category = 'academic' | 'social' | 'announcement' | 'event' | 'general';
export type Visibility = 'public' | 'followers' | 'private';

export type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export type Comment = {
  id: string;
  user: UserProfile;
  text: string;
  createdAt: string;
};

export type PostDetail = {
  id: string;
  user: UserProfile;
  content: string;
  category: Category;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
};

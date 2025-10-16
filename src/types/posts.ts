export type Category = 'academic' | 'social' | 'announcement' | 'event' | 'general';
export type Visibility = 'public' | 'followers' | 'private';

export type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export type PostComment = {
  id: string;
  user: UserProfile;
  text: string;
  createdAt: string;
parentCommentId?: string;
  repliesCount?: number;  // for UI
  canDelete?: boolean; 
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
  canDelete?: boolean; 
};

// Group types for FastGram

export interface Group {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  ownerId: number;
  membersCount: number;
  createdAt: string;
  updatedAt: string;
  ownerUsername?: string;
  ownerFullName?: string;
  ownerProfilePicture?: string;
}

export interface GroupMember {
  userId: number;
  role: string;
  joinedAt: string;
  username: string;
  fullName: string;
  profilePictureUrl: string;
}

export interface GroupPost {
  id: number;
  userId: number;
  caption: string;
  imageUrl: string;
  groupId: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  username?: string;
  fullName?: string;
  profilePictureUrl?: string;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface AddMemberPayload {
  userId: number;
}

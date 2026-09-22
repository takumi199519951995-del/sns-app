export type User = {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  content: string;
  authorId: number;
  createdAt: string;
  author: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  likedByMe: boolean;
};

export type UserProfile = {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
};

export type Message = {
  id: number;
  content: string;
  conversationId: number;
  senderId: number;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    displayName: string;
  };
};

export type Conversation = {
  id: number;
  userOneId: number;
  userTwoId: number;
  createdAt: string;
  userOne: {
    id: number;
    username: string;
    displayName: string;
  };
  userTwo: {
    id: number;
    username: string;
    displayName: string;
  };
  messages: Message[];
};
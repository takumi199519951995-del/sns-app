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
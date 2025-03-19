export interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isSticky: boolean;
  isLocked: boolean;
  viewCount: number;
  authorId: string;
  categoryId: string;
  lastPostAt: string | null;
  lastPostById: string | null;
  acceptedPostId: string | null;
  excerpt?: string;
  _count?: {
    posts: number;
  };
  author?: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  category: {
    id?: string;
    name: string;
    slug: string;
  };
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  threadId: string;
  isEdited: boolean;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
    reputation: number;
    createdAt: string;
  };
  _count: {
    likes: number;
  };
  hasLiked?: boolean;
  thread?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    threads: number;
  };
}

export interface Report {
  id: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  userId: string;
  postId: string;
  resolvedById: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  post: {
    id: string;
    content: string;
    thread: {
      id: string;
      title: string;
      slug: string;
    };
  };
  resolvedBy?: {
    id: string;
    name: string | null;
    image: string | null;
  };
} 
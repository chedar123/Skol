// Typdefinitioner för forumkomponenter

export interface Thread {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isSticky: boolean;
  isLocked: boolean;
  viewCount: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  acceptedPostId: string | null;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
} 
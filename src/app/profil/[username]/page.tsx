"use server";

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare, ThumbsUp, Shield, Calendar, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileHeader, { UserProfileData } from '@/components/profile/ProfileHeader';
import ActivityTabs from '@/components/profile/ActivityTabs';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.name === username || session?.user?.id === username;

  // Hämta användardata från databasen - sök på både namn och id
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { name: username },
        { id: username }
      ]
    },
    include: {
      _count: {
        select: {
          threads: true,
          posts: true
        }
      }
    }
  });

  // Visa 404 om användaren inte hittas
  if (!user) {
    notFound();
  }

  // Formatera tidsskillnad
  const timeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: sv
    });
  };
  
  // Hämta användarens trådar
  const userThreads = await prisma.thread.findMany({
    where: { authorId: user.id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      _count: {
        select: {
          posts: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Hämta användarens inlägg
  const userPosts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      thread: {
        select: {
          id: true,
          title: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Skapa excerpt för inlägg och konvertera datum till string
  const postsWithExcerpt = userPosts.map(post => {
    const plainText = post.content.replace(/<[^>]*>/g, '');
    return {
      ...post,
      excerpt: plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  });

  // Skapa excerpt för trådar och konvertera datum till string
  const threadsWithExcerpt = userThreads.map(thread => {
    return {
      ...thread,
      excerpt: `Tråd skapad av ${user.name}`,
      createdAt: thread.createdAt.toISOString(),
      updatedAt: thread.updatedAt.toISOString()
    };
  });

  // Konvertera user till UserProfileData
  const userData: UserProfileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role as 'USER' | 'ADMIN' | 'MODERATOR',
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    reputation: user.reputation,
    _count: {
      threads: user._count.threads,
      posts: user._count.posts
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        user={userData}
        isCurrentUser={isCurrentUser}
        isLoading={false}
        userThreadsCount={userThreads.length}
        userPostsCount={userPosts.length}
      />
      
      <ActivityTabs
        userThreads={threadsWithExcerpt}
        userPosts={postsWithExcerpt}
        isLoadingThreads={false}
        isLoadingPosts={false}
      />
    </div>
  );
}
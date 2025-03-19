"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Activity } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface Thread {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    posts: number;
  };
}

interface Post {
  id: string;
  content: string;
  excerpt: string;
  createdAt: string;
  thread: {
    id: string;
    title: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface ActivityTabsProps {
  userThreads: Thread[];
  userPosts: Post[];
  isLoadingThreads: boolean;
  isLoadingPosts: boolean;
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({
  userThreads,
  userPosts,
  isLoadingThreads,
  isLoadingPosts,
}) => {
  const [activeTab, setActiveTab] = useState<'threads' | 'posts'>('threads');

  return (
    <div className="bg-white rounded-lg shadow mt-6">
      {/* Flikar */}
      <div className="flex border-b">
        <button
          className={`py-3 px-6 font-medium text-sm flex items-center ${
            activeTab === 'threads'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('threads')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Trådar
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm flex items-center ${
            activeTab === 'posts'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Inlägg
        </button>
      </div>

      {/* Innehåll */}
      <div className="p-4">
        {activeTab === 'threads' && (
          <div>
            {isLoadingThreads ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-100 h-16 rounded-md"></div>
                ))}
              </div>
            ) : userThreads.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Inga trådar skapade
              </div>
            ) : (
              <div className="space-y-4">
                {userThreads.map((thread) => (
                  <div key={thread.id} className="border rounded-md p-3 hover:bg-gray-50">
                    <Link href={`/forum/thread/${thread.id}`} className="block group">
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-600">{thread.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          <span className="mr-2">{timeAgo(new Date(thread.createdAt))}</span>
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          {thread.category.name}
                        </span>
                        <span className="ml-2 inline-flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {thread._count.posts} inlägg
                        </span>
                      </div>
                      {thread.excerpt && (
                        <p className="text-sm text-gray-600 mt-2">{thread.excerpt}</p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {isLoadingPosts ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-100 h-16 rounded-md"></div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Inga inlägg skapade
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="border rounded-md p-3 hover:bg-gray-50">
                    <Link href={`/forum/thread/${post.thread.id}`} className="block group">
                      <h3 className="font-medium text-gray-900 group-hover:text-pink-600">
                        {post.thread.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          <span className="mr-2">{timeAgo(new Date(post.createdAt))}</span>
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          {post.thread.category.name}
                        </span>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTabs; 
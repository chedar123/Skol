import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { timeAgo } from '@/lib/utils';

export interface UserProfileData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
  reputation: number;
  _count: {
    threads: number;
    posts: number;
  };
}

export interface ProfileHeaderProps {
  user: UserProfileData;
  isCurrentUser: boolean;
  isLoading: boolean;
  userThreadsCount: number;
  userPostsCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser,
  isLoading,
  userThreadsCount,
  userPostsCount,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: sv
      });
    } catch (error) {
      console.error('Invalid date:', dateString, error);
      return 'Okänt datum';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Användarinformation */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          {user.image ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500">
              <Image 
                src={user.image} 
                alt={user.name || 'Användare'} 
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-pink-500">
              <span className="text-gray-500 text-3xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name || 'Användare'}</h1>
          
          {user.role !== 'USER' && (
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
              user.role === 'ADMIN' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {user.role === 'ADMIN' ? 'Admin' : 'Moderator'}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600 mr-4">
              Medlem sedan {formatDate(user.createdAt)}
            </p>
            
            <Shield className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600">
              {user.reputation} rykte
            </p>
          </div>
          
          {isCurrentUser && (
            <div className="mt-4">
              <Link 
                href="/profil/redigera" 
                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Redigera profil
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Ryktesindikator */}
      <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-gray-800">Ryktespoäng: {user.reputation}</h3>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full ${
              user.reputation < 0 ? 'bg-red-500' : 
              user.reputation < 10 ? 'bg-amber-500' : 
              user.reputation < 50 ? 'bg-green-500' : 
              user.reputation < 100 ? 'bg-blue-500' : 'bg-indigo-500'
            }`} 
            style={{ width: `${Math.min(100, Math.max(5, (user.reputation / 200) * 100))}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600">
          {user.reputation < 0 ? 'Kontroversiell' : 
           user.reputation < 10 ? 'Nybörjare' : 
           user.reputation < 50 ? 'Aktiv deltagare' : 
           user.reputation < 100 ? 'Respekterad medlem' : 
           user.reputation < 200 ? 'Uppskattad expert' : 'Forumlegend'}
        </p>
      </div>
      
      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">{user._count.threads || 0}</div>
          <div className="text-gray-600">Trådar</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">{user._count.posts || 0}</div>
          <div className="text-gray-600">Inlägg</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">{user.reputation}</div>
          <div className="text-gray-600">Rykte</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-600">
            {userPostsCount > 0 ? 'Aktiv' : '-'}
          </div>
          <div className="text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 
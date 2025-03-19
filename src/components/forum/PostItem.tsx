import { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ThumbsUp, 
  Check, 
  Flag, 
  Trash, 
  Shield, 
  Clock, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Post, Thread } from './types';
import Link from 'next/link';

interface PostItemProps {
  post: Post;
  thread: Thread;
  isFirstPost?: boolean;
  isAcceptingPost: boolean;
  isDeletingPost: boolean;
  handleLikePost: (postId: string) => Promise<void>;
  handleAcceptPost: (postId: string) => Promise<void>;
  handleDeletePost: (postId: string, authorId: string) => Promise<void>;
  handleReportPost: (postId: string) => Promise<void>;
  timeAgo: (date: Date) => string;
}

const PostItem: FC<PostItemProps> = ({
  post,
  thread,
  isFirstPost = false,
  isAcceptingPost,
  isDeletingPost,
  handleLikePost,
  handleAcceptPost,
  handleDeletePost,
  handleReportPost,
  timeAgo
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [postToDelete, setPostToDelete] = useState<string | undefined>(undefined);
  const [postToReport, setPostToReport] = useState<string | undefined>(undefined);
  const [reportReason, setReportReason] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="grid grid-cols-12">
        {/* Användarprofil (vänster kolumn) */}
        <div className="col-span-2 bg-gray-50 p-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2 relative">
            {post.author.image ? (
              <Image 
                src={post.author.image} 
                alt={post.author.name || 'Användare'} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-800 text-xl font-bold">
                {post.author.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="font-medium text-gray-900 mb-1">
              <Link href={`/profil/${post.author.name || post.author.id}`}>
                {post.author.name || 'Användare'}
              </Link>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {post.author.role === 'ADMIN' ? 'Admin' : 
               post.author.role === 'MODERATOR' ? 'Moderator' : 
               'Medlem'}
              {(post.author.role === 'ADMIN' || post.author.role === 'MODERATOR') && (
                <div className="flex items-center justify-center mt-1">
                  <Shield className="w-3 h-3 text-pink-600 mr-1" />
                  <span className="text-pink-600">{post.author.role === 'ADMIN' ? 'Admin' : 'Mod'}</span>
                </div>
              )}
            </div>
            
            {/* Reputationsindikator */}
            <div className="mt-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <Shield className="w-3 h-3" />
                <span>{post.author.reputation}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full ${
                    post.author.reputation < 0 ? 'bg-red-500' :
                    post.author.reputation < 10 ? 'bg-amber-500' :
                    post.author.reputation < 50 ? 'bg-green-500' :
                    post.author.reputation < 100 ? 'bg-blue-500' :
                    'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, post.author.reputation < 0 ? 5 : post.author.reputation > 100 ? 100 : post.author.reputation))}%` }}
                ></div>
              </div>
              <span className="text-xs">
                {post.author.reputation < 0 ? 'Kontroversiell' :
                 post.author.reputation < 10 ? 'Nybörjare' :
                 post.author.reputation < 50 ? 'Aktiv deltagare' :
                 post.author.reputation < 100 ? 'Respekterad medlem' :
                 'Forumexpert'}
              </span>
            </div>
            <div className="mt-1">
              Medlem sedan {new Date(post.author.createdAt).toLocaleDateString('sv-SE')}
            </div>
          </div>
        </div>
        
        {/* Inläggsinnehåll */}
        <div className="col-span-10 p-4 bg-pink-50/30">
          {/* Badge för att visa att det är trådskapare */}
          {isFirstPost && (
            <div className="inline-block px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-800 mb-3 font-medium">
              Trådskapare
            </div>
          )}
          
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{timeAgo(new Date(post.createdAt))}</span>
              {post.isEdited && (
                <span className="ml-2 text-xs text-gray-500">(redigerad)</span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center text-sm px-2 py-1 rounded ${
                  post.hasLiked 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={!session}
                title={session ? 'Gilla inlägg' : 'Logga in för att gilla'}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{post._count.likes}</span>
              </button>
              
              {/* Markera som godkänt svar-knapp */}
              {session && thread && 
               (session.user?.id === thread.author.id || 
                session.user?.role === 'ADMIN' || 
                session.user?.role === 'MODERATOR') && 
               (!thread?.acceptedPostId || thread.acceptedPostId !== post.id) && (
                <button
                  onClick={() => handleAcceptPost(post.id)}
                  className="flex items-center text-sm px-2 py-1 rounded text-green-700 hover:bg-green-100"
                  disabled={isAcceptingPost}
                  title="Markera som godkänt svar"
                >
                  <Check className="w-4 h-4 mr-1" />
                  <span>Godkänn</span>
                  {isAcceptingPost && (
                    <span className="ml-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                  )}
                </button>
              )}
              
              {session && (
                <div className="relative">
                  <button
                    onClick={() => setPostToReport(postToReport === post.id ? undefined : post.id)}
                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                    title="Rapportera inlägg"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  
                  {/* Rapportera-formulär */}
                  {postToReport && (
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                      onClick={() => setPostToReport(undefined)}
                    >
                      <div 
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center mb-3 text-amber-600">
                          <Flag className="w-5 h-5 mr-2" />
                          <h3 className="text-lg font-medium">Rapportera inlägg</h3>
                        </div>
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Ange anledning till rapporten..."
                          className="w-full p-3 border border-gray-300 rounded mb-4 text-sm"
                          rows={4}
                        />
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setPostToReport(undefined)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          >
                            Avbryt
                          </button>
                          <button
                            onClick={() => {
                              handleReportPost(post.id);
                              setReportReason('');
                              setPostToReport(undefined);
                            }}
                            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                            disabled={!reportReason.trim()}
                          >
                            Rapportera
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Moderator/ägare-åtgärder för inlägg */}
              {session && (session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR' || session.user?.id === post.author.id) && (
                <div className="relative">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-gray-600 hover:bg-gray-100 p-1 rounded"
                    title="Ta bort inlägg"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="prose prose-pink prose-sm md:prose-base max-w-none mt-4 text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
      
      {/* Ta bort-bekräftelse */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-3 text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-medium">Bekräfta borttagning</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Är du säker på att du vill ta bort detta inlägg? Denna åtgärd kan inte ångras.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  console.log('Klickade på Ta bort för inlägg:', post.id);
                  setShowDeleteConfirm(false);
                  handleDeletePost(post.id, post.author.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                disabled={isDeletingPost}
              >
                {isDeletingPost ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    Tar bort...
                  </>
                ) : (
                  "Ta bort"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem; 
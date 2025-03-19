import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  MoreVertical, 
  Lock, 
  Unlock, 
  Pin, 
  Trash,
  ChevronLeft
} from 'lucide-react';
import { Thread } from './types';

interface ThreadHeaderProps {
  thread: Thread | null;
  isLockingThread: boolean;
  isPinningThread: boolean;
  isDeletingThread: boolean;
  handleToggleLock: () => Promise<void>;
  handleToggleSticky: () => Promise<void>;
  handleDeleteThread: () => Promise<void>;
}

const ThreadHeader: FC<ThreadHeaderProps> = ({
  thread,
  isLockingThread,
  isPinningThread,
  isDeletingThread,
  handleToggleLock,
  handleToggleSticky,
  handleDeleteThread
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModMenu, setShowModMenu] = useState(false);
  const [showConfirmDeleteThread, setShowConfirmDeleteThread] = useState(false);
  
  if (!thread) return null;
  
  const isAdmin = session?.user?.role === 'ADMIN';
  const isModerator = session?.user?.role === 'MODERATOR';
  const isOwner = session?.user?.id === thread.author.id;

  return (
    <div className="mb-6">
      {/* Tillbaka-länk och kategori */}
      <div className="flex items-center mb-4">
        <Link 
          href={thread.category ? `/forum/${thread.category.slug}` : '/forum'}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Tillbaka till {thread.category ? thread.category.name : 'forum'}
        </Link>
      </div>
      
      {/* Trådrubrik och status */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            {thread.title}
            {thread.isLocked && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <Lock className="w-3 h-3 mr-1" />
                Låst
              </span>
            )}
            {thread.isSticky && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                <Pin className="w-3 h-3 mr-1" />
                Klistrad
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Skapad av {thread.author.name} • {new Date(thread.createdAt).toLocaleDateString('sv-SE', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        {/* Moderator/Ägare-meny */}
        {session && (isAdmin || isModerator || isOwner) && (
          <div className="relative">
            <button 
              onClick={() => setShowModMenu(!showModMenu)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Moderatorfunktioner"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showModMenu && (
              <div className="absolute right-0 top-auto bottom-full mb-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {/* Visa bara lås/klista-knappar för admin/moderator */}
                  {(isAdmin || isModerator) && (
                    <>
                      <button
                        onClick={handleToggleLock}
                        disabled={isLockingThread}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        {thread.isLocked ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Lås upp tråd
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Lås tråd
                          </>
                        )}
                        {isLockingThread && (
                          <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                        )}
                      </button>
                      
                      <button
                        onClick={handleToggleSticky}
                        disabled={isPinningThread}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Pin className="w-4 h-4 mr-2" />
                        {thread.isSticky ? 'Ta bort klistring' : 'Klistra tråd'}
                        {isPinningThread && (
                          <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                        )}
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                    </>
                  )}
                  
                  {/* Ta bort tråd (visas för alla behöriga) */}
                  <button
                    onClick={() => {
                      setShowModMenu(false);
                      setShowConfirmDeleteThread(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Ta bort tråd
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bekräftelsedialog för borttagning av tråd */}
      {showConfirmDeleteThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ta bort tråd
            </h3>
            <p className="text-gray-700 mb-4">
              Är du säker på att du vill ta bort denna tråd och alla dess inlägg? Detta kan inte ångras.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDeleteThread(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Avbryt
              </button>
              <button
                onClick={handleDeleteThread}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                disabled={isDeletingThread}
              >
                {isDeletingThread ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    Tar bort...
                  </>
                ) : (
                  <>Ta bort</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadHeader; 
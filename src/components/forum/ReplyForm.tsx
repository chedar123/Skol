import { FC, useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import TiptapEditor from '@/components/common/TiptapEditor';

interface ReplyFormProps {
  threadId: string;
  isLocked: boolean;
  replyContent: string;
  setReplyContent: (content: string) => void;
  replyError: string | undefined;
  handleSubmitReply: (e: FormEvent) => Promise<void>;
}

const ReplyForm: FC<ReplyFormProps> = ({
  threadId,
  isLocked,
  replyContent,
  setReplyContent,
  replyError,
  handleSubmitReply
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleSubmitReply(e);
    setIsSubmitting(false);
  };

  if (isLocked) {
    return (
      <div className="bg-red-50 border border-red-100 p-4 rounded-lg text-red-800 mt-8 flex items-center">
        <Lock className="w-5 h-5 mr-2 flex-shrink-0" />
        <span>Denna tråd är låst och nya svar kan inte längre skrivas.</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 mt-8">
        <p>Du måste vara <a href={`/login?callbackUrl=/forum/thread/${threadId}`} className="underline">inloggad</a> för att kunna skriva svar.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Skriv ett svar</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <TiptapEditor
            content={replyContent}
            onChange={setReplyContent}
            placeholder="Skriv ditt svar här..."
            error={replyError}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting || !replyContent.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                Skickar...
              </>
            ) : (
              'Skicka svar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm; 
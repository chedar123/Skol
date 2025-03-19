import { FC } from 'react';
import { MessageSquare, Eye } from 'lucide-react';

interface ThreadStatsProps {
  postCount: number;
  viewCount: number;
}

const ThreadStats: FC<ThreadStatsProps> = ({ postCount, viewCount }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex items-center gap-6">
        <div className="text-sm text-gray-600 flex items-center">
          <MessageSquare className="w-4 h-4 mr-1" />
          <span>{postCount} inlägg</span>
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          <span>{viewCount} visningar</span>
        </div>
      </div>
    </div>
  );
};

export default ThreadStats; 
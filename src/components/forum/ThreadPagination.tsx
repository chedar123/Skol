import { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ThreadPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const ThreadPagination: FC<ThreadPaginationProps> = ({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <span className="text-sm text-gray-600">
          Sida {currentPage} av {totalPages}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ThreadPagination; 
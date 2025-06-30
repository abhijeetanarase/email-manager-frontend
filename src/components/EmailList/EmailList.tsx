import React, { useState } from 'react';
import EmailListItem from './EmailListItem';
import EmailToolbar from './EmailToolbar';
import { Email } from '../../types/email';
import { SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight, MailOpen, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useGmailContext } from '../../contexts/GmailContext';
import EmailListItemSkeleton from '../Skeleton/EmailListItemSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email , type : string) => void;
  selectedEmail: Email | null;
}

const EmailList: React.FC<EmailListProps> = ({ 
  onEmailSelect,
  selectedEmail
}) => {
  const { emails, fetchLast30Days, currentPage, setCurrentPage, totalPages, loading , updateEmailStatus } = useGmailContext();
  const [isLoading, setIsLoading] = useState(false);


  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchLast30Days();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleStarClick = async(e: React.MouseEvent , email : Email) => {
    e.stopPropagation();
    if (email.starred) {
      // If already starred, unstar it
      onEmailSelect(email , "starred");
      await updateEmailStatus('unstarred', email._id);
      return;
    }
     onEmailSelect(email , "starred");
    await updateEmailStatus( 'starred' ,email._id);
  };

  if (loading) {
    return (
      <div className="bg-white border-r border-gray-200 h-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="p-4 border-b border-gray-200"
          >
            <EmailListItemSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header with pagination controls */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-500 w-2 h-2 rounded-full mr-2"></span>
          Inbox
          {emails.length > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {currentPage} / {totalPages}
            </span>
          )}
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-50 rounded-lg divide-x divide-gray-200 border border-gray-200 shadow-sm">
            <button 
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-l-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="First page"
            >
              <ChevronsLeft size={18} />
            </button>
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleRefresh} 
              className={`p-1.5 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                isLoading ? 'animate-spin' : ''
              }`}
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages || emails.length === 0}
              className={`p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                currentPage === totalPages || emails.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
            <button 
              onClick={handleLastPage}
              disabled={currentPage === totalPages || emails.length === 0}
              className={`p-1.5 rounded-r-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                currentPage === totalPages || emails.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Last page"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
          
          <button 
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm"
            title="Filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>
      
      <EmailToolbar />
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {emails.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full p-6 text-center"
            >
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <MailOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {currentPage > 1 ? "End of inbox" : "No emails found"}
              </h3>
              <p className="text-gray-500 max-w-xs">
                {currentPage > 1 ? 
                  "You've reached the end of your inbox" : 
                  "Try adjusting your filters or refresh to check for new emails"}
              </p>
              {currentPage > 1 && (
                <button
                  onClick={handleFirstPage}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Go to first page
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.ul className="divide-y divide-gray-200">
                {emails.map((email) => (
                  <motion.li
                    key={email.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EmailListItem 
                      email={email}
                      isSelected={selectedEmail?._id === email._id}
                      onClick={() => {onEmailSelect(email , "selection"); updateEmailStatus("read" ,email._id )}}
                      onEmailAction={() => {}} // Add this line or provide your handler
                    />
                  </motion.li>
                ))}
              </motion.ul>
              
              <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
                <span className="text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:text-blue-600 hover:bg-blue-50'
                    } transition-colors`}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || emails.length === 0}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      currentPage === totalPages || emails.length === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:text-blue-600 hover:bg-blue-50'
                    } transition-colors`}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailList;


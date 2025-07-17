import React, { useState } from 'react';
import EmailListItem from './EmailListItem';
import EmailToolbar from './EmailToolbar';
import { Email } from '../../types/email';
import { SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight, MailOpen, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useGmailContext } from '../../contexts/GmailContext';
import EmailListItemSkeleton from '../Skeleton/EmailListItemSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ConfirmArchivePopup from './ConfirmArchivePopup';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email , type : string) => void;
  selectedEmail: Email | null;
}

const EmailList: React.FC<EmailListProps> = ({ 
  onEmailSelect,
  selectedEmail
}) => {
  const { emails, fetchLast30Days, currentPage, setCurrentPage, totalPages, loading , updateEmailStatus, setEmails, bulkUpdateEmails, setCounts, folder } = useGmailContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState<null | 'archive' | 'trash'>(null);


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

 

  // Bulk selection handlers
  const handleCheck = (id: string, checked: boolean) => {
    setSelectedEmailIds(prev =>
      checked ? [...prev, id] : prev.filter(eid => eid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedEmailIds(checked ? emails.map(e => e._id) : []);
  };

  const handleBulkArchive = async () => {
    setShowConfirmPopup('archive');
  };

  const handleBulkTrash = async () => {
    setShowConfirmPopup('trash');
  };

  const getBulkArchivePopupProps = () => {
    if (folder === 'archive') {
      return {
        title: 'Unarchive',
        message: 'Are you sure you want to move selected emails to Inbox?',
        action: 'removearchive'
      };
    }
    if (folder === 'trash') {
      return {
        title: 'Remove from Trash',
        message: 'Are you sure you want to move selected emails to Inbox?',
        action: 'removefromtrash'
      };
    }
    return {
      title: 'Archive',
      message: 'Are you sure you want to archive selected emails?',
      action: 'archive'
    };
  };

  const confirmBulkAction = async () => {
    if (showConfirmPopup === 'archive') {
      const { action } = getBulkArchivePopupProps();
      if (action === 'removearchive' || action === 'removefromtrash') {
        // Unarchive or Remove from Trash
        const updated = emails.filter(e => !selectedEmailIds.includes(e._id));
        setEmails(updated);
        await bulkUpdateEmails(selectedEmailIds, 'inbox');
        setCounts((prev: any) => ({
          ...prev,
          folderCounts: {
            ...prev.folderCounts,
            [folder]: Math.max((prev.folderCounts?.[folder] || 1) - selectedEmailIds.length, 0),
            inbox: (prev.folderCounts?.inbox || 0) + selectedEmailIds.length,
          }
        }));
      } else {
        // Archive
        const updated = emails.filter(e => !selectedEmailIds.includes(e._id));
        setEmails(updated);
        await bulkUpdateEmails(selectedEmailIds, 'archive');
        setCounts((prev: any) => ({
          ...prev,
          folderCounts: {
            ...prev.folderCounts,
            inbox: Math.max((prev.folderCounts?.inbox || 1) - selectedEmailIds.length, 0),
            archive: (prev.folderCounts?.archive || 0) + selectedEmailIds.length,
          }
        }));
      }
    }
    if (showConfirmPopup === 'trash') {
      const updated = emails.filter(e => !selectedEmailIds.includes(e._id));
      setEmails(updated);
      await bulkUpdateEmails(selectedEmailIds, 'trash');
      setCounts((prev: any) => ({
        ...prev,
        folderCounts: {
          ...prev.folderCounts,
          inbox: Math.max((prev.folderCounts?.inbox || 1) - selectedEmailIds.length, 0),
          trash: (prev.folderCounts?.trash || 0) + selectedEmailIds.length,
        }
      }));
    }
    setSelectedEmailIds([]);
    setShowConfirmPopup(null);
  };

  const cancelBulkAction = () => {
    setShowConfirmPopup(null);
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
      {/* Bulk Action Toolbar हटाएँ */}
      {/* Header with pagination controls */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedEmailIds.length === emails.length && emails.length > 0}
            onChange={e => handleSelectAll(e.target.checked)}
            className="accent-blue-600"
          />
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="bg-blue-500 w-2 h-2 rounded-full mr-2"></span>
            Inbox
            {emails.length > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {currentPage} / {totalPages}
              </span>
            )}
          </h2>
        </div>
        
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
            {/* Refresh बटन और Filters बटन हटा दिए गए हैं */}
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
        </div>
      </div>
      {selectedEmailIds.length > 0 && (
        <EmailToolbar
          bulkEnabled={true}
          onBulkArchive={handleBulkArchive}
          onBulkTrash={handleBulkTrash}
          selectedCount={selectedEmailIds.length}
        />
      )}
      {showConfirmPopup === 'archive' && (
        <ConfirmArchivePopup
          open={true}
          onConfirm={confirmBulkAction}
          onCancel={cancelBulkAction}
          title={getBulkArchivePopupProps().title}
          message={getBulkArchivePopupProps().message}
        />
      )}
      {showConfirmPopup === 'trash' && (
        <ConfirmDeletePopup
          open={true}
          onConfirm={confirmBulkAction}
          onCancel={cancelBulkAction}
        />
      )}
      
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
                    key={email._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EmailListItem 
                      email={email}
                      isSelected={selectedEmail?._id === email._id}
                      checked={selectedEmailIds.includes(email._id)}
                      onCheck={checked => handleCheck(email._id, checked)}
                      onClick={() => {onEmailSelect(email , "selection"); updateEmailStatus("read" ,email._id )}}
                      onEmailAction={() => {}} 
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


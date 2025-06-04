import React, { useState } from 'react';
import EmailListItem from './EmailListItem';
import EmailToolbar from './EmailToolbar';
import { Email } from '../../types/email';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useGmailContext } from '../../contexts/GmailContext';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  selectedEmail: Email | null;
}

const EmailList: React.FC<EmailListProps> = ({ 
  onEmailSelect,
  selectedEmail
}) => {
  const{emails} = useGmailContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const {fetchLast30Days} = useGmailContext();

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchLast30Days} 
            className={`p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 ${
              isLoading ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={18} />
          </button>
          <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>
      
      <EmailToolbar />
      
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No emails found</p>
          </div>
        ) : (
          emails.map((email) => (
            <EmailListItem 
              key={email.id} 
              email={email}
              isSelected={selectedEmail?._id === email._id}
              onClick={() => onEmailSelect(email)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmailList;
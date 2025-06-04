import React from 'react';
import { Star, Paperclip } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Email } from '../../types/email';

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onClick }) => {
  const categoryColors = {
    'Interested': 'bg-green-500',
    'Meeting-booked': 'bg-blue-500',
    'not-interested': 'bg-yellow-500',
    'spam': 'bg-red-500',
    'out-of-office': 'bg-purple-500',
  };
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle star click logic here, e.g., toggle starred state
  };
  
  return (
    <div 
      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      } ${!email.read ? 'font-medium' : ''}`}
      onClick={onClick}
    >
      <div className="px-4 py-3 sm:px-6 flex items-center">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="flex-shrink-0 mr-3">
            <button
              onClick={handleStarClick}
              className="text-gray-400 hover:text-yellow-500 focus:outline-none"
            >
              <Star className={`h-5 w-5 ${email.starred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
            </button>
          </div>
          
          <div className="min-w-0 flex-1 px-4">
            <div className="flex items-center justify-between">
              <p className={`text-sm truncate ${!email.read ? 'text-gray-900' : 'text-gray-600'}`}>
                {email.from.name || email.from.email}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="text-xs text-gray-500">{formatRelativeTime(email.receivedAt)}</p>
              </div>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-900 font-medium truncate">{email.subject}</p>
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{email.snippet}</p>
            </div>
            <div className="mt-2 flex items-center">
              {email.hasAttachments && (
                <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {email.category && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  categoryColors[email.category as keyof typeof categoryColors] || 'bg-gray-500'
                } text-white`}>
                  {email.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailListItem;
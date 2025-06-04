import React, { useState } from 'react';
import { 
  Archive, 
  Trash2, 
  Mail, 
  Tag, 
  ChevronDown,
  AlertCircle,
  Calendar,
  XCircle,
  AlertOctagon,
  LogOut
} from 'lucide-react';

const EmailToolbar: React.FC = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center">
      <div className="flex items-center space-x-1 text-gray-700">
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Archive size={18} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Trash2 size={18} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Mail size={18} />
        </button>
        
        <div className="relative">
          <button 
            className="p-1.5 rounded hover:bg-gray-100 flex items-center"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Tag size={18} />
            <ChevronDown size={14} className="ml-1" />
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <AlertCircle size={16} className="mr-2 text-green-500" />
                  Interested
                </button>
                <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  Meeting Booked
                </button>
                <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <XCircle size={16} className="mr-2 text-yellow-500" />
                  Not Interested
                </button>
                <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <AlertOctagon size={16} className="mr-2 text-red-500" />
                  Spam
                </button>
                <button className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2 text-purple-500" />
                  Out of Office
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailToolbar;
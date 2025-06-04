import React, { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import { useGmailContext } from '../../contexts/GmailContext';

interface Account {
  _id: string;
  email: string;
  provider: string;
  unread: number;
}

const AccountSelector: React.FC = () => {
  const { accounts, selectedAccount, setSelectedAccount } = useGmailContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Mail size={16} />
          </div>
          <div className="ml-3 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
              {selectedAccount ? selectedAccount.email : ''}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">
              {selectedAccount ? selectedAccount.provider : ''}
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && accounts && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {accounts.map((account) => (
              <li key={account._id}>
                <button
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                    selectedAccount && selectedAccount._id === account._id
                      ? 'bg-gray-50'
                      : ''
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail size={16} />
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                      {account.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[140px]">
                      {account.provider}
                    </p>
                  </div>
                  {account.unread > 0 && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {account.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
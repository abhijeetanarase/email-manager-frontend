import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import api from '../../utils/api';
import { useGmailContext } from '../../contexts/GmailContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {fetchLast30Days} = useGmailContext();

  useEffect(() => {
    // Fetch user data or perform any initial setup here
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUserData();
  },[]); 

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="text-gray-500 hover:text-gray-700 lg:hidden" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="w-full max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
        </button>
        <div className="ml-3 relative" ref={dropdownRef}>
          <div className="flex items-center">
            <button
              className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {user && user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                // Show initials if no picture
                user
                  ? user.name
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .toUpperCase()
                  : "JD"
              )}
            </button>
          </div>
          {(dropdownOpen && (user || localStorage.getItem("authToken"))) && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
              {user && (
                <div className="flex items-center px-4 py-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                      {user.name
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 break-words truncate max-w-[140px]">{user.name}</div>
                    <div className="text-sm text-gray-500 break-words truncate max-w-[140px]">{user.email}</div>
                  </div>
                </div>
              )}
              <div className="border-t border-gray-100 mt-2"></div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  window.location.href = "/login";
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
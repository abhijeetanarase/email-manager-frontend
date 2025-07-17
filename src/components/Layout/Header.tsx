import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, Menu, X, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import api from '../../utils/api';
import useDebounce from '../../hooks/useDebounce';
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

  const { searchEmails, checkAuth } = useGmailContext();
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
     checkAuth();
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchEmails(debouncedSearch.trim());
    }
  }, [debouncedSearch]);

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

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };



  return (
    <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
      
      </div>
      
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Search emails with subjects and keywords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* <button className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button> */}
        
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
              {user && user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                user
                  ? user.name
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .toUpperCase()
                  : "JD"
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
              {user && (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                          {user.name
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{user.name}</div>
                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                 
                </>
              )}
              
              <div className="border-t border-gray-100"></div>
              
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-3 text-gray-500" />
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
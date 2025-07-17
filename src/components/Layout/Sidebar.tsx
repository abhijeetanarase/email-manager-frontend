import { useEffect, useState } from 'react';

import { 
  Mail, 
  Inbox, 
  Archive, 
  Trash, 
  Settings, 
  PlusCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  Code,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Mailbox,
  ShoppingCart,
  Bell,
  Shield
} from 'lucide-react';
import AccountSelector from './AccountSelector';
import EmailAuthPopup from '../EmailCred/EmailAuthPopup';
import { useGmailContext } from '../../contexts/GmailContext';

const Sidebar = () => {
  const { handleAddAccount, setFolder, folder, counts, filters, setFilters } = useGmailContext();
  const [showPopup, setShowPopup] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contentType: false,
    purpose: false,
    priority: false,
    actionRequired: false,
    timeSensitivity: false,
    senderType: false
  });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    // On mount, respect saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDarkMode(true);
    if (saved === 'light') setDarkMode(false);
  }, []);

 

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox size={18} /> },
    { id: 'archive', name: 'Archive', icon: <Archive size={18} /> },
    { id: 'trash', name: 'Trash', icon: <Trash size={18} /> },
  ];

  const categoryOptions = {
    contentType: [
      { id: 'text-only', name: 'Text-only', icon: <FileText size={16} /> },
      { id: 'media-rich', name: 'Media-rich', icon: <Image size={16} /> },
      { id: 'interactive', name: 'Interactive', icon: <Code size={16} /> }
    ],
    purpose: [
      { id: 'personal', name: 'Personal', icon: <User size={16} /> },
      { id: 'work', name: 'Work', icon: <Mailbox size={16} /> },
      { id: 'transactional', name: 'Transactional', icon: <ShoppingCart size={16} /> },
      { id: 'promotional', name: 'Promotional', icon: <Mail size={16} /> },
      { id: 'newsletter', name: 'Newsletter', icon: <FileText size={16} /> },
      { id: 'notification', name: 'Notification', icon: <Bell size={16} /> },
      { id: 'spam', name: 'Spam', icon: <Shield size={16} /> }
    ],
    priority: [
      { id: 'urgent', name: 'Urgent', icon: <AlertTriangle size={16} /> },
      { id: 'high', name: 'High', icon: <AlertTriangle size={16} /> },
      { id: 'normal', name: 'Normal', icon: <FileText size={16} /> },
      { id: 'low', name: 'Low', icon: <FileText size={16} /> }
    ],
    actionRequired: [
      { id: 'immediate-action', name: 'Immediate Action', icon: <AlertTriangle size={16} /> },
      { id: 'follow-up-needed', name: 'Follow-up Needed', icon: <Clock size={16} /> },
      { id: 'read-later', name: 'Read Later', icon: <Calendar size={16} /> },
      { id: 'informational-only', name: 'Informational Only', icon: <FileText size={16} /> }
    ],
    timeSensitivity: [
      { id: 'time-sensitive', name: 'Time-sensitive', icon: <Clock size={16} /> },
      { id: 'evergreen', name: 'Evergreen', icon: <Calendar size={16} /> }
    ],
    senderType: [
      { id: 'human', name: 'Human', icon: <User size={16} /> },
      { id: 'automated', name: 'Automated', icon: <Code size={16} /> },
      { id: 'company', name: 'Company', icon: <Mailbox size={16} /> }
    ]
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleClosePopup = () => setShowPopup(false);
  const handleSubmitPopup = async (email: string, appPassword: string) => {
    const result = await handleAddAccount(email, appPassword);
    if (result.success) setShowPopup(false);
    return result;
  };

  // Helper function for category counts
  function getCategoryCount(category: string, itemId: string) {
    const apiCounts = counts?.categoryCounts?.[category];
    if (!apiCounts) return 0;
    if (apiCounts[itemId]) return apiCounts[itemId];
    const found = Object.entries(apiCounts).find(
      ([key]) => key.toLowerCase().replace(/ /g, '-').replace(/_/g, '-') === itemId
    );
    return found ? found[1] : 0;
  }

  // Helper functions for filters
  const isFilterApplied = (cat: string, val: string) => (filters[cat] || []).includes(val);
  const toggleFilter = (cat: string, val: string) => {
    setFilters((prev: Record<string, string[]>) => {
      const arr = prev[cat] || [];
      if (arr.includes(val)) {
        return { ...prev, [cat]: arr.filter((v: string) => v !== val) };
      } else {
        return { ...prev, [cat]: [...arr, val] };
      }
    });
  };
  const removeFilter = (cat: string, val: string) => {
    setFilters((prev: Record<string, string[]>) => ({ ...prev, [cat]: (prev[cat] || []).filter((v: string) => v !== val) }));
  };
  const totalFiltersApplied = Object.values(filters).reduce((a, b) => a + b.length, 0);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold flex items-center text-blue-600">
          <Mail className="mr-2" /> OneBox
        </h1>
      </div>

      <div className="p-4">
        <AccountSelector />

        <button
          type='button'
          className="w-full mt-4 bg-blue-600 text-white rounded-md py-2 px-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={() => setShowPopup(true)}
        >
          <PlusCircle size={18} className="mr-2" /> Add Account
        </button>
        {showPopup && (
          <EmailAuthPopup onClose={handleClosePopup} onSubmit={handleSubmitPopup} />
        )}
      </div>

      {totalFiltersApplied > 0 && (
        <div className="px-4 py-2">
          <span className="text-xs text-gray-600 font-medium">
            {totalFiltersApplied} filters applied
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(filters).flatMap(([cat, vals]) =>
              vals.map(val => (
                <span key={cat+val} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs flex items-center">
                  {val}
                  <button onClick={() => removeFilter(cat, val)} className="ml-1 text-blue-500 hover:text-blue-700">&times;</button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <nav className="mt-4 flex-1 overflow-y-auto">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Folders</h2>
          <ul>
            {folders.map((f) => (
              <li onClick={() => setFolder(f.name.toLowerCase())} key={f.id}>
                <div
                  className={`flex items-center justify-between py-2 px-3 ${f.name.toLowerCase() === folder ? 'bg-gray-100' : '' } rounded-md hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex items-center">
                    {f.icon}
                    <span className="ml-2 text-gray-700">{f.name}</span>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">
                    {counts?.folderCounts?.[f.name.toLowerCase()] ?? 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Category Sections */}
        {Object.entries(categoryOptions).map(([category, items]) => (
          <div key={category} className="px-4 mt-2">
            <button
              onClick={() => toggleSection(category)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              {expandedSections[category] ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>

            {expandedSections[category] && (
              <ul className="ml-4 mt-1 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${isFilterApplied(category, item.name)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}
                      `}
                      onClick={() => toggleFilter(category, item.name)}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <a 
          href="#" 
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors py-2"
        >
          <Settings size={18} className="mr-2" />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
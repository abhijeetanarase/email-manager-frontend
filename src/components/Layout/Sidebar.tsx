import React, { useState } from 'react';
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
  const { handleAddAccount } = useGmailContext();
  const [showPopup, setShowPopup] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contentType: false,
    purpose: false,
    priority: false,
    actionRequired: false,
    timeSensitivity: false,
    senderType: false
  });

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: <Inbox size={18} />, count: 24 },
    { id: 'archive', name: 'Archive', icon: <Archive size={18} />, count: 156 },
    { id: 'trash', name: 'Trash', icon: <Trash size={18} />, count: 8 },
  ];

  const categoryOptions = {
    contentType: [
      { id: 'text-only', name: 'Text-only', icon: <FileText size={16} />, count: 45 },
      { id: 'media-rich', name: 'Media-rich', icon: <Image size={16} />, count: 12 },
      { id: 'interactive', name: 'Interactive', icon: <Code size={16} />, count: 8 }
    ],
    purpose: [
      { id: 'personal', name: 'Personal', icon: <User size={16} />, count: 32 },
      { id: 'work', name: 'Work', icon: <Mailbox size={16} />, count: 28 },
      { id: 'transactional', name: 'Transactional', icon: <ShoppingCart size={16} />, count: 15 },
      { id: 'promotional', name: 'Promotional', icon: <Mail size={16} />, count: 22 },
      { id: 'newsletter', name: 'Newsletter', icon: <FileText size={16} />, count: 18 },
      { id: 'notification', name: 'Notification', icon: <Bell size={16} />, count: 10 },
      { id: 'spam', name: 'Spam', icon: <Shield size={16} />, count: 20 }
    ],
    priority: [
      { id: 'urgent', name: 'Urgent', icon: <AlertTriangle size={16} />, count: 5 },
      { id: 'high', name: 'High', icon: <AlertTriangle size={16} />, count: 12 },
      { id: 'normal', name: 'Normal', icon: <FileText size={16} />, count: 85 },
      { id: 'low', name: 'Low', icon: <FileText size={16} />, count: 23 }
    ],
    actionRequired: [
      { id: 'immediate-action', name: 'Immediate Action', icon: <AlertTriangle size={16} />, count: 7 },
      { id: 'follow-up-needed', name: 'Follow-up Needed', icon: <Clock size={16} />, count: 15 },
      { id: 'read-later', name: 'Read Later', icon: <Calendar size={16} />, count: 22 },
      { id: 'informational-only', name: 'Informational Only', icon: <FileText size={16} />, count: 61 }
    ],
    timeSensitivity: [
      { id: 'time-sensitive', name: 'Time-sensitive', icon: <Clock size={16} />, count: 18 },
      { id: 'evergreen', name: 'Evergreen', icon: <Calendar size={16} />, count: 87 }
    ],
    senderType: [
      { id: 'human', name: 'Human', icon: <User size={16} />, count: 65 },
      { id: 'automated', name: 'Automated', icon: <Code size={16} />, count: 25 },
      { id: 'company', name: 'Company', icon: <Mailbox size={16} />, count: 15 }
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
    await handleAddAccount(email, appPassword);
    setShowPopup(false);
  };

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

      <nav className="mt-4 flex-1 overflow-y-auto">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Folders</h2>
          <ul>
            {folders.map((folder) => (
              <li key={folder.id}>
                <a
                  href="#"
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    {folder.icon}
                    <span className="ml-2 text-gray-700">{folder.name}</span>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">
                    {folder.count}
                  </span>
                </a>
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
              <ul className="ml-4 mt-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">{item.icon}</span>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded-full">
                        {item.count}
                      </span>
                    </a>
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
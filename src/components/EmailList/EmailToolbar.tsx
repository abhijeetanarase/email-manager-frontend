import React from 'react';
import { Archive, Trash2, Inbox } from 'lucide-react';
import { useGmailContext } from '../../contexts/GmailContext';

interface EmailToolbarProps {
  onBulkArchive?: () => void;
  onBulkTrash?: () => void;
  bulkEnabled?: boolean;
  selectedCount?: number;
}

const EmailToolbar: React.FC<EmailToolbarProps> = ({ onBulkArchive, onBulkTrash, bulkEnabled, selectedCount }) => {
  const { folder } = useGmailContext();
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center">
      <div className="flex items-center space-x-2 text-gray-700">
        <button
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={onBulkArchive}
          disabled={!bulkEnabled}
          title={folder === 'archive' ? 'Move to Inbox' : 'Archive selected'}
        >
          {folder === 'archive' ? <Inbox size={18} /> : <Archive size={18} />}
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={onBulkTrash}
          disabled={!bulkEnabled}
          title="Trash selected"
        >
          <Trash2 size={18} />
        </button>
        <span className="text-sm text-gray-700">{selectedCount} selected</span>
      </div>
    </div>
  );
};

export default EmailToolbar;
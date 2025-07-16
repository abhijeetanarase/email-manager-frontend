import React, { useState } from "react";
import {
  Star,
  FileText,
  Paperclip,
  AlertCircle,
  Clock,
  Folder,
  Mail,
  User,
  AlertTriangle,
  Briefcase,
  ShoppingCart,
  Bell,
  Shield,
  Archive,
  Trash2,
  Inbox,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { Email } from "../../types/email";
import { useGmailContext } from "../../contexts/GmailContext";
import ConfirmDeletePopup from "./ConfirmDeletePopup";

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  onClick: () => void;
  onEmailAction: (email: Email) => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({
  email,
  isSelected,
  checked,
  onCheck,
  onClick,
}) => {

      const {emails , setEmails , updateEmailStatus, setCounts, folder} = useGmailContext();
     
      
  const [isHovered, setIsHovered] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);


  // New functions to handle email actions
  const handleStarClick = async(e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedEmails = emails.map((em) =>
      em._id === email._id ? { ...em, starred: !em.starred } : em
    );
    setEmails(updatedEmails);
    await updateEmailStatus( email.starred ? "unstarred" : "starred", email._id);
  };

  

  

  const handleArchive = async(e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder === 'archive') {
      // Unarchive
      const updated = emails.filter(em =>
        em._id != email._id 
      );
      setEmails(updated);
      await updateEmailStatus('removearchive', email._id);
      setCounts((prev: any) => ({
        ...prev,
        folderCounts: {
          ...prev.folderCounts,
          archive: Math.max((prev.folderCounts?.archive || 1) - 1, 0),
          inbox: (prev.folderCounts?.inbox || 0) + 1,
        }
      }));
    } else {
      // Archive
      const filteredEmails  = emails.filter((em)=> em._id != email._id)
      setEmails(filteredEmails);
      await updateEmailStatus('archive' , email._id);
      setCounts((prev: any) => ({
        ...prev,
        folderCounts: {
          ...prev.folderCounts,
          inbox: Math.max((prev.folderCounts?.inbox || 1) - 1, 0),
          archive: (prev.folderCounts?.archive || 0) + 1,
        }
      }));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    const filteredEmails = emails.filter((em) => em._id != email._id);
    setEmails(filteredEmails);
    await updateEmailStatus("trash", email._id);
    setCounts((prev: any) => ({
      ...prev,
      folderCounts: {
        ...prev.folderCounts,
        inbox: Math.max((prev.folderCounts?.inbox || 1) - 1, 0),
        trash: (prev.folderCounts?.trash || 0) + 1,
      }
    }));
    setShowDeletePopup(false);
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  // Icon mapping for different purposes
  const purposeIcons = {
    Personal: <User className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Work: <Briefcase className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Transactional: <ShoppingCart className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Promotional: <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Newsletter: <FileText className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Notification: <Bell className="w-3 h-3 mr-1.5 flex-shrink-0" />,
    Spam: <Shield className="w-3 h-3 mr-1.5 flex-shrink-0" />,
  };

  // Tag style variants
  const tagVariants = {
    purpose: {
      Personal: "bg-blue-100 text-blue-800",
      Work: "bg-indigo-100 text-indigo-800",
      Transactional: "bg-teal-100 text-teal-800",
      Promotional: "bg-purple-100 text-purple-800",
      Newsletter: "bg-cyan-100 text-cyan-800",
      Notification: "bg-green-100 text-green-800",
      Spam: "bg-red-100 text-red-800",
    },
    senderType: {
      Human: "bg-amber-100 text-amber-800",
      Automated: "bg-gray-100 text-gray-800",
      Company: "bg-gray-200 text-gray-800",
    },
    contentType: {
      "Text-only": "bg-gray-50 text-gray-700 border border-gray-200",
      "Media-rich": "bg-pink-50 text-pink-700 border border-pink-200",
      Interactive: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    priority: {
      Urgent: "bg-red-100 text-red-800",
      High: "bg-orange-100 text-orange-800",
      Normal: "bg-yellow-100 text-yellow-800",
      Low: "bg-gray-100 text-gray-800",
    },
    actionRequired: {
      "Immediate Action": "bg-red-100 text-red-800",
      "Follow-up Needed": "bg-orange-100 text-orange-800",
      "Read Later": "bg-blue-100 text-blue-800",
      "Informational Only": "bg-gray-100 text-gray-800",
    },
    timeSensitivity: {
      "Time-sensitive": "bg-rose-100 text-rose-800",
      Evergreen: "bg-emerald-100 text-emerald-800",
    },
  };

  return (
    <div
      className={`border-b border-gray-200 px-4 py-4 transition-colors duration-150 cursor-pointer 
        ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"} 
        ${!email.read ? "bg-blue-50/30" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3 items-start">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onCheck(e.target.checked)}
          onClick={e => e.stopPropagation()}
          className="mt-1 accent-blue-600"
        />
        {/* Star */}
        <button
          onClick={(e) => handleStarClick(e)}
          className="pt-1 text-gray-400 hover:text-yellow-500 transition-colors"
          title="Star"
          aria-label={email.starred ? "Unstar email" : "Star email"}
        >
          <Star
            className={`w-4 h-4 transition ${
              email.starred ? "text-yellow-500 fill-yellow-500" : ""
            }`}
          />
        </button>

        {/* Email Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p
              className={`text-sm truncate max-w-[60%] ${
                !email.read ? "text-gray-900 font-semibold" : "text-gray-700"
              }`}
            >
              {email?.from?.name || email?.from?.email}
            </p>
            
            <div className="flex items-center ml-2 shrink-0">
              {/* Show time when not hovered or selected */}
              {(!isHovered && !isSelected) && (
                <p
                  className={`text-xs ${
                    !email.read ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {formatRelativeTime(email.receivedAt)}
                </p>
              )}
              
              {/* Show action buttons when hovered or selected */}
              {(isHovered || isSelected) && (
                <div className="flex items-center gap-1">
                  
                  
                  <button
                    onClick={handleArchive}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    title="Archive"
                    aria-label="Archive"
                  >
                    {folder === 'archive' ? <Inbox size={18} /> : <Archive size={18} />}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <p
            className={`text-sm truncate ${
              !email.read ? "text-gray-900 font-semibold" : "text-gray-800"
            }`}
          >
            {email.subject}
          </p>

          <p
            className={`text-sm line-clamp-1 ${
              !email.read ? "text-gray-700" : "text-gray-600"
            }`}
          >
            {email.snippet || (email.body ? email.body.substring(0, 100) + "..." : "")}
          </p>

          {/* Tags & Icons */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {email.hasAttachments && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200">
                <Paperclip className="w-3 h-3 mr-1.5 flex-shrink-0" />
                Attachment
              </span>
            )}

            {email.purpose && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tagVariants.purpose[
                    email.purpose as keyof typeof tagVariants.purpose
                  ]
                }`}
              >
                {purposeIcons[email.purpose as keyof typeof purposeIcons]}
                {email.purpose}
              </span>
            )}

            {email.senderType && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tagVariants.senderType[
                    email.senderType as keyof typeof tagVariants.senderType
                  ]
                }`}
              >
                <User className="w-3 h-3 mr-1.5 flex-shrink-0" />
                {email.senderType}
              </span>
            )}

            {email.contentType && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tagVariants.contentType[
                    email.contentType as keyof typeof tagVariants.contentType
                  ]
                }`}
              >
                <FileText className="w-3 h-3 mr-1.5 flex-shrink-0" />
                {email.contentType}
              </span>
            )}

            {email.priority && email.priority !== "Normal" && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tagVariants.priority[
                    email.priority as keyof typeof tagVariants.priority
                  ]
                }`}
              >
                <AlertTriangle className="w-3 h-3 mr-1.5 flex-shrink-0" />
                {email.priority}
              </span>
            )}

            {email.actionRequired &&
              email.actionRequired !== "Informational Only" && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tagVariants.actionRequired[
                      email.actionRequired as keyof typeof tagVariants.actionRequired
                    ]
                  }`}
                >
                  <AlertCircle className="w-3 h-3 mr-1.5 flex-shrink-0" />
                  {email.actionRequired}
                </span>
              )}

            {email.topicDepartment && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                <Folder className="w-3 h-3 mr-1.5 flex-shrink-0" />
                {email.topicDepartment}
              </span>
            )}

            {email.timeSensitivity &&
              email.timeSensitivity !== "Evergreen" && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tagVariants.timeSensitivity[
                      email.timeSensitivity as keyof typeof tagVariants.timeSensitivity
                    ]
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                  {email.timeSensitivity}
                </span>
              )}

            {email.folder && email.folder !== "inbox" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                {email.folder.charAt(0).toUpperCase() + email.folder.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
      <ConfirmDeletePopup
        open={showDeletePopup}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default EmailListItem;
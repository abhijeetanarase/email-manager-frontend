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
  MailOpen,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { Email } from "../../types/email";
import { useGmailContext } from "../../contexts/GmailContext";

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
  onEmailAction: (email: Email) => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({
  email,
  isSelected,
  onClick,
}) => {

      const {emails , setEmails , updateEmailStatus} = useGmailContext();
     
      
  const [isHovered, setIsHovered] = useState(false);


  // New functions to handle email actions
  const handleStarClick = async(e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedEmails = emails.map((em) =>
      em._id === email._id ? { ...em, starred: !em.starred } : em
    );
    setEmails(updatedEmails);
    await updateEmailStatus( email.starred ? "unstarred" : "starred", email._id);
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
   
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
   
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
   
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
                    onClick={handleToggleRead}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    title={email.read ? "Mark as unread" : "Mark as read"}
                    aria-label={email.read ? "Mark as unread" : "Mark as read"}
                  >
                    <MailOpen className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleArchive}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    title="Archive"
                    aria-label="Archive"
                  >
                    <Archive className="w-4 h-4" />
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
    </div>
  );
};

export default EmailListItem;
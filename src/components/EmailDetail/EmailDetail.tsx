import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Archive,
  Trash2,
  Reply,
  Forward,
  Star,
  Paperclip,
  Calendar,
  ThumbsUp,
  AlertCircle,
  ExternalLink,
  CornerDownLeft,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import { Email } from "../../types/email";
import { formatDate } from "../../utils/dateUtils";
import EmailReplyBox from "./EmailReplyBox";
import EmptyEmailView from "./EmptyEmailView";

interface EmailDetailProps {
  email: Email | null;
  onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
  const [showReply, setShowReply] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const replyBoxRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);

  // Scroll to reply box when it is shown, or restore scroll when hidden
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    if (showReply) {
      // Save current scroll position
      scrollPosition.current = scrollContainerRef.current.scrollTop;
      
      // Scroll to reply box after it's rendered
      setTimeout(() => {
        if (replyBoxRef.current) {
          replyBoxRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 0);
    } else {
      // Restore original scroll position
      scrollContainerRef.current.scrollTo({
        top: scrollPosition.current,
        behavior: 'smooth'
      });
    }
  }, [showReply]);

  if (!email) {
    return <EmptyEmailView />;
  }

  const categoryColors = {
    interested: "bg-green-100 text-green-800",
    "meeting-booked": "bg-blue-100 text-blue-800",
    "not-interested": "bg-yellow-100 text-yellow-800",
    spam: "bg-red-100 text-red-800",
    "out-of-office": "bg-purple-100 text-purple-800",
  };

  const categoryIcons = {
    interested: <AlertCircle size={16} className="mr-1" />,
    "meeting-booked": <Calendar size={16} className="mr-1" />,
    "not-interested": <ThumbsUp size={16} className="transform rotate-180 mr-1" />,
    spam: <AlertCircle size={16} className="mr-1" />,
    "out-of-office": <ExternalLink size={16} className="mr-1" />,
  };

  const handleDownload = (
    attachmentUrl: string | undefined,
    filename: string | undefined
  ) => {
    if (!attachmentUrl || !filename) return;
    // Use fetch and blob for cross-origin safe download
    fetch(attachmentUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // fallback: open in new tab if download fails
        window.open(attachmentUrl, "_blank");
      });
  };

  const handleView = (attachmentUrl: string | undefined) => {
    if (!attachmentUrl) return;
    // Open attachment in a new tab
    window.open(attachmentUrl, "_blank");
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 lg:hidden mr-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-medium text-gray-700 hidden sm:block">
            Message
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Archive"
          >
            <Archive size={18} />
          </button>
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            onClick={() => setShowReply((prev) => !prev)}
            title="Reply"
          >
            <Reply size={18} />
          </button>
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Forward"
          >
            <Forward size={18} />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6" ref={scrollContainerRef}>
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {email.subject}
            </h1>
            <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
              <Star
                className={`h-5 w-5 ${
                  email.starred ? "text-yellow-500 fill-yellow-500" : ""
                }`}
              />
            </button>
          </div>

          {email.category && (
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  categoryColors[
                    email.category as keyof typeof categoryColors
                  ] || "bg-gray-100 text-gray-800"
                }`}
              >
                {categoryIcons[email.category as keyof typeof categoryIcons]}
                <span className="capitalize">
                  {email.category.replace(/-/g, " ")}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white font-medium text-lg">
                  {email.from?.name
                    ? email.from.name.charAt(0).toUpperCase()
                    : email.from?.email?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-base font-medium text-gray-900">
                    {email.from?.name || email.from?.email}
                  </h3>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {email.from?.email?.includes("@gmail.com")
                      ? "Gmail"
                      : email.from?.email?.includes("@outlook.com") ||
                        email.from?.email?.includes("@hotmail.com")
                      ? "Outlook"
                      : "Email"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  to me
                  {email.cc?.length ? `, ${email.cc.length} cc` : ""}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 flex items-center">
              <span>{formatDate(email.receivedAt)}</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-6 pl-16">
              {email.hasAttachments && (
                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center border-b border-gray-200">
                    <Paperclip className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {email.attachments?.length} attachment
                      {email.attachments?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {email.attachments?.map((attachment, index) => {
                      const formatSize = (size: number) => {
                        if (size >= 1024 * 1024 * 1024)
                          return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
                        if (size >= 1024 * 1024)
                          return (size / (1024 * 1024)).toFixed(2) + " MB";
                        if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
                        return size + " B";
                      };

                      const getFileIcon = (filename: string) => {
                        const extension = filename.split('.').pop()?.toLowerCase();
                        switch (extension) {
                          case 'pdf':
                            return <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center text-red-500">PDF</div>;
                          case 'doc':
                          case 'docx':
                            return <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-500">DOC</div>;
                          case 'xls':
                          case 'xlsx':
                            return <div className="h-10 w-10 bg-green-100 rounded flex items-center justify-center text-green-500">XLS</div>;
                          case 'jpg':
                          case 'jpeg':
                          case 'png':
                          case 'gif':
                            return <div className="h-10 w-10 bg-purple-100 rounded flex items-center justify-center text-purple-500">IMG</div>;
                          default:
                            return <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-gray-500">{extension?.toUpperCase() || 'FILE'}</div>;
                        }
                      };

                      return (
                        <div
                          key={index}
                          className="px-4 py-3 flex items-center hover:bg-gray-50 transition-colors"
                        >
                          {getFileIcon(attachment.filename || 'file')}
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.filename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatSize(Number(attachment.size))}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleView(attachment.url)}
                              className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(attachment.url, attachment.filename)
                              }
                              className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="prose max-w-none text-gray-800">
                <iframe
                  srcDoc={email.body}
                  className="w-full h-[500px] border-0 rounded-lg bg-white shadow-xs"
                  sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setShowReply(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </button>
              </div>
            </div>
          )}
        </div>

        {showReply && (
          <div className="mt-6 border-t border-gray-200 pt-6" ref={replyBoxRef}>
            <EmailReplyBox email={email} showReply={showReply} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail;
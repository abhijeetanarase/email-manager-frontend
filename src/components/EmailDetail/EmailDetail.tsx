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
} from "lucide-react";
import { Email } from "../../types/email";
import { formatDate } from "../../utils/dateUtils";
import EmailReplyBox from "./EmailReplyBox";

interface EmailDetailProps {
  email: Email | null;
  onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
  const [showReply, setShowReply] = useState(false);
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
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Select an email to view</p>
      </div>
    );
  }

  const categoryColors = {
    interested: "bg-green-500",
    "meeting-booked": "bg-blue-500",
    "not-interested": "bg-yellow-500",
    spam: "bg-red-500",
    "out-of-office": "bg-purple-500",
  };

  const categoryIcons = {
    interested: <AlertCircle size={16} />,
    "meeting-booked": <Calendar size={16} />,
    "not-interested": <ThumbsUp size={16} className="transform rotate-180" />,
    spam: <AlertCircle size={16} />,
    "out-of-office": <ExternalLink size={16} />,
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
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center space-x-2">
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
            <Archive size={20} />
          </button>
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
            <Trash2 size={20} />
          </button>
          <button
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={() => setShowReply((prev) => !prev)}
          >
            <Reply size={20} />
          </button>
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
            <Forward size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {email.subject}
            </h1>
            <button className="p-1 text-gray-400 hover:text-yellow-500">
              <Star
                className={`h-5 w-5 ${
                  email.starred ? "text-yellow-500 fill-yellow-500" : ""
                }`}
              />
            </button>
          </div>

          {email.category && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[
                    email.category as keyof typeof categoryColors
                  ] || "bg-gray-500"
                } text-white`}
              >
                {categoryIcons[email.category as keyof typeof categoryIcons]}
                <span className="ml-1">{email.category}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start mb-6">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
              {email.from.name
                ? email.from.name.charAt(0)
                : email.from.email.charAt(0)}
            </div>
          </div>

          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {email.from.name || email.from.email}
                </h3>
                <p className="text-xs text-gray-500">{email.from.email}</p>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(email.receivedAt)}
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-500">
              <span>To: </span>
              <span className="text-gray-900">
                {email.to.map((recipient) => recipient.email).join(", ")}
              </span>
            </div>

            {email.hasAttachments && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Paperclip className="h-5 w-5 mr-2" />
                  <span>
                    {email.attachments.length} attachment
                    {email.attachments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  {email.attachments.map((attachment, index) => {
                    // Format size (bytes to KB/MB/GB)
                    const formatSize = (size: number) => {
                      if (size >= 1024 * 1024 * 1024)
                        return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
                      if (size >= 1024 * 1024)
                        return (size / (1024 * 1024)).toFixed(2) + " MB";
                      if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
                      return size + " B";
                    };
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-3 flex items-center"
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3 overflow-hidden flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatSize(Number(attachment.size))}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() =>
                              handleDownload(
                                attachment.url,
                                attachment.filename
                              )
                            }
                            className="p-1 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleView(attachment.url)}
                            className="p-1 text-gray-500 hover:text-green-500 hover:bg-gray-100 rounded"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-gray-200 pt-4">
              <iframe
                srcDoc={email.body}
                className="w-full h-[500px] border-0"
                sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
              />
            </div>
          </div>
        </div>

        {showReply && (
          <div
            className="mt-6 border-t border-gray-200 pt-6"
            ref={replyBoxRef}
          >
            <EmailReplyBox email={email} showReply = {showReply} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailDetail;

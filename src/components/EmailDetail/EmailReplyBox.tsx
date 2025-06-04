import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Paperclip, Smile, Bot } from 'lucide-react';
import { Email } from '../../types/email';
import { socketUrl } from '../../utils/constants';
import api from '../../utils/api';
import { useGmailContext } from '../../contexts/GmailContext';

interface EmailReplyBoxProps {
  email: Email;
  showReply?: boolean;
}

const EmailReplyBox: React.FC<EmailReplyBoxProps> = ({ email , showReply}) => {
  const [replyContent, setReplyContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(`Suggest me the replies for this body: ${email.body} all relpis should be in one array and each reply should be in double quotes and separated by comma don't add numbering make sure reply format is like this Eg. ["hello abhi , thank you", "reply2", "reply3"]`);
  const [reply, setReply] = useState<string>('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [subject, setSubject] = useState<string>(`Re: ${email.subject || ""}`);
  const ws = useRef<WebSocket | null>(null);
  const {selectedAccount} = useGmailContext();
  // Move handleSend outside useEffect and fix its usage
   const handleSend = () => {
    if (!prompt.trim()) return;

    console.log('Sending prompt:', prompt);

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt }));
    } else {
      console.error('WebSocket is not open. Current state:', ws.current?.readyState);
      // Optionally implement reconnect logic here
    }
  };

// WebSocket connection management
  useEffect(() => {
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      return;
    }

    // Ensure proper URL formatting
    const baseUrl = socketUrl.replace(/\/$/, '');

    // Initialize new WebSocket connection only if not already open
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      ws.current = new WebSocket(`${baseUrl}?token=${encodeURIComponent(token)}`);

      ws.current.onopen = () => {
        console.log('WebSocket connection successfully established');
        // Send the prompt as soon as the connection is open
        if (prompt.trim() && aiSuggestions.length === 0) {
          ws.current?.send(JSON.stringify({ prompt }));
        }
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          // If data.suggestions is already an array, use it directly
          if (Array.isArray(data.suggestions)) {
            setAiSuggestions(data.suggestions);
            console.log('AI-generated suggestions received:', data.suggestions);
            // Set first suggestion as default in textarea
            if (data.suggestions.length > 0) {
              setReplyContent(data.suggestions[0]);
            }
          } else if (typeof data.reply === "string") {
            // Try to extract array from string between [ and ]
            const match = data.reply.match(/\[([^\]]*)\]/);
            if (match) {
              // Get the content inside the brackets
              const arrayContent = match[1];
              // Split by comma that is followed by a quote, remove quotes and trim
              let suggestions = arrayContent
                .split(/",\s*"/g)
                .map((s: any) => s.replace(/^"|"$/g, '').trim())
                .filter(Boolean);
              // Remove the first " from the start of the first element if present
              if (suggestions.length && suggestions[0].startsWith('"')) {
                suggestions[0] = suggestions[0].substring(1);
              }
              setAiSuggestions(suggestions);
              console.log('Extracted suggestions:', suggestions);
              // Set first suggestion as default in textarea
              if (suggestions.length > 0) {
                setReplyContent(suggestions[0]);
              }
            }
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setSendError('Failed to process AI response');
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setSendError('AI service connection error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        // Optional: Implement reconnect logic here
      };
    }

    // Cleanup: Only close the connection when the component unmounts
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
        console.log('Cleaning up WebSocket connection');
      }
    };
  }, [token]); // Only re-run if token changes

  

  useEffect(() => {
    if (ws.current?.readyState === WebSocket.OPEN && aiSuggestions.length ==0) {
      handleSend();
    } 
     if (aiSuggestions.length > 0) {
      setIsLoadingSuggestions(false);
    } else {
      setIsLoadingSuggestions(true);
    }
  }, [aiSuggestions, ws.current?.readyState]);

  useEffect(() => {
    if (!showReply) {
      setAiSuggestions([]);
      setReplyContent('');
      setIsLoadingSuggestions(false);
      setSendError(null);
      setReply('');
    }
    else{
      setReplyContent('');
      setIsLoadingSuggestions(true);
      setSendError(null);
      setReply('');
      setPrompt(`Suggest me the replies for this body: ${email.body} all relpis should be in one array and each reply should be in double quotes and separated by comma don't add numbering make sure reply format is like this Eg. ["hello abhi , thank you", "reply2", "reply3"]`);
    }
  

  }, [showReply]);

  

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    
    try {
      setIsSending(true);
      setSendError(null);
    
      await api.post('/email', {
        id : selectedAccount?._id,
        subject,
        text: replyContent,
        to : email.from.email,
      });
      setReplyContent('');
      // alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      setSendError('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const applyAiSuggestion = (suggestion: string) => {
    setReplyContent(suggestion);
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            To: <span className="text-gray-900">{email.from.email}</span>
          </span>
        </div>
        <div className="mt-2">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>
      
      <div className="p-3">
        <textarea
          className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        
        {sendError && (
          <div className="mt-2 text-red-600 text-sm">{sendError}</div>
        )}
        
        {(isLoadingSuggestions || aiSuggestions.length > 0) && (
          <div className="mt-3">
            <div className="flex items-center mb-2">
              <Bot size={16} className="text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">AI Suggested Replies</span>
            </div>
            
            {isLoadingSuggestions ? (
              <div className="flex space-x-2 items-center text-gray-500 text-sm">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>Generating suggestions...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-sm p-2 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={() => applyAiSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200">
        {/* <div className="flex space-x-2">
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
            <Paperclip size={18} />
          </button>
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
            <Smile size={18} />
          </button>
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
            <Plus size={18} />
          </button>
        </div> */}
        
        <button
          className={`flex items-center px-4 py-2 rounded-md ${
            replyContent.trim() && !isSending
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!replyContent.trim() || isSending}
          onClick={handleSendReply}
        >
          <Send size={16} className={`mr-2 ${isSending ? 'animate-pulse' : ''}`} />
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default EmailReplyBox;
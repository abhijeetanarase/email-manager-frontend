import React, { useState, useRef } from 'react';
import Sidebar from './components/Layout/Sidebar';
import EmailList from './components/EmailList/EmailList';
import EmailDetail from './components/EmailDetail/EmailDetail';
import Header from './components/Layout/Header';
import { useGmailContext } from './contexts/GmailContext';
import { Email } from './types/email';

const App = () => {
  // अब panels में सिर्फ sidebar की state रहेगी
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { emails } = useGmailContext();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // EmailList की width के लिए state
  const [listWidth, setListWidth] = useState(400); // default 400px
  const minWidth = 250;
  const maxWidth = 700;
  const isResizing = useRef(false);

  const handleEmailSelect = (email: Email, type: string) => {
    setSelectedEmail(email);
  };

  const handleBack = () => {
    setSelectedEmail(null);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      // Sidebar की width अगर है तो उसे भी consider करें
      const sidebarWidth = sidebarOpen ? 240 : 0;
      let newWidth = e.clientX - sidebarWidth;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setListWidth(newWidth);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarOpen]);

  return (
    <div className="h-screen flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen((open) => !open)} sidebarOpen={sidebarOpen} />
     
     
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && <Sidebar />}
        {/* EmailList adjustable width */}
        <div
          className="flex flex-col min-h-0"
          style={{ width: listWidth, minWidth: minWidth, maxWidth: maxWidth }}
        >
          <EmailList emails={emails} onEmailSelect={handleEmailSelect} selectedEmail={selectedEmail} />
        </div>
        {/* Draggable divider */}
        <div
          style={{ width: 6, cursor: 'col-resize', background: '#e5e7eb', zIndex: 10 }}
          onMouseDown={handleMouseDown}
          className="hover:bg-blue-300 transition-colors"
        />
        {/* EmailDetail fills remaining space */}
        <div className="flex-1 flex flex-col min-w-0">
          <EmailDetail email={selectedEmail} onBack={handleBack} />
        </div>
      </div>
    </div>
  );
};

export default App;

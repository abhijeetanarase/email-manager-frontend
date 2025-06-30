import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import EmailList from '../components/EmailList/EmailList';
import EmailDetail from '../components/EmailDetail/EmailDetail';
// import { mockEmails } from '../mockData/emails';
import { Email } from '../types/email';
import { useGmailContext } from '../contexts/GmailContext';

function Box() {
  const {emails , setEmails} = useGmailContext();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  // const [emails] = useState<Email[]>(mockEmails);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const handleEmailSelect = (email: Email , type : string ) => {
   

    if (type === "selection") {
       setSelectedEmail(email);
      // If email is selected from the list, mark it as read
      email.read = true;
      
    }

    if (type === "starred") {
  const updatedEmails = emails.map(e =>
    e._id === email._id ? { ...e, starred: !e.starred } : e
  );

  setEmails(updatedEmails); // Assuming useState for emails
}


    
    // On mobile, show the detail view
    if (window.innerWidth < 1024) {
      setIsMobileDetailView(true);
    }
  };

  const handleBackToList = () => {
    setIsMobileDetailView(false);
  };

  return (
    <Layout>
      <div className="h-full flex">
        <div className={`w-full lg:w-1/3 xl:w-2/5 h-full ${isMobileDetailView ? 'hidden lg:block' : 'block'}`}>
          <EmailList 
            emails={emails} 
            onEmailSelect={handleEmailSelect}
            selectedEmail={selectedEmail}
          />
        </div>
        
        <div className={`w-full lg:w-2/3 xl:w-3/5 h-full ${isMobileDetailView ? 'block' : 'hidden lg:block'}`}>
          <EmailDetail 
            email={selectedEmail} 
            onBack={handleBackToList}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Box;
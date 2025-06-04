import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../utils/api";

// 1. Define the type for your context value
interface GmailContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  accounts: Account[] | null;
  setSelectedAccount: (account: Account | null) => void;
  selectedAccount?: Account | null;
  handleAddAccount: (
    email: string,
    appPassword: string
  ) => Promise<void>;
  fetchCredentials: () => Promise<void>;
 emails: any[]; // Adjust type as needed
 makeEmailStarred: (starred: boolean, emailId: string) => Promise<void>;
fetchLast30Days: () => Promise<void>;

  
}

// 2. Create the context with a default value or `null`
const GmailContext = createContext<GmailContextType | null>(null);

// 3. Provider component
interface GmailProviderProps {
  children: ReactNode;
}

interface Account {
  _id: string;
  email: string;
  provider: string;
  unread: number;
}

export const GmailProvider = ({ children }: GmailProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [emailCred, setEmailCred] = useState<Account[] | null>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [emails, setEmails] = useState<any[]>([]); // Adjust type as needed
  
  const fetchCredentials = async () => {
    try {
      await api.get("/emailcred").then((res) => {
        if (res.data && res.data.cred) {
          setEmailCred(res.data.cred);
        }
      });
    } catch (error) {
      console.log("Error fetching email credentials:", error);
    }
  };

  const handleAddAccount = async (email: string, appPassword: string) => {
    try {
      const response = await api.post("/emailcred", {
        email,
        password:appPassword,
      });
      if (response.data && response.data.cred) {
        setEmailCred((prev) => [...(prev || []), response.data.cred]);
        setSelectedAccount(response.data.cred);
      }
      await fetchCredentials()
    } catch (error) {
      console.error("Error adding email account:", error);
      
    }
  };

  const fetchEmails = async () => {
    if (!selectedAccount) return;

    try {
      const response = await api.get(`/email/${selectedAccount._id}`);
      setEmails(response?.data?.emails);
      // Handle the fetched emails as needed
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }

  const makeEmailStarred = async(starred : Boolean , emailId : string)=>{
    if (!selectedAccount) return;

    try {
       await api.patch(`/email/starred/${emailId}`, { starred });
       fetchEmails(); // Refresh emails after updating starred status
    } catch (error) {
      console.error("Error updating starred status:", error);
    }
  }

  const fetchLast30Days = async()=>{
     if (!selectedAccount) return;
     try {
      await api.post(`/email/fetch/${selectedAccount._id}`)
      await fetchEmails();
      
     } catch (error) {
      
     }
  }
   



  useEffect(() => {
    if (selectedAccount) {
      fetchEmails();
    }
  }
  , [selectedAccount]);
  
 

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    if (emailCred && emailCred.length > 0) {
      setSelectedAccount(emailCred[0]);
    }
  }, [emailCred]);

  return (
    <GmailContext.Provider value={{
      user,
      setUser,
      emails,
      accounts: emailCred,
      setSelectedAccount,
      selectedAccount,
      handleAddAccount,
      fetchCredentials ,
      makeEmailStarred,
      fetchLast30Days
    }}>
      {children}
    </GmailContext.Provider>
  );
};

// 4. Custom hook for easier consumption
export const useGmailContext = () => {
  const context = useContext(GmailContext);
  if (!context) {
    throw new Error("useGmailContext must be used within a GmailProvider");
  }
  return context;
};

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../utils/api";
// import { bulkUpdateEmails } from '../utils/api'; // इसे हटा दें

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
  updateEmailStatus: (type : string, emailId: string) => Promise<void>;
  fetchLast30Days: () => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  loading: boolean;
  setEmails: (emails: any[]) => void;
  setFolder : (folder : string) => void;
  folder : string;
  setCounts : (counts : any) => void;
  counts : any;
  bulkUpdateEmails: (emailIds: string[], action: 'archive' | 'trash' | 'inbox') => Promise<any>;
  searchEmails: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  checkAuth: () => Promise<void>;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages , setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [folder , setFolder ] = useState("inbox")
  const [counts, setCounts] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      await api.get("/emailcred").then((res) => {
        if (res.data && res.data.cred) {
          setEmailCred(res.data.cred);
        }
      });
    } catch (error) {
      console.log("Error fetching email credentials:", error);
    }finally{
      setLoading(false);
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

  const checkAuth = async () => {
    try {
      await api.get('/user/check-auth');
    } catch (error: any) {
      if (error?.response?.status === 403) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
  };

  const fetchEmails = async () => {
    if (!selectedAccount) return;
    try {
    setLoading(true);
      let url = `/email/${selectedAccount._id}?n=20&p=${currentPage}&folder=${folder}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const response = await api.get(url);
    
      setEmails(response?.data?.emails);
      setTotalPages(response?.data?.totalPages || 0);
      
      // Handle the fetched emails as needed
    } catch (error) {
      console.error("Error fetching emails:", error);
    }finally {
   setLoading(false);
    }
  }

  const updateEmailStatus = async(type :string  , emailId : string)=>{
    if (!selectedAccount) return;
    try {
       await api.patch(`/email/status/${emailId}`, { type : type });
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


   async function fetchEmailCounts() {
    if (selectedAccount) {
      const res = await api.get(`/email/counts/${selectedAccount._id}?folder=${folder}`);
      setCounts(res.data)

      
    }
  }
   



  useEffect(() => {
    if (selectedAccount) {
      fetchEmails();
    }
  }
  , [selectedAccount , currentPage , folder , searchQuery ]);
  
 

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    if (emailCred && emailCred.length > 0) {
      setSelectedAccount(emailCred[0]);
    }
  }, [emailCred]);

  useEffect(()=>{
    if (selectedAccount) {
      fetchEmailCounts()
      
    }
  },[selectedAccount,folder,emails])

  const bulkUpdateEmails = async (emailIds: string[], action: 'archive' | 'trash' | 'inbox') => {
    if (!selectedAccount) return;
    try {
      const res = await api.post('/email/bulk-update', { emailIds, action });
      return res.data;
    } catch (error) {
      console.error('Bulk update failed:', error);
      throw error;
    }
  };

  const searchEmails = (query: string) => {
    setSearchQuery(query);
  };

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
      updateEmailStatus,
      fetchLast30Days,
      currentPage,
      setCurrentPage,
      totalPages ,
      loading,
      setEmails,
      setFolder,
      folder,
      setCounts,
      counts,
      bulkUpdateEmails,
      searchEmails,
      searchQuery,
      setSearchQuery,
      checkAuth,
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

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GmailProvider } from './contexts/GmailContext.tsx';

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
  <GmailProvider>
    <App />
   </GmailProvider>
  </BrowserRouter>
);

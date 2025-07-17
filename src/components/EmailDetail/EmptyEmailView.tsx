import { MailOpen, Star, Search, Clock, FileText } from 'lucide-react';

const EmptyEmailView = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full">
        {/* Icon with subtle animation */}
        <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full animate-pulse">
          <MailOpen className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-medium text-gray-700 mb-2">No email selected</h3>
        <p className="text-gray-500 mb-6">Choose a message from your inbox to start reading</p>
       </div>
    </div>
  );
};

export default EmptyEmailView;
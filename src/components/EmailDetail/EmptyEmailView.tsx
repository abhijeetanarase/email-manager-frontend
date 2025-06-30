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
        
        {/* Quick action buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Search className="w-4 h-4" />
            Search emails
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Star className="w-4 h-4" />
            View starred
          </button>
        </div>
        
        {/* OneBox Advertisement */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Email Manager Pro</h4>
                <p className="text-sm text-gray-500 mb-3">Organize your inbox with powerful tools and AI assistance</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    Upgrade now
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Try 30 days free • No credit card required</span>
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-1">Quick tips:</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span> Use keyboard shortcuts
            </li>
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span> Create filters
            </li>
            <li className="flex items-center gap-1">
              <span className="text-blue-500">•</span> Try dark mode
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyEmailView;
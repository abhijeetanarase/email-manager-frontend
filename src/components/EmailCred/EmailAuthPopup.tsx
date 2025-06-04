import { X, Mail, Lock, Info, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface EmailAuthPopupProps {
  onClose: () => void;
  onSubmit: (email: string, appPassword: string) => void;
}

export default function EmailAuthPopup({ onClose, onSubmit }: EmailAuthPopupProps) {
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Trim values before validation
    const trimmedEmail = email.trim();
    const trimmedPassword = appPassword.trim();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    onSubmit(trimmedEmail, trimmedPassword);
    // In a real app, you would handle the submission async
    // and setIsLoading(false) when done
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-screen w-screen">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Connect Email Account</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off" noValidate>
          {error && (
            <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-md text-sm">
              <Info className="mr-2 flex-shrink-0" size={16} />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="text"
                // removed autoComplete and type="email" for no browser validation
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="your@email.com"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              App Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="••••••••"
                autoComplete="off"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For Gmail, create an app password in your Google Account settings
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Connecting..." : "Connect Account"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              We use secure encryption to protect your credentials. App passwords are required for some email providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
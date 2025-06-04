import { useState } from "react";
import { baseUrl } from "../../utils/constants";

export default function GoogleLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); 
    window.location.href = `${baseUrl}/user/google`;

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Welcome to OneBox
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Secure email management solution
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-6">
                Sign in with your Google account to access your Emailbox
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full max-w-xs inline-flex justify-center items-center py-3 px-4 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.3-5.7 7-10.3 7-6.1 0-11-4.9-11-11s4.9-11 11-11c2.6 0 5 .9 6.9 2.4l5.7-5.7C33.3 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.6-.2-3.1-.4-4.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.1l6.6 4.8C14.5 15 18.9 12 24 12c2.6 0 5 .9 6.9 2.4l5.7-5.7C33.3 7.1 28.9 5 24 5c-7.4 0-13.8 4-17.3 9.1z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c4.9 0 9.3-1.9 12.6-5l-5.8-4.8C28.9 35.9 26.5 37 24 37c-4.6 0-8.7-2.7-10.3-7l-6.5 5c3.4 5.2 9.8 9 16.8 9z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-0.7 1.9-1.9 3.6-3.4 4.9l0.1 0.1 5.8 4.8C39.5 35.3 44 30.5 44 24c0-1.6-.2-3.1-.4-4.5z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Box from "./pages/Box";
import { Routes, Route, Navigate } from "react-router-dom";
import GoogleLoginPage from "./components/login/GoogleLoginPage";
import LoginSuccess from "./components/login/LoginSucess";
import { Toaster } from "react-hot-toast";
import "./toast.css"

// PrivateRoute component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const token = localStorage.getItem("authToken");

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Box />
            </PrivateRoute>
          }
        />
        <Route
          path="/success"
          element={
            <LoginSuccess/>
          }
        />
        <Route path="/login" element={<GoogleLoginPage />} />
      </Routes>
 <Toaster
  position="bottom-right"
  toastOptions={{
    duration: 3000,
    className: 'font-sans text-sm bg-background text-foreground border border-border rounded-md shadow-md mb-5xl px-4 py-3',
    success: {
      className: 'font-sans text-sm bg-background text-foreground border border-border rounded-md shadow-md px-4 py-3 border-l-4 border-l-success',
      iconTheme: {
        primary: 'hsl(var(--success))',
        secondary: 'hsl(var(--success-foreground))'
      }
    },
    error: {
      className: 'font-sans text-sm bg-background text-foreground border border-border rounded-md shadow-md px-4 py-3 border-l-4 border-l-destructive',
      iconTheme: {
        primary: 'hsl(var(--destructive))',
        secondary: 'hsl(var(--destructive-foreground))'
      }
    }
  }}
/>
    
    </>
  );
};

export default App;

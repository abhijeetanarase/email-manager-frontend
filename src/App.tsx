import Box from "./pages/Box";
import { Routes, Route, Navigate } from "react-router-dom";
import GoogleLoginPage from "./components/login/GoogleLoginPage";
import LoginSuccess from "./components/login/LoginSucess";
import { Toaster } from "react-hot-toast";

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
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;

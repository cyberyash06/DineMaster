//App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Sidebar from "./components/ui/Sidebar";
import AppRoutes from "./routes/Approutes";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Toaster } from "sonner";

function Layout() {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/register"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {!shouldHideLayout && <Sidebar />}
      <main className={`flex-1 bg-gray-50 overflow-y-auto ${!shouldHideLayout ? 'p-4' : ''}`}>
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          {/* Toast notification component */}
          <Toaster richColors position="top-center" closeButton />

          <Routes>
            {/* Direct routes for login/register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* For all other routes, use Layout */}
            <Route path="*" element={<Layout />} />
          </Routes>
        </>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
